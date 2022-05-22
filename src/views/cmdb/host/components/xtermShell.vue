<template>
  <div class="service-detail-container-exec">
    <el-card class="box-card box-card-service">
      <div class="log-container">
        <div class="log-content">
          <div :id="id"></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { useWsStore } from '@/store/modules/ws'
  import { Terminal } from 'xterm'
  import { FitAddon } from 'xterm-addon-fit'
  import 'xterm/css/xterm.css'

  export default defineComponent({
    name: 'XtermShell',
    props: {
      id: {
        required: true,
        type: String,
      },
      ip: {
        required: true,
        type: String,
      },
      port: {
        required: true,
        type: String,
      },
      user: {
        required: true,
        type: String,
      },
    },
    setup(props) {
      const state = reactive({
        term: null,
        currentCmd: '',
        currentIndex: '',
        currentCmdX: 0,
        currentCmdY: 0,
        cmdList: [],
        wsMessage: {
          type: 'host-shell',
          action: 'exec',
          param: {
            shell: '',
            ip: '',
            port: '',
            user: '',
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
        state.term.writeln(
          '****************系统信息：正在连接主机****************'
        )
        state.term.onData((data) => {
          if (data.length > 3) {
            state.currentCmd += data
            state.term.write(data)
          }
        })

        // 添加事件监听器，支持输入方法
        state.term.onKey((e) => {
          const printable =
            !e.domEvent.altKey &&
            !e.domEvent.altGraphKey &&
            !e.domEvent.ctrlKey &&
            !e.domEvent.metaKey
          console.log(e.domEvent.keyCode)
          if (e.domEvent.keyCode === 13) {
            // 回车
            console.log(state.currentCmd)
            state.wsMessage.param.shell = state.currentCmd
            state.wsMessage.action = 'exec'
            console.log(state.wsMessage)
            wsStore.sendWsMessage(state.wsMessage)
            state.term.write('\r\n')
            state.wsMessage.param.shell = ''
            state.currentCmd = ''
          } else if (e.domEvent.keyCode === 8) {
            // back 删除的情况
            if (
              !(
                state.currentCmdX === state.term._core.buffer.x &&
                state.currentCmdY === state.term._core.buffer.y
              )
            ) {
              state.term.write('\b \b')
              state.currentCmd = state.currentCmd.slice(
                0,
                state.currentCmd.length - 1
              )
              if (
                state.term._core.buffer.x === 0 &&
                state.term._core.buffer.y > state.currentCmdY
              ) {
                state.term._core.buffer.y = state.term._core.buffer.y - 1
                state.term._core.buffer.x = state.sizeCol + 1
              }
            }
          } else if (printable) {
            state.term.write(e.key)
            if (
              e.domEvent.keyCode !== 37 &&
              e.domEvent.keyCode !== 38 &&
              e.domEvent.keyCode !== 39 &&
              e.domEvent.keyCode !== 40
            ) {
              // 记录开始节点
              if (state.currentCmd.length === 0) {
                state.currentCmdX = state.term._core.buffer.x
                state.currentCmdY = state.term._core.buffer.y
              }
              state.currentCmd += e.key
            }
          }
        })

        window.onresize = function () {
          fitAddon.fit()
        }
        state.term.onResize((size) => {
          state.wsMessage.param.cols = size.cols.toString()
          state.sizeCol = size.cols.toString()
          state.wsMessage.param.rows = size.rows.toString()
          state.wsMessage.action = 'resize'
          // wsStore.sendWsMessage(state.wsMessage)
        })
        wsStore.sendWsMessage(state.wsMessage)
        state.term.clear()
        state.term.writeln(
          '\u001b[32;1m****************系统信息：连接已打开****************\u001b[0m'
        )
        fitAddon.fit()
      }
      watch(wsStore.getMessages, (data) => {
        const msg = data.pop()
        if (msg && msg.type !== 'error') {
          state.term.write(msg.data)
          state.wsMessage.uuid = msg.uuid
        }
      })
      onMounted(() => {
        state.id = props.ip
        state.wsMessage.param.user = props.user.toString()
        state.wsMessage.param.ip = props.ip.toString()
        state.wsMessage.param.port = props.port.toString()
        nextTick(() => {
          initTerm()
        })
      })
      return {
        ...toRefs(state),
        initTerm,
        clearCurrentTerm,
      }
    },
  })
</script>

<style lang="scss">
  .service-detail-container-exec {
    position: relative;
    flex: 1;
    overflow: auto;
    font-size: 13px;

    .xterm {
      padding: 15px 10px;
    }

    .text {
      font-size: 13px;
    }

    .item {
      padding: 10px 0;
      padding-left: 1px;

      .icon-color {
        color: #9ea3a9;
        cursor: pointer;
      }

      .icon-color-cancel {
        color: #ff4949;
        cursor: pointer;
      }
    }

    .clearfix::before,
    .clearfix::after {
      display: table;
      content: '';
    }

    .clearfix {
      span {
        color: #999;
        font-size: 16px;
        line-height: 20px;
      }
    }

    .clearfix::after {
      clear: both;
    }

    .alert-warning {
      position: relative;
    }

    .log-container {
      .log-header {
        margin: 0;
        padding: 0.5em 0.8em 0.4em;
        text-align: left;
        background-color: #dfe5ec;

        .tip {
          color: #999;
        }

        .go-to {
          float: right;
          margin: 0 50px 0 0;
          padding: 0;
          font-size: 26px;
        }

        .scroll-switch {
          position: relative;
          top: 6px;
          float: right;
          margin: 0 50px 0 0;

          .el-switch__label--right {
            height: 16px;
          }
        }
      }

      .log-content {
        &::-webkit-scrollbar-track {
          background-color: #f5f5f5;
          border-radius: 6px;
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        }

        &::-webkit-scrollbar {
          width: 8px;
          background-color: #f5f5f5;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #555;
          border-radius: 6px;
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        }

        pre {
          clear: left;
          min-height: 42px;
          margin-top: 0;
          margin-bottom: 0;
          padding-top: 8px;
          color: #f1f1f1;
          font-size: 12px;
          font-family: Monaco, Consolas, monospace;
          line-height: 18px;
          white-space: pre-wrap;
          word-wrap: break-word;
          background-color: #222;
          counter-reset: line-numbering;

          p {
            min-height: 16px;
            margin: 0;
            padding: 0 15px 0 16px;
            cursor: pointer;

            &:hover {
              background-color: #444 !important;
            }
          }
        }
      }
    }

    .realtime-log,
    .search-log {
      ul {
        padding: 0;
      }

      ul > li {
        padding: 15px 0;
        font-size: 15px;
        list-style: none;
        border-top: 1px solid #e6e9f0;

        &:hover {
          background-color: #f5f5f5;
        }
      }
    }

    .box-card {
      width: 480px;
    }

    .box-card-service {
      width: 100%;
    }

    .box-card,
    .box-card-service {
      margin-top: 0;
      border: none;
      box-shadow: none;
    }

    .upper-card {
      margin-top: 0;
    }

    .el-card__header {
      padding: 8px 0;
    }

    .el-card__body {
      padding: 0;
    }

    .el-table {
      color: #445262;
    }

    .el-row {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .el-table .info-row {
      background: #c9e5f5;
    }

    .el-table .positive-row {
      background: #e2f0e4;
    }
  }
</style>
