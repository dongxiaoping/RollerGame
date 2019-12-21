import { eventBus } from "../../common/EventBus";
import { EventType, RaceStateChangeParam, RaceState, BetChipChangeInfo } from "../../common/Const";
import { randEventId } from "../../common/Util";
import UserManage from "../../store/User/UserManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    userScore: cc.Label = null

    @property(cc.Label)
    totalScore: cc.Label = null
    eventIdOne: string = null
    eventIdTwo: string = null
    totalScoreVal: number = 0
    userScoreVal: number = 0
    start() {

    }
    onEnable() {
        this.eventIdOne = randEventId()
        eventBus.on(EventType.BET_CHIP_CHANGE_EVENT, this.eventIdOne, (betInfo: BetChipChangeInfo): void => {
            let costVal = betInfo.toValue - betInfo.fromVal
            this.totalScoreVal += costVal
            if (betInfo.userId == UserManage.userInfo.id) {
                this.userScoreVal += costVal
            }
            this.userScore.string = this.userScoreVal + ''
            this.totalScore.string = this.totalScoreVal + ''
        })
        //接收到取消下注通知
        this.eventIdTwo = randEventId()
        eventBus.on(EventType.BET_CANCE_NOTICE, this.eventIdTwo, (info: BetChipChangeInfo): void => {
            if (info.userId == UserManage.userInfo.id) {
                this.userScoreVal -= info.fromVal
            }
            this.totalScoreVal -= info.fromVal
            this.userScore.string = this.userScoreVal + ''
            this.totalScore.string = this.totalScoreVal + ''
        })
    }
    onDisable() {
        this.totalScoreVal = 0
        this.userScoreVal = 0
        eventBus.off(EventType.BET_CHIP_CHANGE_EVENT, this.eventIdOne)
        eventBus.off(EventType.BET_CANCE_NOTICE, this.eventIdTwo)
    }
}
