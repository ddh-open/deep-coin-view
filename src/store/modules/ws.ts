import { WebSocketMessage, WebSocketType } from '/#/store'

export const useWsStore = defineStore('ws', {
  state: (): WebSocketType => ({
    messages: [],
    ws: null,
  }),
  getters: {
    getMessages: (state) => state.messages,
  },
  actions: {
    addMessage(message: string) {
      this.messages.push(message)
    },
    setWs(ws: any) {
      this.ws = ws
    },
    sendWsMessage(message: WebSocketMessage) {
      if (this.ws != null) {
        this.ws.send(message)
      }
    },
  },
})
