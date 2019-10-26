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

//趋势表图状态
export const TrendMapState = {
    HIDDEN: 1,//隐藏
    FOLD: 2,//折叠
    SHOW: 3 //展示
}

//游戏状态
export const GameState = {
    WAIT_BEGIN: 1, //等待游戏开始
    CHOICE_LANDLORD: 2, //选地主
    ROLL_DICE: 3,  //摇色子
    DEAL: 4, //发牌
    BET: 5,  //下注
    SHOW_DOWN: 6,  //比大小
    SHOW_RESULT: 7,  //公布结果
    GAME_OVER: 8  //游戏结束
}


export enum EventType {
    GAME_STATE_CHANGE = 1, //游戏状态改变通知
    VAL_USER_TYPE_CHANGE = 2, //用户类型改变通知
    DICE_COUNT = 3, //色子点数通知
}