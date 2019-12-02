const { ccclass, property } = cc._decorator;
import { RaceState, EventType, BetChipChangeInfo, RaceStateChangeParam, betLocaion, LocalNoticeEventType, LocalNoticeEventPara, CompareDxRe } from '../../common/Const'
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage'
import UserManage from '../../store/User/UserManage'
import { eventBus } from '../../common/EventBus';
import { randEventId } from '../../common/Util';
import BetManage from '../../store/Bets/BetManage';
import { ws, NoticeType, NoticeData } from '../../common/WebSocketServer';
import RollEmulator from '../../common/RollEmulator';
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

    start() {
        cc.log('按钮类型：' + this.typeValue)

    }

    onEnable() {
        this.focus.node.active = false
        this.bg.node.active = false  //初始化时隐藏分数面板
        this.addClickEvent()
        this.addListener()
    }

    addListener() {
        eventBus.on(EventType.BET_CHIP_CHANGE_EVENT, randEventId(), (betInfo: BetChipChangeInfo): void => {
            let betLocationType = betInfo.betLocation
            let userId = betInfo.userId
            let betValue = betInfo.toValue - betInfo.fromVal
            if (this.typeValue === betLocationType) {
                this.allScore = this.allScore + betValue
                cc.log(this.typeValue + '位置接收到下注通知')
                if (UserManage.userInfo.id === userId) {
                    this.ownScore = this.ownScore + betValue
                }
                if (!this.bg.node.active) {
                    this.bg.node.active = true
                }
                this.betScore.string = this.ownScore + ' / ' + this.allScore
            }
        })



        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, randEventId(), (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.BET:  //下注
                    //this.bg.node.active = true
                    //cc.log('收到下注通知，显示分数看板：' + this.typeValue)
                    break
                case RaceState.FINISHED:
                    this.bg.node.active = false
                    this.betScore.string = ''
                    this.ownScore = 0
                    this.allScore = 0
                    break
            }
        })
    }

    addClickEvent() {
        eventBus.on(EventType.LOCAL_NOTICE_EVENT, randEventId(), (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.OPEN_CARD_FINISHED_NOTICE:
                    cc.log('开牌动画结束，我开始执行比大小动画')
                    let localString = this.typeValue + 'Result'
                    let oningNum = RoomManage.roomItem.oningRaceNum
                    if (RaceManage.raceList[oningNum][localString] === CompareDxRe.BIG) {
                        this.focus.node.active = true
                        setTimeout(() => {
                            this.focus.node.active = false
                        }, 600)
                        setTimeout(() => {
                            this.focus.node.active = true
                        }, 900)
                        setTimeout(() => {
                            this.focus.node.active = false
                        }, 1200)
                    }

                    break
            }
        })

        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            let oningRaceNum = RoomManage.roomItem.oningRaceNum
            if (RaceManage.raceList[oningRaceNum].state !== RaceState.BET) {
                return
            }
            if (RaceManage.raceList[oningRaceNum].landlordId === UserManage.userInfo.id) {
                return
            }
        })
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
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
            //向服务器发起下注通知
            if (RollEmulator.isRuning) {
                BetManage.addBet(oningRaceNum, UserManage.userInfo.id, this.typeValue as betLocaion, UserManage.selectChipValue)
            } else {
                let notice = {
                    type: NoticeType.raceBet, info: {
                        roomId: RoomManage.roomItem.id,
                        raceNum: RoomManage.roomItem.oningRaceNum,
                        betLocation: this.typeValue,
                        userId: UserManage.userInfo.id,
                        betVal: UserManage.selectChipValue
                    }
                } as NoticeData
                ws.send(JSON.stringify(notice));
            }
        })
    }

    // update (dt) {}
}
