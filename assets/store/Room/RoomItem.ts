const { ccclass, property } = cc._decorator;
import { RoomInfo, playMode, roomState } from '../Room/RoomBase'

@ccclass
export default class RoomItem {
    num: number = null
    creatUserId: string = null
    memberLimit: number = null
    playCount: number = null
    playMode: playMode = null
    costLimit: number = null
    _roomState: roomState = null

    constructor(val: RoomInfo) {
        this.num = val.num
        this.creatUserId = val.creatUserId
        this.memberLimit = val.memberLimit
        this.playCount = val.playCount
        this.playMode = val.playMode
        this.costLimit = val.costLimit
        this.roomState = val.roomState
    }
    get roomState(): roomState{
        return this._roomState
    }

    set roomState(val: roomState) {
        if (this._roomState!= null) {
            cc.log('房间状态被改变')
            cc.log(val)
        }
        this._roomState = val
    }
}

