const { ccclass, property } = cc._decorator;
import { RaceState, EventType, BetChipChangeInfo, RaceStateChangeParam, betLocaion, LocalNoticeEventType, LocalNoticeEventPara, CompareDxRe, BetNoticeData } from '../../common/Const'
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage'
import UserManage from '../../store/User/UserManage'
import { eventBus } from '../../common/EventBus';
import BetManage from '../../store/Bets/BetManage';
import { ws, NoticeType, NoticeData } from '../../common/WebSocketServer';
import ConfigManage from '../../store/Config/ConfigManage';
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    focus: cc.Sprite = null

    @property
    typeValue: string = '' //按钮类型

    @property(cc.Sprite)
    bg: cc.Sprite = null //下注分数显示区背景

    @property(cc.AudioSource)
    overBetLimitVoice: cc.AudioSource = null //下注超限语音

    @property(cc.Label)
    betScore: cc.Label = null //本次比赛当前位置下注分数 如：4/8  4表示当前用户下注的  8表示全部用户的

    ownScore: number = 0 // 当前用户当前位置的下注值
    allScore: number = 0 // 所有用户当前位置的下注值
    touchLock: boolean = false //防止点击速率过快
    overBetLimitLock: boolean = false //超限锁，防止超限反复点击
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
        this.betScore.string = '0 / 0'
    }

    winFocusAmination() {
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
    getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
        var radLat1 = lat1 * Math.PI / 180.0;
        var radLat2 = lat2 * Math.PI / 180.0;
        var a = radLat1 - radLat2;
        var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000;
        return s;
    }

    addClickEvent() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: any) => {

        })

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
        this.node.on(cc.Node.EventType.TOUCH_END, (event: any) => {
            let isTouchMove = this.touchMoveEvent(event)
            if (isTouchMove) {
                return
            }
            this.focus.node.active = false
            if (this.touchLock || this.overBetLimitLock) {
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
                this.overBetLimitLock = true
                this.scheduleOnce(() => {
                    this.overBetLimitLock = false
                }, 2);
                if (ConfigManage.isTxMusicOpen()) {
                    this.overBetLimitVoice.play()
                }
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

    touchMoveEvent(event: any) {
        let dx = Math.abs(event.currentTouch._point.x - event.currentTouch._startPoint.x)
        let dy = Math.abs(event.currentTouch._point.y - event.currentTouch._startPoint.y)
        var dis = parseFloat(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)).toFixed(2));
        cc.log(dis)
        if (dis < 70) {
            return false
        }
        cc.log('执行删除动作')
        let notice = {
            type: NoticeType.cancelRaceBet, info: {
                userId: UserManage.userInfo.id,
                roomId: RoomManage.roomItem.id,
                raceNum: RoomManage.roomItem.oningRaceNum,
                betLocation: this.typeValue
            } as BetNoticeData
        } as NoticeData
        ws.send(JSON.stringify(notice));
        return true
    }
    // update (dt) {}
}
