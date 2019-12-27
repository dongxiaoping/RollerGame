import { chipObData, RaceStateChangeParam, EventType, RaceState, CompareDxRe, Coordinate, LocalNoticeEventType, LocalNoticeEventPara, BetChipChangeInfo } from "../../common/Const";
import { randEventId } from "../../common/Util";
import { eventBus } from "../../common/EventBus";
import RoomManage from "../../store/Room/RoomManage";
import RaceManage from "../../store/Races/RaceManage";
import ConfigManage from "../../store/Config/ConfigManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    chipInfo: chipObData = null
    eventId: string
    betCancelEventId: string
    flyTime: number = 0.7  //下注硬币飞行时间
    start() {
        this.eventId = randEventId()
        eventBus.on(EventType.LOCAL_NOTICE_EVENT, this.eventId, (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.OPEN_CARD_FINISHED_NOTICE:
                    this.chipBackAction(false)
                    break
            }
        })
        this.betCancelEventId = randEventId()
        eventBus.on(EventType.BET_CANCE_NOTICE, this.betCancelEventId, (info: BetChipChangeInfo): void => {
            if (info.userId === this.chipInfo.userId && info.betLocation === this.chipInfo.betLocation) {
               // this.chipBackAction(true)
               this.node.active = false
               this.node.destroy()
            }
        })
    }

    initData(chipInfo: chipObData) {
        this.chipInfo = chipInfo
    }

    //isCancelBet 是否是执行取消操作动画
    chipBackAction(isCancelBet: boolean) {
        let winUserId = this.chipInfo.userId
        let raceNum = RoomManage.roomItem.oningRaceNum
        let betLocation = this.chipInfo.betLocation
        let compareDxRe = RaceManage.raceList[raceNum].getLocationResult(betLocation)
        if ((compareDxRe === CompareDxRe.SMALL || compareDxRe === CompareDxRe.EQ) && !isCancelBet) {
            winUserId = RaceManage.raceList[raceNum].landlordId
        }
        let toLocaiton = this.getUserChairPosition(winUserId)
        let action = cc.moveTo(this.flyTime, toLocaiton.x, toLocaiton.y)
        let b = cc.sequence(action, cc.callFunc(() => {
            this.node.active = false
            this.node.destroy()
        }, this))
        this.node.runAction(b)
    }

    getUserChairPosition(userId: string): Coordinate {
        let node = this.node.parent
        let deskOb = node.getChildByName('Desk').getComponent('Desk')
        return deskOb.chairManage.getChairPositionByUserId(userId)
    }

    onDisable() {
        eventBus.off(EventType.LOCAL_NOTICE_EVENT, this.eventId)
        eventBus.off(EventType.BET_CANCE_NOTICE, this.betCancelEventId)
    }
}
