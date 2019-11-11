const { ccclass, property } = cc._decorator;
import { randEventId } from '../../common/Util'
import { eventBus } from '../../common/EventBus'
import { BetChipChangeInfo, EventType, RaceStateChangeParam, RaceState } from '../../common/Const'
import UserManage from '../../store/User/UserManage';
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    userScore: cc.Label = null;

    @property(cc.Label)
    memberScore: cc.Label = null;

    start() {

    }
    onEnable() {
        let pushEventId = randEventId()
        eventBus.on(EventType.BET_CHIP_CHANGE_EVENT, pushEventId, (betInfo: BetChipChangeInfo): void => {
            let userId = UserManage.userInfo.id
            let betValue = betInfo.toValue - betInfo.fromVal
            if (userId === betInfo.userId) {
                this.userScore.string = (parseInt(this.userScore.string) + betValue).toString()
            }
            this.memberScore.string = (parseInt(this.memberScore.string) + betValue).toString()
        })

        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, randEventId(), (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.ROLL_DICE:
                    this.userScore.string = 0 + ''
                    this.memberScore.string = 0 + ''
                    break
            }
        }
    }

    // update (dt) {}
}
