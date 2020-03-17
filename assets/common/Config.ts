interface Config {
  serverAddress: string //服务器接口地址
  websocketAddress: string //websocket服务器地址
  version: string //版本号
}
export const config: Config = {
  //serverAddress: 'http://127.0.0.1/phpserver/public/index.php',
  //websocketAddress: 'ws://127.0.0.1:2346',
  serverAddress: 'https://www.toplaygame.cn/phpserver/public/index.php',
  websocketAddress: 'wss://www.toplaygame.cn/wss',
  version: 'test-1.0.44'
}