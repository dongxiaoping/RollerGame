const { ccclass, property } = cc._decorator;
import { RoomInfo, playMode, roomState } from '../../common/Const'

@ccclass
export default class RoomItem {
    num: number = null
    creatUserId: string = null
    memberLimit: number = null
    playCount: number = null
    playMode: playMode = null
    costLimit: number = null
    _roomState: roomState = null
    oningRaceNum: number = null //当前正在进行的比赛场次号 从0开始

    constructor(val: RoomInfo) {
        this.num = val.num
        this.creatUserId = val.creatUserId
        this.memberLimit = val.memberLimit
        this.playCount = val.playCount
        this.playMode = val.playMode
        this.costLimit = val.costLimit
        this.roomState = val.roomState
        this.oningRaceNum = val.oningRaceNum
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

