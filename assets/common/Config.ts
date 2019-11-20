import { appMode } from './Const'

interface Config {
    appMode: appMode
    localXiaZhuLimiTime:number //本地下注的限制时间 单位s
    raceResultPanelShowTime:number //单局结果面板显示持续时间设置 单位 ms
    serverAddress: string //服务器接口地址
    requestTimeoutTime:number //ms 超时时间
}
export const config: Config = {
    appMode: appMode.SERVER_TEST,
    localXiaZhuLimiTime: 8,
    raceResultPanelShowTime: 5000,
    serverAddress: 'http://127.0.0.1/phpserver/public/index.php',
    requestTimeoutTime: 2000
}