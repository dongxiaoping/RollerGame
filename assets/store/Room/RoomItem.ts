const { ccclass, property } = cc._decorator;
import {RoomInfo, playMode, roomState} from '../Room/RoomBase'

@ccclass
export default class RoomItem {
    num: number = null
    creatUserId: string = null
    memberLimit: number = null
    playCount: number = null
    playMode: playMode = null
    costLimit: number = null
    roomState: roomState = null
    
    constructor(val: RoomInfo) {
        this.num = val.num
        this.creatUserId = val.creatUserId
        this.memberLimit = val.memberLimit
        this.playCount = val.playCount
        this.playMode = val.playMode
        this.costLimit = val.costLimit
        this.roomState = val.roomState
    }
}

