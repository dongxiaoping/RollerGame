export enum appMode {
    DEV = 1,
}

export interface Config {
    appMode: number
}

export class PromiseParam {
    result: number
    extObject?: any
    msg?: string
}

export const PromiseResult = {
    SUCCESS: 0, //通用成功
    ERROR: -1 //通用失败
}