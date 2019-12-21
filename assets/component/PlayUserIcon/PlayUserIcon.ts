import { eventBus } from "../../common/EventBus";
import { EventType, BetChipChangeInfo, RaceStateChangeParam, RaceState, EnterRoomModel } from "../../common/Const";
import { randEventId } from '../../common/Util'
import RaceManage from "../../store/Races/RaceManage";
import RoomManage from "../../store/Room/RoomManage";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    userScoreLabel: cc.Label = null;

    @property(cc.Sprite)
    userIcon: cc.Sprite = null;

    userId: string = null
    eventIdOne: string = ''
    eventIdTwo: string = ''
    eventIdThree: string = ''
    winVal: number = 0
    xiaZhuVal: number = 0
    start() {

    }

    setShow(iconUrl: string, userName: string, userId: string) {
        this.userId = userId
        this.userName.string = userName
        let enterRoomParam = RoomManage.getEnterRoomParam()
        if (enterRoomParam.model === EnterRoomModel.EMULATOR_ROOM) {
            cc.loader.loadRes(iconUrl, (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                this.userIcon.spriteFrame = myIcon
            })
        } else {
            cc.loader.load({ url: iconUrl, type: 'png' }, (err, img: any) => {
                let myIcon = new cc.SpriteFrame(img);
                this.userIcon.spriteFrame = myIcon
            });
        }
    }

    onEnable() {
        this.eventIdOne = randEventId()
        eventBus.on(EventType.BET_CHIP_CHANGE_EVENT, this.eventIdOne, (betInfo: BetChipChangeInfo): void => {
            if (betInfo.userId == this.userId) {
                let costVal = betInfo.toValue - betInfo.fromVal
                this.xiaZhuVal += costVal
                this.userScoreLabel.string = (this.winVal - this.xiaZhuVal) + ''
            }
        })
        this.eventIdTwo = randEventId()
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, this.eventIdTwo, (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.FINISHED:
                    let winVal = RaceManage.raceList[RoomManage.roomItem.oningRaceNum].getUserRaceScore(this.userId)
                    this.winVal = this.winVal + winVal
                    this.userScoreLabel.string = this.winVal + ''
                    this.xiaZhuVal = 0
                    break
            }
        })
        this.eventIdThree = randEventId()
        //接收到取消下注通知
        eventBus.on(EventType.BET_CANCE_NOTICE, this.eventIdThree, (info: BetChipChangeInfo): void => {
            if (info.userId == this.userId) {
                this.xiaZhuVal -= info.fromVal
                this.userScoreLabel.string = (this.winVal - this.xiaZhuVal) + ''
            }
        })
    }

    onDisable() {
        eventBus.off(EventType.BET_CHIP_CHANGE_EVENT, this.eventIdOne)
        eventBus.off(EventType.RACE_STATE_CHANGE_EVENT, this.eventIdTwo)
        eventBus.off(EventType.BET_CANCE_NOTICE, this.eventIdThree)
    }

    update(dt) {
    }

}
