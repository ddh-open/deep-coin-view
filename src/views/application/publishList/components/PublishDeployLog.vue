<template>
  <div class="log-content" style="height: 80vh">
    <div :id="id" style="height: 100%"></div>
  </div>
</template>

<script>
  import { useWsStore } from '@/store/modules/ws'
  import { Terminal } from 'xterm'
  import { FitAddon } from 'xterm-addon-fit'
  import 'xterm/css/xterm.css'

  export default defineComponent({
    name: 'PublishDeployLog',
    props: {
      publishStatus: {
        required: true,
        type: String,
      },
      publishId: {
        required: true,
        type: String,
      },
      publishLogs: {
        required: true,
        type: String,
      },
      id: {
        required: true,
        type: String,
      },
    },
    setup(props) {
      const state = reactive({
        term: null,
        id: '',
        wsMessage: {
          type: 'publish-log',
          action: 'get',
          param: {
            publishId: '',
          },
          uuid: '',
        },
        sizeCol: 0,
      })
      const clearCurrentTerm = () => {
        state.term && state.term.clear()
      }
      const wsStore = useWsStore()
      const initTerm = () => {
        if (state.term != null) return
        state.term = new Terminal({
          fontSize: '12',
          fontFamily: 'Monaco,Consolas,monospace',
          scrollback: 9999999,
        })
        const fitAddon = new FitAddon()
        state.term.loadAddon(fitAddon)
        state.term.open(document.getElementById(state.id))
        state.term.writeln('****************获取日志中****************')
        window.onresize = function () {
          fitAddon.fit()
        }
        // 如果现在有日志， 则写入日志
        if (props.publishLogs) {
          state.term.write(props.publishLogs)
        }
        // 状态是1， 获取ws日志
        if (props.publishStatus === '1') {
          wsStore.sendWsMessage(state.wsMessage)
        }
        state.term.clear()
        fitAddon.fit()
      }
      const initPublish = () => {
        if (props.publishStatus === '1') {
          wsStore.sendWsMessage(state.wsMessage)
        }
      }
      watch(wsStore.getMessages, (data) => {
        const msg = data.pop()
        if (msg && msg.type !== 'error') {
          state.term.write(msg.data)
          state.wsMessage.uuid = msg.uuid
        }
      })
      watch(props, () => {
        state.wsMessage.uuid = props.publishId.toString()
        state.wsMessage.param.publishId = props.publishId.toString()
        if (props.publishLogs) {
          state.term.write(props.publishLogs)
        }
        initPublish()
      })
      onMounted(() => {
        state.id = props.id
        state.wsMessage.uuid = props.publishId.toString()
        state.wsMessage.param.publishId = props.publishId.toString()
        nextTick(() => {
          initTerm()
        })
      })
      return {
        ...toRefs(state),
        initTerm,
        clearCurrentTerm,
        initPublish,
      }
    },
  })
</script>
