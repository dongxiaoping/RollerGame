import { eventBus } from "../../common/EventBus";
import { EventType, BetChipChangeInfo, RaceStateChangeParam, RaceState, EnterRoomModel, MemberInChairData } from "../../common/Const";
import { randEventId } from '../../common/Util'
import RaceManage from "../../store/Races/RaceManage";
import RoomManage from "../../store/Room/RoomManage";
import UserManage from "../../store/User/UserManage";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    userScoreLabel: cc.Label = null;

    @property(cc.Sprite)
    userIcon: cc.Sprite = null;

    eventIdOne: string = ''
    eventIdTwo: string = ''
    eventIdThree: string = ''
    memberData: MemberInChairData = null
    start() {

    }

    setShow(memberData: MemberInChairData) {
        this.memberData = memberData
        this.userIcon.spriteFrame = null
        this.userName.string = memberData.userName
        let enterRoomParam = RoomManage.getEnterRoomParam()
        if (enterRoomParam.model === EnterRoomModel.EMULATOR_ROOM && this.memberData.userId !== UserManage.userInfo.id) {
            cc.loader.loadRes(memberData.userIcon, (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                if (myIcon !== null) {
                    this.userIcon.spriteFrame = myIcon
                }
            })
        } else {
            cc.loader.load({ url: memberData.userIcon, type: 'png' }, (err, img: any) => {
                let myIcon = new cc.SpriteFrame(img);
                if (myIcon !== null) {
                    this.userIcon.spriteFrame = myIcon
                }
            });
        }
    }


    getMemberData(): MemberInChairData {
        return this.memberData
    }

    onEnable() {
        this.eventIdOne = randEventId()
        eventBus.on(EventType.BET_CHIP_CHANGE_EVENT, this.eventIdOne, (betInfo: BetChipChangeInfo): void => {
            if (betInfo.userId == this.memberData.userId) {
                let costVal = betInfo.toValue - betInfo.fromVal
                this.memberData.xiaZhuVal += costVal
                this.userScoreLabel.string = (this.memberData.winVal - this.memberData.xiaZhuVal) + ''
            }
        })
        this.eventIdTwo = randEventId()
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, this.eventIdTwo, (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.FINISHED:
                    let winVal = RaceManage.raceList[RoomManage.roomItem.oningRaceNum].getUserRaceScore(this.userId)
                    this.memberData.winVal = this.memberData.winVal + winVal
                    this.userScoreLabel.string = this.memberData.winVal + ''
                    this.memberData.xiaZhuVal = 0
                    break
            }
        })
        this.eventIdThree = randEventId()
        //接收到取消下注通知
        eventBus.on(EventType.BET_CANCE_NOTICE, this.eventIdThree, (info: BetChipChangeInfo): void => {
            if (info.userId == this.memberData.userId) {
                this.memberData.xiaZhuVal -= info.fromVal
                this.userScoreLabel.string = (this.memberData.winVal - this.memberData.xiaZhuVal) + ''
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
