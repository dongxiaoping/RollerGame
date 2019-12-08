import { appMode } from './Const'

interface Config {
  appMode: appMode
  serverAddress: string //服务器接口地址
  websocketAddress: string //websocket服务器地址
  requestTimeoutTime: number //ms 超时时间
}
export const config: Config = {
  appMode: appMode.SERVER_TEST,
//  serverAddress: 'http://127.0.0.1/phpserver/public/index.php',
  serverAddress: 'http://120.26.52.88/phpserver/public/index.php',
  websocketAddress: 'ws://120.26.52.88:2346',
  requestTimeoutTime: 2000
}