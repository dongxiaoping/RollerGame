export enum TableLocationType {
    SKY = 'sky', //天
    MIDDLE = 'middle', //中
    LAND = 'land',  //地
    LANDLORD = 'landlord'  //庄
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
    one: number, //第一个的值
    two: number //第二个的值
}

export enum roomState {
    OPEN = 1, //创建,房主没点开始，等待玩家进入
    PLAYING = 2,  //进行中
    CLOSE = 3   //关闭
}

export interface Coordinate {
    x: number,
    y: number
}

export enum betLocaion {
    SKY = 'sky',
    LAND = 'land',
    MIDDLE = 'middle',
    BRIDG = 'bridg',
    SKY_CORNER = 'skyCorner',
    LAND_CORNER = 'landCorner'
}

//应用中事件定义
export enum EventType {
    ROOM_STATE_CHANGE_EVENT = 1, //房间状态改变通知   （数据改变触发）
    RACE_STATE_CHANGE_EVENT = 2,  //当前比赛状态改变通知 （数据改变触发）
    MEMBER_DELETE_FROM_ROOM = 3,  //用户退出房间(这种情况，数据库中也没有用户数据，不包括用户离线等情况)
    LOCAL_NOTICE_EVENT = 4,  //本地通知事件 （本地对本地 和数据改变无关）
    LANDLORD_CAHNGE_EVENT = 5,//地主改变通知 （数据改变触发）
    BET_CHIP_CHANGE_EVENT = 6, //下注改变通知 （数据改变触发）
    RACING_NUM_CHANGE_EVENT = 7, //进行中的比赛场次号改变通知（数据改变触发）
    NEW_MEMBER_IN_ROOM = 8, //有新成员加入房间
    MEMBER_STATE_CHANGE = 9, //成员状态有改变
    BET_CANCE_NOTICE = 10,//用户取消下注通知
}

//单场游戏状态
export enum RaceState {
    NOT_BEGIN = 1, //没开始
    CHOICE_LANDLORD = 2, //选地主
    DEAL = 3,  //发牌
    BET = 4,  //下注
    SHOW_DOWN = 5,  //比大小 包括大小的通知动画 比如通赔
    FINISHED = 6  //完成
}


//场次状态改变参数
export interface RaceStateChangeParam {
    raceId: string
    raceNum: number
    toState: RaceState
}

export enum LocalNoticeEventType { // LOCAL_NOTICE_EVENT 事件的子事件 （本地对本地  和数据状态改变而触发无关）
    PLAY_BUTTON_EVENT = 1, // 游戏开始按钮被点击通知
    LOCAL_BE_LANDLORD_RESULT = 2,  //本人是否愿意当地主结果通知
    ROLL_DICE_FINISHED_NOTICE = 3, //摇色子动画结束通知
    DELIVERY_CARD_FINISHED_NOTICE = 4, //发牌动画执行结束通知
    OPEN_CARD_FINISHED_NOTICE = 5, //翻牌动画结束通知
    SHOW_DOWN_ANIMATION_FINISHED_NOTICE = 6, //比大小动画结束通知
    OPEN_CARD_REQUEST_NOTICE = 7, //要求本地翻牌通知
    LOCAL_TIME_XIAZHU_FINISHED_NOTICE = 8, //本地设置的下注段时间完毕通知
    LOCAL_BET_CLICK_NOTICE = 9, //本地下注按钮点击通知
    TO_LOBBY_EVENT = 10, //返回到大厅通知
    BACK_MUSIC_STATE_CHANGE_NOTICE = 11, //背景音乐开关改变通知
    TO_SHOW_START_BUTTON = 12, //通知显示开始按钮
    SOCKET_CONNECT_NOTICE = 13 //socket连接结果通知
}

export interface LocalNoticeEventPara {
    type: LocalNoticeEventType
    info?: any
}

export const chipPoint = {
    sky: { left: { x: -277, y: 81 }, right: { x: -151, y: 81 } }, //SKY
    land: { left: { x: 151, y: 79 }, right: { x: 285, y: 79 } },  //LAND
    middle: { left: { x: -66, y: -64 }, right: { x: 69, y: -64 } }, //MIDDLE 
    bridg: { left: { x: -60, y: 79 }, right: { x: 65, y: 79 } },  //BRIDG 
    skyCorner: { left: { x: -246, y: -16 }, right: { x: -149, y: -16 } },  //SKY_CORNER
    landCorner: { left: { x: 148, y: -31 }, right: { x: 240, y: -31 } }  //LAND_CORNER
}

export enum MajhongValueType {
    DUI_ZI = 1, //对子
    BI_SHI = 2, //鄙十
    DIAN = 3 //点
}

export interface BetRecord {
    id?: string
    roomId?: number
    raceNum: number
    userId: string
    raceId?: string
    sky: number
    middle: number
    land: number
    skyCorner: number
    landCorner: number
    bridg: number
    creatTime?: string
    modTime?: string
}


export enum gameMemberType {
    MANAGE = 1, //房主
    PLAYER = 2,  //玩家
    VISITOR = 3   //观众
}

export enum memberState {
    OnLine = 1, //在线
    OffLine = 2,  //离线
    KickOut = 3   //被踢出
}

export interface GameMember {
    id?: string
    roomId?: number
    userId: string
    roleType: gameMemberType
    nick: string
    icon: string
    score?: number  //本房间当前成员总分数
    creatTime?: string
    modTime?: string
    state: memberState
}

export interface raceRecord {
    id: string
    roomId?: number
    raceNum: number //场次编号
    playState: RaceState   //比赛状态
    landlordScore?: DiceCountInfo
    skyScore?: DiceCountInfo
    middleScore?: DiceCountInfo
    landScore?: DiceCountInfo
    landlordId: string //地主ID
    points: DiceCountInfo  //色子点数信息集合
    skyResult?: CompareDxRe //接口有 天输赢
    middleResult?: CompareDxRe //接口有 中输赢
    landResult?: CompareDxRe //接口有 地输赢
    skyCornerResult?: CompareDxRe //接口有  天角输赢
    landCornerResult?: CompareDxRe //接口有 地角输赢
    bridgResult?: CompareDxRe //接口有 桥输赢
    creatTime?: string
    modTime?: string

}

export interface MajongResult {
    sky: DiceCountInfo,
    middle: DiceCountInfo,
    land: DiceCountInfo,
    landlord: DiceCountInfo
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
    roomFee: number //房间费用
    roomPay: number //付费模式
    costLimit: number  //消费上限
    roomState: roomState  //房间状态
    oningRaceNum: number //当前进行中的场次编号
    creatTime?: string
    modTime?: string
}

export interface BetChipChangeInfo {
    raceNum: number
    userId: string
    betLocation: betLocaion
    fromVal?: number
    toValue?: number
}

//每个位置的输赢 true表示赢 false 表示输
export interface LocationResultDetail {
    sky: CompareDxRe
    land: CompareDxRe
    middle: CompareDxRe
    bridg: CompareDxRe
    sky_corner: CompareDxRe
    land_corner: CompareDxRe
}

export interface ResponseData {
    data: any,
    message: string,
    status: ResponseStatus
}

export enum ResponseStatus {
    SUCCESS = 1,
    FAIL = 0
}


//开房付款模式
export enum CreateRoomPayModel {
    AA = 1,  //AA制
    DAI_KAI = 2 //代开
}

//大小比较结果
export enum CompareDxRe {
    BIG = 'w',  //大
    SMALL = 's', //小
    EQ = 'e' //相等
}

//进入房间的模式
export enum EnterRoomModel {
    NUMBER_PANEL = 1,  //数字面板
    SHARE = 2, //通过分享
    CREATE_ROOM = 3, //通过创建房间
    EMULATOR_ROOM = 4 //模拟房间
}

export interface EnterRoomParam {
    model: EnterRoomModel,
    userId: string,
    roomId: number
}



export interface MemberInChairData {
    userId: string,
    state: memberState,
    userName?: string,
    userIcon?: string //模拟房间不用传这些
    xiaZhuVal: number //当前场下注值
}

export interface BetNoticeData {
    userId: string,
    roomId: number,
    raceNum: number,
    betLocation: betLocaion,
    betVal?: number
}

export interface raceResultData {
    roomId?: number,
    raceNum?: number,
    userId: string,
    score: number,
    nick: string,
    icon: string
}


export interface chipObData {
    userId: string,
    chipVal: number,
    betLocation: betLocaion
}

//进入房间错误类型
export enum EnterRoomFail {
    param_error = '参数错误', //传参错误
    user_not_exist = '用户不存在', //用户不存在
    room_not_exist = '房间不存在', //房间不存在
    room_not_open_state = '游戏已开始，无法进入', //游戏已开始，无法进入
    diamond_not_enough = '钻数量不够，请充值', //钻石不够，无法进入该房间
    member_count_limit = '房间已满，无法进入', //房间已满，无法进入
    room_close = '房间已关闭',
    in_room_fail = '进入房间异常', //进入房间，插入数据库异常
    interface_fail = '接口请求异常' //接口异常
}

//创建房间错误类型
export enum CreateRoomFail {
    param_error = '参数错误', //传参错误
    interface_fail = '接口请求异常', //接口异常
    user_not_exist = '用户不存在', //用户不存在
    diamond_not_enough = '钻余额不足',
    race_error = '比赛创建失败',
    cash_error = '钻扣除失败',
    faill = '房间创建失败'
}

export interface NoticeInfo {
    roomId?: number
    raceNum?: number //当前是第几局
    raceCount?: number //房间比赛有几场
    landlordId?: string //当前局的地主ID
    userId?: string
}


export enum NoticeType {
    startRoomGame = 'startRoomGame', //开始房间的比赛 房主调用
    landlordSelected = 'landlordSelected', //玩家选择当地主通知
    enterRoom = 'enterRoom', //普通玩家进入房间
    outRoom = 'outRoom', //玩家退出socket的房间，如果房间比赛未开始，同时也会退出数据库中的房间
    raceBet = 'raceBet', //玩家下注通知
    cancelRaceBet = 'cancelRaceBet' //取消指定区域的下注
}

export interface NoticeData {
    type: NoticeType
    info: NoticeInfo
}

export interface MemberStateData {
    userId: string
    state: memberState
}

export const InterfaceUrl = {
    CREATE_ROOM: '/race/room/create_room',
    LOGIN_IN_ROOM: '/race/room/login_in_room',
    COST_DIAMOND: '/race/user/cost_diamond_in_room',
    CREATE_VISIT: '/race/user/create_visit_account',
    CANCEL_BET: '/race/betrecord/cancel_bet_by_location',
    IS_ROOM_EXIST: '/race/room/is_room_exist'
}

export interface TipDialogParam {
    sureButtonShow: boolean, //是否显示sure按钮
    cancelButtonShow: boolean,  //是否显示取消按钮
    content: string,  //提示文字内容显示
    cancelButtonAction: TipDialogButtonAction, //取消按钮行为
    sureButtonAction: TipDialogButtonAction //确认按钮行为
}

//提示框行为类型
export enum TipDialogButtonAction {
    SOCKET_CONNECT = 1, //发起socket连接
    OUT_ROOM = 2, //退出房间
    RECHARGE = 3, //充值
}



