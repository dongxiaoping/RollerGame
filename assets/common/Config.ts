import { appMode } from './Const'

interface Config {
    appMode: number
    localXiaZhuLimiTime:number ////本地下注的限制时间 单位s
}
export const config: Config = {
    appMode: appMode.DEV,
    localXiaZhuLimiTime: 3
}