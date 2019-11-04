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
    WAIT_BEGIN: { PLAY_BUTTON_EVENT: 1 }, //1 游戏开始按钮被点击通知
    CHOICE_LANDLORD: { LOCAL_BE_LANDLORD_RESULT: 4, LANDLORD_HAS_CHANGE: 5 },  //4 本人是否愿意当地主通知 5地主改变通知
    SHOW_DOWN: { OPEN_CARD_NOTICE: 6 }, //6 翻牌动画结束通知
    SHOW_RESULT:{FLIP_ANIMATION:5},  
    ROLL_DICE: { DICE_COUNT: 3 } //3 色子点数通知
}

export interface ChildGameParam {
    parentState: GameState,
    childState: number,
    val?: any
}

export enum PushEventType {
    MEMBER_CHANGE = 1, //人员改变、进来或者出去了
    LANDLORD_CHANGE = 2, //地主改变通知
    BET_CHIP_CHANGE = 3, // 下注改变通知
    LANDLOAD_WELCOME = 4 //向指定人员发出地主邀请通知
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
export const chipPoint = {
    1: { x: -227, y: 81 }, //SKY
    2: { x: 209, y: 79 },  //LAND
    3: { x: 3, y: -74 }, //MIDDLE
    4: { x: -4, y: 76 },  //BRIDG
    5: { x: -190, y: -31 },  //SKY_CORNER
    6: { x: 189, y: -26 }  //LAND_CORNER
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

export interface BetRecord {
    id: string
    userId: string
    raceId: string
    betLocaion: betLocaion
    moneyValue: number
}

export interface BetScore {
    raceId: string,
    userId: string,
    userName:string,
    sky: number,
    land: number,
    middle: number,
    bridg: number,
    skyCorner: number,
    landCorner: number,
    score:number //本局比赛的得分
}
export enum gameMemberType {
    LANDLORD = 1, //房主
    PLAYER = 2,  //玩家
    VISITOR = 3   //观众
}

export enum memberState {
    OnLine = 1, //在线
    OffLine = 2,  //离线
    KickOut = 3   //被踢出
}

export interface GameMember {
    userId: string
    roleType: gameMemberType
    nick: string
    icon: string
    score?: number  //本房间当前成员总分数
    modTime: number //最后一次修改时间
    state: memberState
}

export enum raceState {
    NOT_BEGIN = 1, //没开始
    CHOICE_LANDLORD = 2, //选地主
    ROLL_DICE = 3,  //摇色子
    DEAL = 4,  //发牌
    BET = 5,  //下注
    SHOW_DOWN = 6,  //比大小
    SHOW_RESULT = 7,  //揭晓结果
    FINISHED = 8  //完成
}

export interface raceRecord {
    raceId: string
    landlordId: string //地主ID
    num: number //场次编号
    betInfo?: any[] //下注信息
    state: raceState
    majongResult?: MajongResult
}

export interface MajongResult {
    sky: DiceCountInfo,
    middle: DiceCountInfo,
    land: DiceCountInfo,
    landlord: DiceCountInfo
}

export enum roomState {
    OPEN = 1, //创建,房主没点开始，等待玩家进入
    PLAYING = 2,  //进行中
    CLOSE = 3   //关闭
}

export enum playMode {
    LANDLORD = 1, //霸王庄
    TURN = 2, //轮流
}

export interface RoomInfo {
    id: number  //房间编号
    creatUserId: string  //创建者ID
    memberLimit: number  //人员数量限制
    playCount: number  //场次限制
    playMode: playMode  //上庄模式
    costLimit: number  //消费上限
    roomState: roomState  //房间状态
    oningRaceNum?: number //当前进行中的场次编号
}



