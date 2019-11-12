import { appMode } from './Const'

interface Config {
    appMode: number
    localXiaZhuLimiTime:number //本地下注的限制时间 单位s
    raceResultPanelShowTime:number //单局结果面板显示持续时间设置 单位 ms
}
export const config: Config = {
    appMode: appMode.DEV,
    localXiaZhuLimiTime: 3,
    raceResultPanelShowTime: 5000
}