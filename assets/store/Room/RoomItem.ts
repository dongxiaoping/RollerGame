import { RoomInfo, playMode, roomState, EventType, CreateRoomPayModel } from '../../common/Const'
import { eventBus } from '../../common/EventBus';

export default class RoomItem {
    public id: number = null
    public creatUserId: string = null
    public memberLimit: number = null
    public playCount: number = null //比赛有多少场
    public playMode: playMode = null
    public costLimit: number = null
    public roomFee: number = null  //房间费用
    public roomPay: CreateRoomPayModel = null  //付费模式
    private _roomState: roomState = null
    private _oningRaceNum: number = null //当前正在进行的比赛场次号 从0开始

    constructor(val: RoomInfo) {
        this.id = val.id
        this.creatUserId = val.creatUserId
        this.memberLimit = val.memberLimit
        this.playCount = val.playCount
        this.playMode = val.playMode
        this.roomFee = val.roomFee
        this.roomPay = val.roomPay
        this.costLimit = val.costLimit
        this._roomState = val.roomState
        this._oningRaceNum = val.oningRaceNum
    }

    get oningRaceNum(): number {
        return this._oningRaceNum
    }

    /* 修改当前进行中比赛的场次号，如果本地的场次号和要修改的场次号不是大于1的关系，说明本地的游戏状态同步异常，需要矫正
     *
     */
    public changeOningRaceNum(val: number) {
        this._oningRaceNum = val
        eventBus.emit(EventType.RACING_NUM_CHANGE_EVENT, val)
    }

    get roomState(): roomState {
        return this._roomState
    }

    set roomState(val: roomState) {
        if (this._roomState != null) {
            cc.log('房间状态被改变')
            this._roomState = val
            eventBus.emit(EventType.ROOM_STATE_CHANGE_EVENT, val)
            cc.log(val)
        } else {
            this._roomState = val
        }
    }
}

