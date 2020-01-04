import { eventBus } from "../../common/EventBus";
import { EventType, BetChipChangeInfo } from "../../common/Const";
import { randEventId } from "../../common/Util";
import UserManage from "../../store/User/UserManage";
import RoomManage from "../../store/Room/RoomManage";
import RaceManage from "../../store/Races/RaceManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    userScore: cc.Label = null

    @property(cc.Label)
    totalScore: cc.Label = null

    @property(cc.Label)
    landlordTotalScore: cc.Label = null

    eventIdOne: string = null
    eventIdTwo: string = null
    totalScoreVal: number = 0
    userScoreVal: number = 0

    @property(cc.Sprite)
    bg: cc.Sprite = null

    @property(cc.SpriteFrame)
    bg_icon_1: cc.SpriteFrame = null

    @property(cc.SpriteFrame)
    bg_icon_2: cc.SpriteFrame = null
    start() {

    }

    onLoad() {
        if (this.isLandlord()) {
            this.bg.spriteFrame = this.bg_icon_2
            this.landlordTotalScore.node.active = true
            this.userScore.node.active = false
            this.totalScore.node.active = false
        } else {
            this.bg.spriteFrame = this.bg_icon_1
            this.landlordTotalScore.node.active = false
            this.userScore.node.active = true
            this.totalScore.node.active = true
        }
    }

    isLandlord(): boolean {
        let onNum = RoomManage.roomItem.oningRaceNum
        if (UserManage.userInfo.id === RaceManage.raceList[onNum].landlordId) {
            return true
        }
        return false
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
            this.landlordTotalScore.string = this.totalScoreVal + ''
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
            this.landlordTotalScore.string = this.totalScoreVal + ''
        })
    }
    onDisable() {
        this.totalScoreVal = 0
        this.userScoreVal = 0
        eventBus.off(EventType.BET_CHIP_CHANGE_EVENT, this.eventIdOne)
        eventBus.off(EventType.BET_CANCE_NOTICE, this.eventIdTwo)
    }
}
