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
    eventId: string = null
    eventIdOne: string = null
    totalScoreVal: number = 0
    userScoreVal: number = 0
    start() {

    }
    onEnable() {
        this.eventId = randEventId()
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, this.eventId, (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.SHOW_RESULT:
                    this.node.active = false
                    this.destroy()
                    break
            }
        })
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
    }
    onDisable() {
        this.totalScoreVal = 0
        this.userScoreVal = 0
        eventBus.off(EventType.BET_CHIP_CHANGE_EVENT, this.eventId)
    }
}
