import { eventBus } from "../../common/EventBus";
import { EventType, BetChipChangeInfo, RaceStateChangeParam, RaceState, EnterRoomModel, MemberInChairData, MemberStateData, memberState, LocalNoticeEventType, LocalNoticeEventPara, raceResultData } from "../../common/Const";
import { randEventId } from '../../common/Util'
import RoomManage from "../../store/Room/RoomManage";
import UserManage from "../../store/User/UserManage";
import RaceManage from "../../store/Races/RaceManage";
import { roomGameConfig } from "../../common/RoomGameConfig";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    userScoreLabel: cc.Label = null;

    @property(cc.Sprite)
    userIcon: cc.Sprite = null;

    @property(cc.Sprite)
    offLineIcon: cc.Sprite = null;

    eventIdOne: string = ''
    eventIdTwo: string = ''
    eventIdThree: string = ''
    eventIdFour: string = ''
    memberData: MemberInChairData = null
    start() {

    }

    changeByUserState(myState: memberState) {
        switch (myState) {
            case memberState.OffLine:
                this.offLineIcon.node.active = true
                break
            case memberState.OnLine:
                this.offLineIcon.node.active = false
                break
        }
    }

    setShow(memberData: MemberInChairData) {
        this.memberData = memberData
        this.userIcon.spriteFrame = null
        this.userName.string = memberData.userName
        this.changeByUserState(memberData.state)
        this.userScoreLabel.string = RaceManage.getUserScore(memberData.userId) + ''
        let enterRoomParam = RoomManage.getEnterRoomParam()
        if (enterRoomParam.model === EnterRoomModel.EMULATOR_ROOM && this.memberData.userId !== UserManage.userInfo.id) {
            cc.loader.loadRes(memberData.userIcon, (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                if (myIcon !== null && this.userIcon != null) {
                    this.userIcon.spriteFrame = myIcon
                }
            })
        } else {
            cc.loader.load({ url: memberData.userIcon, type: 'png' }, (err, img: any) => {
                let myIcon = new cc.SpriteFrame(img);
                if (myIcon !== null && this.userIcon != null) {
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
                let xiaZhuVal = betInfo.toValue - betInfo.fromVal
                let nowVal = parseInt(this.userScoreLabel.string) - xiaZhuVal
                this.userScoreLabel.string = nowVal + ''
                if (betInfo.userId == UserManage.userInfo.id) {
                    cc.find('Canvas').getComponent('RollRoomScene').userScoreLabel.string = this.userScoreLabel.string
                }
            }
        })
        this.eventIdThree = randEventId()
        //接收到取消下注通知
        eventBus.on(EventType.BET_CANCE_NOTICE, this.eventIdThree, (info: BetChipChangeInfo): void => {
            if (info.userId == this.memberData.userId) {
                let fromVal = info.fromVal
                let nowVal = parseInt(this.userScoreLabel.string) + fromVal
                this.userScoreLabel.string = nowVal + ''
                if (info.userId == UserManage.userInfo.id) {
                    cc.find('Canvas').getComponent('RollRoomScene').userScoreLabel.string = this.userScoreLabel.string
                }
            }
        })
        this.eventIdFour = randEventId()
        eventBus.on(EventType.MEMBER_STATE_CHANGE, this.eventIdFour, (info: MemberStateData): void => {
            if (info.userId == this.memberData.userId) {
                this.changeByUserState(info.state)
            }
        })
        this.eventIdTwo = randEventId()
        eventBus.on(EventType.USER_SCORE_NOTICE, this.eventIdTwo, (list: raceResultData[]): void => {
            let i = 0
            for (; i < list.length; i++) {
                if (list[i].userId == this.memberData.userId) {
                    this.userScoreLabel.string = list[i].score + ''
                    break
                }
            }
        })

        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, randEventId(), (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.SHOW_DOWN:
                    if (RoomManage.getEnterRoomParam().model === EnterRoomModel.EMULATOR_ROOM) {
                        let theScore = RaceManage.getUserScore(this.memberData.userId) + ''
                        this.scheduleOnce(() => {
                            this.userScoreLabel.string = theScore
                            if (this.memberData.userId == UserManage.userInfo.id) {
                                cc.find('Canvas').getComponent('RollRoomScene').userScoreLabel.string = this.userScoreLabel.string
                            }
                        }, roomGameConfig.showDownTime + 1);
                    }
                    break
            }
        })
    }

    onDisable() {
        eventBus.off(EventType.BET_CHIP_CHANGE_EVENT, this.eventIdOne)
        eventBus.off(EventType.USER_SCORE_NOTICE, this.eventIdTwo)
        eventBus.off(EventType.BET_CANCE_NOTICE, this.eventIdThree)
        eventBus.off(EventType.MEMBER_STATE_CHANGE, this.eventIdFour)
    }

    update(dt) {
    }

}
