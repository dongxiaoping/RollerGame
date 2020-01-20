import { eventBus } from "../../common/EventBus";
import { EventType, BetChipChangeInfo, RaceStateChangeParam, RaceState, EnterRoomModel, MemberInChairData, MemberStateData, memberState } from "../../common/Const";
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
        this.userScoreLabel.string = this.memberData.xiaZhuVal == 0 ? '0' : ('-' + this.memberData.xiaZhuVal)
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
                this.memberData.xiaZhuVal += (betInfo.toValue - betInfo.fromVal)
                this.userScoreLabel.string = '-' + this.memberData.xiaZhuVal
            }
        })
        this.eventIdTwo = randEventId()
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, this.eventIdTwo, (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.DEAL:
                    this.memberData.xiaZhuVal = 0
                    this.userScoreLabel.string = '0'
                    break
            }
        })
        this.eventIdThree = randEventId()
        //接收到取消下注通知
        eventBus.on(EventType.BET_CANCE_NOTICE, this.eventIdThree, (info: BetChipChangeInfo): void => {
            if (info.userId == this.memberData.userId) {
                this.memberData.xiaZhuVal = 0
                this.userScoreLabel.string = '0'
            }
        })
        this.eventIdFour = randEventId()
        eventBus.on(EventType.MEMBER_STATE_CHANGE, this.eventIdFour, (info: MemberStateData): void => {
            if (info.userId == this.memberData.userId) {
                this.changeByUserState(info.state)
            }
        })
    }

    onDisable() {
        eventBus.off(EventType.BET_CHIP_CHANGE_EVENT, this.eventIdOne)
        eventBus.off(EventType.RACE_STATE_CHANGE_EVENT, this.eventIdTwo)
        eventBus.off(EventType.BET_CANCE_NOTICE, this.eventIdThree)
        eventBus.off(EventType.MEMBER_STATE_CHANGE, this.eventIdFour)
    }

    update(dt) {
    }

}
