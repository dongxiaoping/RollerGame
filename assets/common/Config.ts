interface Config {
  serverAddress: string //服务器接口地址
  websocketAddress: string //websocket服务器地址
  loginPageAddress:string
  registerPageAddress:string
  cheatSwitchNumber: number //cheat开关号码
  version: string //版本号
}
export const config: Config = {
//  serverAddress: 'http://127.0.0.1/phpserver/public/index.php',
  //websocketAddress: 'ws://127.0.0.1:2346',
  serverAddress: 'https://www.toplaygame.cn/phpserver/public/index.php',
  loginPageAddress: 'https://www.toplaygame.cn/login/login.html',//登录页面地址
  registerPageAddress: 'https://www.toplaygame.cn/login/register.html',//注册页面地址
  websocketAddress: 'wss://www.toplaygame.cn/wss',
  cheatSwitchNumber: 34850239,
  version: 'v1.2.6'
}