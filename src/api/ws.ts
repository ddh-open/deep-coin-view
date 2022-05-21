//这里需要引入vuex
// import store from "@/store";

import { WebSocketMessage } from '/#/store'

export default class SocketService {
  static instance = null
  static url = ''
  static Instance(url: string) {
    if (!this.instance) {
      this.url = url
      // @ts-ignore
      this.instance = new SocketService()
    }
    return this.instance
  }
  // 和服务端连接的socket对象
  ws = null
  // 存储回调函数
  callBackMapping = {}
  // 标识是否连接成功
  connected = false
  // 记录重试的次数
  sendRetryCount = 0
  // 重新连接尝试的次数
  connectRetryCount = 0

  //  定义连接服务器的方法
  connect() {
    // 连接服务器
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持WebSocket')
    }
    // let token = $.cookie('123');
    // let token = '4E6EF539AAF119D82AC4C2BC84FBA21F';
    // @ts-ignore
    this.ws = new WebSocket(SocketService.url)
    // 连接成功的事件
    // @ts-ignore
    this.ws.onopen = () => {
      console.log('ws 连接服务端成功了')
      this.connected = true
      // 重置重新连接的次数
      this.connectRetryCount = 0
    }
    // 1.连接服务端失败
    // 2.当连接成功之后, 服务器关闭的情况
    // @ts-ignore
    this.ws.onclose = () => {
      console.log('ws 连接服务端失败')
      this.connected = false
      this.connectRetryCount++
      setTimeout(() => {
        this.connect()
      }, 500 * this.connectRetryCount)
    }
    // 得到服务端发送过来的数据
    // @ts-ignore
    this.ws.onmessage = (msg) => {
      console.log(msg)
      console.log(msg.data, '从服务端获取到了数据')
    }
  }

  // 回调函数的注册
  registerCallBack(socketType: any, callBack: any) {
    // @ts-ignore
    this.callBackMapping[socketType] = callBack
  }

  // 取消某一个回调函数
  unRegisterCallBack(socketType: any) {
    // @ts-ignore
    this.callBackMapping[socketType] = null
  }

  // 发送数据的方法
  send(data: WebSocketMessage) {
    // 判断此时此刻有没有连接成功
    if (this.connected) {
      this.sendRetryCount = 0
      try {
        // @ts-ignore
        this.ws.send(JSON.stringify(data))
      } catch (e) {
        // @ts-ignore
        this.ws.send(data)
      }
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, this.sendRetryCount * 500)
    }
  }
}
