import { eventBus } from "../../common/EventBus";
import { EventType, BetChipChangeInfo, RaceStateChangeParam, RaceState, EnterRoomModel, MemberInChairData, MemberStateData, memberState, CartonMessage, ChatMessageType, NoticeType, NoticeData, roomState } from "../../common/Const";
import { randEventId } from '../../common/Util'
import RoomManage from "../../store/Room/RoomManage";
import UserManage from "../../store/User/UserManage";
import RaceManage from "../../store/Races/RaceManage";
import { roomGameConfig } from "../../common/RoomGameConfig";
import { faceList } from "../../common/FaceList";
import webSocketManage from '../../common/WebSocketManage'
import { wenZiList } from "../../common/WenZiList";
import ConfigManage from "../../store/Config/ConfigManage";
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
    kickButton: cc.Sprite = null;

    @property(cc.Sprite)
    offLineIcon: cc.Sprite = null;
    @property(cc.Sprite)
    fangZhuIcon: cc.Sprite = null;

    eventIdOne: string = ''
    eventIdTwo: string = ''
    eventIdThree: string = ''
    eventIdFour: string = ''
    eventIdFive: string = ''
    eventIdSix: string = ''
    memberData: MemberInChairData = null
    @property(cc.Prefab)
    messageIconPref: cc.Prefab = null;
    @property(cc.Prefab)
    messageZiPref: cc.Prefab = null;
    start() {
        this.kickButton.enabled = false
        this.kickButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            try {
                if(RoomManage.roomItem.roomState == roomState.OPEN ){
                    let notice = {
                        type: NoticeType.kickOutMemberFromRoom, info: {
                            roomId: RoomManage.roomItem.id,
                            kickUserId: this.memberData.userId,
                        }
                    } as NoticeData
                    webSocketManage.send(JSON.stringify(notice));
                }else{
    
                }
            } catch (error) {
                
            }
        })
        this.userIcon.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (RoomManage.roomItem.creatUserId == UserManage.userInfo.id && this.memberData.userId != UserManage.userInfo.id) {
                this.kickButton.enabled = this.kickButton.enabled ? false : true
            }
        })
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
        if (this.memberData.userId == RoomManage.roomItem.creatUserId) {
            this.fangZhuIcon.node.active = true
        }
        this.userIcon.spriteFrame = null
        this.userName.string = memberData.userName
        this.changeByUserState(memberData.state)
        this.updateScoreShow(memberData.xiaZhuVal)
        let enterRoomParam = RoomManage.getEnterRoomParam()
        if (enterRoomParam.model === EnterRoomModel.EMULATOR_ROOM && this.memberData.userId != UserManage.userInfo.id) {
            cc.loader.loadRes(memberData.userIcon, (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                if (myIcon !== null && this.userIcon != null) {
                    this.userIcon.spriteFrame = myIcon
                }
            })
        } else {
            let iconUrl = ConfigManage.getUserIconUrl() + memberData.userIcon
            cc.loader.load({ url: iconUrl, type: 'png' }, (err, img: any) => {
                let myIcon = new cc.SpriteFrame(img);
                if (myIcon !== null && this.userIcon != null) {
                    this.userIcon.spriteFrame = myIcon
                }
            });
        }
    }

    updateScoreShow(score: number) {
        this.memberData.xiaZhuVal = score
        this.userScoreLabel.string = score + ''
    }


    getMemberData(): MemberInChairData {
        return this.memberData
    }
    onLoad(){

    }

    onEnable() {
        this.eventIdOne = randEventId()
        eventBus.on(EventType.BET_CHIP_CHANGE_EVENT, this.eventIdOne, (betInfo: BetChipChangeInfo): void => {
            if (betInfo.userId == this.memberData.userId) {
                let xiaZhuVal = betInfo.toValue - betInfo.fromVal
                let nowVal = this.memberData.xiaZhuVal - xiaZhuVal
                this.updateScoreShow(nowVal)
                if (betInfo.userId == UserManage.userInfo.id) {
                    cc.find('Canvas').getComponent('RollRoomScene').userScoreLabel.string = this.userScoreLabel.string
                }
            }
        })
        this.eventIdTwo = randEventId()
        eventBus.on(EventType.USER_SCORE_NOTICE, this.eventIdTwo, (list: any[]): void => {
            if (typeof (list[this.memberData.userId]) != 'undefined') {
                this.updateScoreShow(list[this.memberData.userId])
            } else {
                this.updateScoreShow(0)
            }
        })
        this.eventIdThree = randEventId()
        //接收到取消下注通知
        eventBus.on(EventType.BET_CANCE_NOTICE, this.eventIdThree, (info: BetChipChangeInfo): void => {
            if (info.userId == this.memberData.userId) {
                let fromVal = info.fromVal
                let nowVal = this.memberData.xiaZhuVal + fromVal
                this.updateScoreShow(nowVal)
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
        this.eventIdFive = randEventId()
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, this.eventIdFive, (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.SHOW_DOWN:
                    if (RoomManage.getEnterRoomParam().model === EnterRoomModel.EMULATOR_ROOM) {
                        let theScore = RaceManage.getUserScore(this.memberData.userId)
                        this.scheduleOnce(() => {
                            this.updateScoreShow(theScore)
                            if (this.memberData.userId == UserManage.userInfo.id) {
                                cc.find('Canvas').getComponent('RollRoomScene').userScoreLabel.string = this.userScoreLabel.string
                            }
                        }, roomGameConfig.showDownTime + 1);
                    }
                    break
            }
        })
        this.eventIdSix = randEventId()
        eventBus.on(EventType.CARTON_MESSAGE_NOTICE, this.eventIdSix, (info: CartonMessage): void => {
            if (info.userId == this.memberData.userId) {
                //cc.log('显示动画')
                if (info.type == ChatMessageType.PIC) {
                    let facecItem = faceList[info.message]
                    this.faceShow(facecItem)
                } else if (info.type == ChatMessageType.QIANG_ZHUANG) {
                    let facecItem = { name: 'jzhuang', size: { x: 80, y: 41 } }
                    this.faceShow(facecItem)
                } else {
                    this.ziShow(info)
                }
            }
        })
    }

    faceShow(facecItem: any) {
        cc.loader.loadRes('ChatCarton/' + facecItem.name, (error, img) => {
            let node = cc.instantiate(this.messageIconPref)
            node.parent = this.node.parent.parent
            let x = this.node.parent.position.x + 50
            let y = this.node.parent.position.y + 30
            node.setPosition(x, y);
            node.width = facecItem.size.x
            node.height = facecItem.size.y
            let myIcon = new cc.SpriteFrame(img);
            node.getChildByName('Pic').getComponents(cc.Sprite)[0].spriteFrame = myIcon
            setTimeout(() => {
                node.destroy()
            }, 2000)
        })
    }

    ziShow(info: CartonMessage) {
        let node = cc.instantiate(this.messageZiPref)
        node.parent = this.node.parent.parent
        let x = this.node.parent.position.x
        let y = this.node.parent.position.y - 50
        node.setPosition(x, y);
        node.getComponent(cc.Label).string = wenZiList[info.message]['content']
        setTimeout(() => {
            node.destroy()
        }, 2000)
    }

    onDisable() {
        eventBus.off(EventType.BET_CHIP_CHANGE_EVENT, this.eventIdOne)
        eventBus.off(EventType.USER_SCORE_NOTICE, this.eventIdTwo)
        eventBus.off(EventType.BET_CANCE_NOTICE, this.eventIdThree)
        eventBus.off(EventType.MEMBER_STATE_CHANGE, this.eventIdFour)
        eventBus.off(EventType.RACE_STATE_CHANGE_EVENT, this.eventIdFive)
        eventBus.off(EventType.CARTON_MESSAGE_NOTICE, this.eventIdSix)
    }

    update(dt) {
    }

}
