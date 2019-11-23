import RoomManage from "../../store/Room/RoomManage";
import RoomItem from "../../store/Room/RoomItem";
import { eventBus } from "../../common/EventBus";
import { EventType } from "../../common/Const";
import { randEventId } from "../../common/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    betLimit: cc.Label = null; //下注限制数

    @property(cc.Label)
    playCountLimit: cc.Label = null; //牌局数信息

    playCount: number = 0

    start() {
        this.initShow()
        eventBus.on(EventType.RACING_NUM_CHANGE_EVENT, randEventId(), (num: number): void => {
            this.playCountLimit.string = '当前牌局：' + (num+1) + '/' + this.playCount
        })
    }

    async initShow() {
        try{
            let info = await RoomManage.requestRoomInfo()
            let roomInfo = info.extObject as RoomItem
            this.betLimit.string = '下注上限：' + roomInfo.costLimit
            this.playCountLimit.string = '当前牌局：1/' + roomInfo.playCount
            this.playCount = roomInfo.playCount
        }catch(e){

        }

    }

}
