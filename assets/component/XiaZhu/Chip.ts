import { chipObData, CompareDxRe, Coordinate, BetChipChangeInfo, betLocaion } from "../../common/Const";
import RoomManage from "../../store/Room/RoomManage";
import RaceManage from "../../store/Races/RaceManage";

const { ccclass } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    chipInfo: chipObData = null
    flyTime: number = 1.2  //下注硬币飞行时间
    start() {
    }

    //开牌结束，chip飞回
    backChip() {
        this.scheduleOnce(() => {
            this.chipBackAction(false)
        }, 1);
    }

    //chip自动消失 一般用于BET_CANCE_NOTICE 事件
    cancelChip(info: BetChipChangeInfo) {
        if (info.userId === this.chipInfo.userId && info.betLocation === this.chipInfo.betLocation) {
            this.node.active = false
            this.node.destroy()
        }
    }

    initData(chipInfo: chipObData) {
        this.chipInfo = chipInfo
    }

    //isCancelBet 是否是执行取消操作动画
    chipBackAction(isCancelBet: boolean) {
        try {
            let winUserId = this.chipInfo.userId
            let raceNum = RoomManage.roomItem.oningRaceNum
            let theBetLocation = this.chipInfo.betLocation
            let compareDxRe = RaceManage.raceList[raceNum].getLocationResult(theBetLocation)
            if ((compareDxRe === CompareDxRe.SMALL || compareDxRe === CompareDxRe.EQ) && !isCancelBet) {
                winUserId = RaceManage.raceList[raceNum].landlordId
            }
            if ((theBetLocation === betLocaion.SKY_CORNER || theBetLocation === betLocaion.BRIDG
                || theBetLocation === betLocaion.LAND_CORNER) && compareDxRe === CompareDxRe.EQ) {
                this.node.active = false
                this.node.destroy()
                return
            }
            let toLocaiton = this.getUserChairPosition(winUserId)
            let action = cc.moveTo(this.flyTime, toLocaiton.x, toLocaiton.y)
            let b = cc.sequence(action, cc.callFunc(() => {
                this.node.active = false
                this.node.destroy()
            }, this))
            this.node.runAction(b)
        } catch (e) {
            cc.log('硬币返回异常')
            this.node.active = false
            this.node.destroy()
        }
    }

    getUserChairPosition(userId: string): Coordinate {
        let node = this.node.parent
        let deskOb = node.getChildByName('Desk').getComponent('Desk')
        return deskOb.chairManage.getChairPositionByUserId(userId)
    }

    onDisable() {

    }
}
