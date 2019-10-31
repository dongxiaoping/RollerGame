export enum appMode {
    DEV = 1,
}

export interface Config {
    appMode: number
}

export enum TableLocationType {
    SKY = 1, //天
    MIDDLE = 2, //中
    LAND = 3,  //地
    LANDLORD = 4  //庄
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

export interface DiceCountInfo {
    one: number, //第一个色子点数
    two: number //第二个色子点数
}

//游戏状态
export enum GameState {
    WAIT_BEGIN = 1, //等待游戏开始
    CHOICE_LANDLORD = 2, //选地主
    ROLL_DICE = 3,  //摇色子
    DEAL = 4, //发牌
    BET = 5,  //下注
    SHOW_DOWN = 6,  //比大小
    SHOW_RESULT = 7,  //公布结果
    GAME_OVER = 8  //游戏结束
}

export interface Coordinate {
    x: number,
    y: number
}


export enum EventType {
    GAME_STATE_CHANGE = 1, //游戏状态改变通知
    CHILD_GAME_STATE_CHANGE = 2,  //游戏状态子状态改变通知
    VAL_USER_TYPE_CHANGE = 3, //用户类型改变通知
    GAME_LINK_FINISH = 4,  //游戏环节结束通知
    PUSH_EVENT = 5
}


//游戏状态子状态
export const ChildGameState = {
    WAIT_BEGIN: { PLAY_BUTTON_EVENT: 1 }, //游戏开始按钮被点击通知
    SHOW_DOWN: { OPEN_CARD_NOTICE: 2 }, //翻牌通知
    ROLL_DICE: { DICE_COUNT: 3 } //色子点数通知
}

export interface ChildGameParam {
    parentState: GameState,
    childState: number,
    val?: any
}

export enum PushEventType {
    MEMBER_CHANGE = 1, //人员改变、进来或者出去了
    LANDLORD_CHANGE = 2, //地主改变通知
    BET_CHIP_CHANGE = 3 // 下注改变通知
}

export interface PushEventPara {
    eventType: PushEventType
    info: any
}

export const SeatLocaionList = {
    landlord: {
         landlord: { x: 200, y: 100 }, 
         members: [
             { x: 200, y: 100 },
             { x: 200, y: 200 },
             { x: 200, y: 300 },
             { x: 200, y: 400 },
             { x: 200, y: 500 },
             { x: 200, y: 600 },
             { x: 200, y: 700 }
            ]
         },
    member: { 
        landlord: { x: 400, y: 100 }, 
        members: [
            { x: 200, y: 100 },
            { x: 200, y: 200 },
            { x: 200, y: 300 },
            { x: 200, y: 400 },
            { x: 200, y: 500 },
            { x: 200, y: 600 },
            { x: 200, y: 700 }
        ] 
    }
}

