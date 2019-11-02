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

export enum betLocaion {
    SKY = 1,
    LAND = 2,
    MIDDLE = 3,
    BRIDG = 4,
    SKY_CORNER = 5,
    LAND_CORNER = 6
}

export enum EventType {
    GAME_STATE_CHANGE = 1, //游戏状态改变通知
    CHILD_GAME_STATE_CHANGE = 2,  //游戏状态子状态改变通知
    VAL_USER_TYPE_CHANGE = 3, //用户类型改变通知
    GAME_LINK_FINISH = 4,  //游戏环节结束通知
    PUSH_EVENT = 5,  //推送事件通知，和服务器端的推送事件一一对应
    RACE_STATE_CHANGE = 6,  //场次状态改变通知
}

//场次状态改变参数
export interface RaceStateChangeParam {
    raceId: string
    ranceNum: number
    state: RaceState
}

export enum RaceState {
    BEGIN = 1,
    END = 2
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
    info?: any
}

export interface PushEventParaInfo {
    raceId: string
    userId: string
    betLocation: betLocaion
    fromVal: number
    toValue: number
}

export const SeatLocaionList = {
    member: {
        landlord: { x: 1, y: -170 },
        chipPoint:{
            1:{x:209,y:-66}, //SKY
            2:{x:-227,y:-71},  //LAND
            3:{x:-7,y:93}, //MIDDLE
            4:{x:8,y:-54},  //BRIDG
            5:{x:163,y:46},  //SKY_CORNER
            6:{x:-182,y:44}  //LAND_CORNER
        },
        members: [
            { x: 2.4, y: 187 },
            { x: 369, y: 42 },
            { x: -368, y: 42 },
            { x: -268, y: 131 },
            { x: 265, y: 131 },
            { x: -397, y: -90 },
            { x: 393, y: -90 }
        ]
    },
    landlord: {
        landlord: { x: 9.3, y: 184 },
        chipPoint:{
            1:{x:-227,y:81}, //SKY
            2:{x:209,y:79},  //LAND
            3:{x:3,y:-74}, //MIDDLE
            4:{x:-4,y:76},  //BRIDG
            5:{x:-190,y:-31},  //SKY_CORNER
            6:{x:189,y:-26}  //LAND_CORNER
        },
        members: [
            { x: -6, y: -198 },
            { x: -385, y: -20 },
            { x: 393, y: -20 },
            { x: -398, y: 122 },
            { x: 401, y: 122 },
            { x: -261, y: -133 },
            { x: 264, y: -133 }
        ]
    }
}

//翻牌事件传递参数
export interface OpenCardEventValue {
    tableLocationType: TableLocationType
    oneValue: number
    twoValue: number
}

export const IconValueList = {
    1: ['1_1'],
    2: ['2_1', '2_2'],
    3: ['3_1'],
    4: ['4_1', '4_2', '4_3', '4_4'],
    5: ['5_1', '5_2', '5_3', '5_4', '5_5'],
    6: ['6_1', '6_2'],
    7: ['7_1'],
    8: ['8_1'],
    9: ['9_1', '9_2', '9_3', '9_4', '9_5', '9_6', '9_7', '9_8', '9_9'],
    0.5: ['1_1']
}

//麻将值对比结果
export enum CompareMahjRe {
    BIG = 1,  //大
    SMALL = 2, //小
    EQ = 3 //相等
}

export enum MajhongValueType {
    DUI_ZI = 1, //对子
    BI_SHI = 2, //鄙十
    DIAN = 3 //点
}



