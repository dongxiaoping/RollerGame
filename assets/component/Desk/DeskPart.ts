const { ccclass, property } = cc._decorator;
import { RaceState, EventType, BetChipChangeInfo, RaceStateChangeParam, betLocaion, LocalNoticeEventType, LocalNoticeEventPara, CompareDxRe, BetNoticeData } from '../../common/Const'
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage'
import UserManage from '../../store/User/UserManage'
import { eventBus } from '../../common/EventBus';
import { randEventId } from '../../common/Util';
import BetManage from '../../store/Bets/BetManage';
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    focus: cc.Sprite = null

    @property
    typeValue: string = '' //按钮类型

    @property(cc.Sprite)
    bg: cc.Sprite = null //下注分数显示区背景

    @property(cc.Label)
    betScore: cc.Label = null //本次比赛当前位置下注分数 如：4/8  4表示当前用户下注的  8表示全部用户的

    ownScore: number = 0 // 当前用户当前位置的下注值
    allScore: number = 0 // 所有用户当前位置的下注值
    touchLock: boolean = false //防止点击速率过快
    start() {
        cc.log('按钮类型：' + this.typeValue)
        this.toClearn()
    }

    onEnable() {
        this.addClickEvent()
    }

    toBet(betInfo: BetChipChangeInfo) {
        let userId = betInfo.userId
        let betLocationType = betInfo.betLocation
        let betValue = betInfo.toValue - betInfo.fromVal
        if (this.typeValue === betLocationType) {
            this.allScore = this.allScore + betValue
            cc.log(this.typeValue + '位置接收到下注通知')
            if (UserManage.userInfo.id === userId) {
                this.ownScore = this.ownScore + betValue
            }
            this.betScore.string = this.ownScore + ' / ' + this.allScore
        }
    }

    toClearn() {
        this.bg.node.active = false
        this.focus.node.active = false
        this.betScore.string = ''
        this.ownScore = 0
        this.allScore = 0
    }

    toOpen() {
        this.bg.node.active = true
        this.focus.node.active = false
        this.ownScore = 0
        this.allScore = 0
        this.betScore.string =  '0 / 0'
    }

    winFocusAmination(){
        let localString = this.typeValue + 'Result'
        let oningNum = RoomManage.roomItem.oningRaceNum
        if (RaceManage.raceList[oningNum][localString] === CompareDxRe.BIG) {
            this.focus.node.active = true
            this.scheduleOnce(() => {
                this.focus.node.active = false
            }, 0.6);
            this.scheduleOnce(() => {
                this.focus.node.active = true
            }, 0.9);
            this.scheduleOnce(() => {
                this.focus.node.active = false
            }, 1.2);
        }
    }

    addClickEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            if (this.touchLock) {
                return
            }
            let oningRaceNum = RoomManage.roomItem.oningRaceNum
            if (RaceManage.raceList[oningRaceNum].state !== RaceState.BET) {
                return
            }
            if (RaceManage.raceList[oningRaceNum].landlordId === UserManage.userInfo.id) {
                return
            }
            this.focus.node.active = true
        })
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.focus.node.active = false
            if (this.touchLock) {
                return
            }
            this.scheduleOnce(() => { //定时器
                this.touchLock = false
            }, 0.15);
            let oningRaceNum = RoomManage.roomItem.oningRaceNum
            this.focus.node.active = false

            if (RaceManage.raceList[oningRaceNum].state !== RaceState.BET) {
                cc.log('当前不是下注环节，不能下注')
                return
            }
            if (RaceManage.raceList[oningRaceNum].landlordId === UserManage.userInfo.id) {
                cc.log('地主不能下注')
                return
            }
            let limitCount = RoomManage.roomItem.costLimit
            let xiaZhuVal = 0
            if (typeof BetManage.betList[oningRaceNum] !== "undefined" &&
                typeof BetManage.betList[oningRaceNum][UserManage.userInfo.id] !== "undefined") {
                xiaZhuVal = BetManage.betList[oningRaceNum][UserManage.userInfo.id].getXiaZhuVal()

            }
            if (xiaZhuVal + UserManage.selectChipValue > limitCount) {
                cc.log('下注超限')
                this.node.parent.getComponent('Desk').showBetLimitTip()
                return
            }
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                type: LocalNoticeEventType.LOCAL_BET_CLICK_NOTICE,
                info: {
                    roomId: RoomManage.roomItem.id, raceNum: RoomManage.roomItem.oningRaceNum,
                    betLocation: this.typeValue, userId: UserManage.userInfo.id, betVal: UserManage.selectChipValue
                } as BetNoticeData
            })
        })
    }

    // update (dt) {}
}
