import { appMode } from './Const'

interface Config {
    appMode: appMode
    serverAddress: string //服务器接口地址
    requestTimeoutTime:number //ms 超时时间
}
export const config: Config = {
    appMode: appMode.SERVER_TEST,
    serverAddress: 'http://127.0.0.1/phpserver/public/index.php',
    requestTimeoutTime: 2000
}