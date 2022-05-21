<template>

</template>

<script>
  import { useWsStore } from '@/store/modules/ws'
  import { fullScreen } from '@/utils/screen'
  import VabDialog from '@/plugins/VabDialog'
  import { Terminal } from 'xterm'
  // import { WebLinksAddon } from 'xterm-addon-web-links'
  // import { SearchAddon } from 'xterm-addon-search'

  export default defineComponent({
    name: 'HostShell',
    setup() {
      const state = reactive({
        fullScreen: fullScreen,
        dialogVisible: false,
        terminal: null,
        terminalRef: null,
        hostInfo: {},
        wsMessage: {
          type: 'host-shell',
          action: 'create',
          param: {
            shell: '',
            ip: '',
            port: '',
            user: '',
          },
        },
      })
      const showShell = (row) => {
        if (row.id) {
          state.hostInfo = row
          state.dialogVisible = true
          const wsStore = useWsStore()
          state.wsMessage.action = 'create'
          state.wsMessage.param.ip = row.ip
          state.wsMessage.param.port = row.port.toString()
          state.wsMessage.param.user = row.user
          wsStore.sendWsMessage(state.wsMessage)
          nextTick(() => {
            if (!state.terminal) {
              const terminal = new Terminal()
              // Load WebLinksAddon on terminal, this is all that's needed to get web links
              // working in the terminal.
              // terminal.loadAddon(new WebLinksAddon())
              // terminal.loadAddon(new SearchAddon())
              terminal.open(state.terminalRef)
              state.terminal = terminal
            }
          })
        }
      }
      const close = () => {
        // 关闭shell
        state.dialogVisible = false
      }
      return {
        ...toRefs(state),
        showShell,
        close,
      }
    },
  })
</script>
