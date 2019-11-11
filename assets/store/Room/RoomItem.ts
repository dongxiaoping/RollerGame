const { ccclass, property } = cc._decorator;
import { RoomInfo, playMode, roomState, EventType } from '../../common/Const'
import { eventBus } from '../../common/EventBus';

@ccclass
export default class RoomItem {
    id: number = null
    creatUserId: string = null
    memberLimit: number = null
    playCount: number = null
    playMode: playMode = null
    costLimit: number = null
    private _roomState: roomState = null
    private _oningRaceNum: number = null //当前正在进行的比赛场次号 从0开始

    constructor(val: RoomInfo) {
        this.id = val.id
        this.creatUserId = val.creatUserId
        this.memberLimit = val.memberLimit
        this.playCount = val.playCount
        this.playMode = val.playMode
        this.costLimit = val.costLimit
        this.roomState = val.roomState
        this.oningRaceNum = val.oningRaceNum
    }

    get oningRaceNum(): number {
        return this._oningRaceNum
    }

    set oningRaceNum(val: number) {
        if (this._oningRaceNum != null && (this._oningRaceNum >= val)) {
            cc.log('进行中场次号设置异常，当前的场次号：' + this._oningRaceNum + ',要设置的场次号:' + val)
            return
        }
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

