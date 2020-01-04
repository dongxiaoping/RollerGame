const { ccclass, property } = cc._decorator;
import { NoticeType, NoticeData, RaceState, EventType, BetChipChangeInfo, betLocaion, LocalNoticeEventType, CompareDxRe, BetNoticeData, EnterRoomModel } from '../../common/Const'
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage'
import UserManage from '../../store/User/UserManage'
import { eventBus } from '../../common/EventBus'
import BetManage from '../../store/Bets/BetManage'
import webSocketManage from '../../common/WebSocketManage'
import ConfigManage from '../../store/Config/ConfigManage'
import { randEventId, touchMoveEvent } from '../../common/Util'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    focus: cc.Sprite = null


    @property(cc.Prefab)
    cancelChipAn: cc.Prefab = null //取消chip动画

    @property
    typeValue: string = '' //按钮类型

    @property(cc.Sprite)
    bg: cc.Sprite = null //下注分数显示区背景

    @property(cc.Node)
    scorePanel: cc.Node = null //分数显示区

    @property(cc.AudioSource)
    overBetLimitVoice: cc.AudioSource = null //下注超限语音

    @property(cc.AudioSource)
    chipCancelVoice: cc.AudioSource = null //下注取消的声音

    @property(cc.Label)
    betScore: cc.Label = null //本次比赛当前位置下注分数 如：4/8  4表示当前用户下注的  8表示全部用户的

    ownScore: number = 0 // 当前用户当前位置的下注值
    allScore: number = 0 // 所有用户当前位置的下注值
    touchLock: boolean = false //防止点击速率过快
    overBetLimitLock: boolean = false //超限锁，防止超限反复点击
    cancelBetLock: boolean = false //取消下注锁
    scheduleOb: any = null
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
            if (this.isLandlord()) {
                this.betScore.string = this.allScore + ''
            } else {
                this.betScore.string = this.ownScore + ' / ' + this.allScore
            }
        }
    }

    toClearn() {
        this.bg.node.active = false
        this.focus.node.active = false
        this.betScore.string = ''
        this.ownScore = 0
        this.allScore = 0
        this.unschedule(this.scheduleOb);
    }

    toOpen() {
        this.scorePanel.active = true
        this.bg.node.active = true
        this.focus.node.active = false
        this.ownScore = 0
        this.allScore = 0
        if (this.isLandlord()) {
            this.betScore.string = '0'
        } else {
            this.betScore.string = '0 / 0'
        }
    }

    isLandlord(): boolean {
        let onNum = RoomManage.roomItem.oningRaceNum
        if (UserManage.userInfo.id === RaceManage.raceList[onNum].landlordId) {
            return true
        }
        return false
    }

    winFocusAmination() {
        let localString = this.typeValue + 'Result'
        let oningNum = RoomManage.roomItem.oningRaceNum
        if (RaceManage.raceList[oningNum][localString] === CompareDxRe.BIG) {
            this.focus.node.active = true
            let setV = 150
            this.focus.node.opacity = setV
            this.scheduleOb = this.schedule(() => {
                setV = setV === 150 ? 255 : 150
                this.focus.node.opacity = setV
            }, 0.8);
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

    showCancelChipAn() {
        var node = cc.instantiate(this.cancelChipAn)
        node.parent = this.node
        node.setPosition(0, 0);
        node.active = true
    }

    betCancel(info: BetChipChangeInfo): void {
        if (this.typeValue != info.betLocation) {
            return
        }
        if (info.userId == UserManage.userInfo.id) {
            this.ownScore -= info.fromVal
        }
        this.allScore -= info.fromVal
        if (this.isLandlord()) {
            this.betScore.string = this.allScore + ''
        } else {
            this.betScore.string = this.ownScore + ' / ' + this.allScore
        }
    }

    addClickEvent() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: any) => {

            let isTouchMove = touchMoveEvent(event)
            if (isTouchMove) {
                if (this.cancelBetLock || this.ownScore == 0) {
                    return
                }
                let raceNum = RoomManage.roomItem.oningRaceNum
                if (RaceManage.raceList[raceNum].state !== RaceState.BET) {
                    return
                }
                if (this.isOverBetTime()) {
                    return
                }
                cc.log('删除打印：执行删除动作')
                this.cancelBetLock = true
                this.showCancelChipAn()
                if (ConfigManage.isTxMusicOpen()) {
                    this.chipCancelVoice.play()
                }
                let roomId = RoomManage.roomItem.id
                let userId = UserManage.userInfo.id
                let betLocation = this.typeValue as betLocaion
                let enterRoomParam = RoomManage.getEnterRoomParam()
                if (enterRoomParam.model === EnterRoomModel.EMULATOR_ROOM) { //模拟房间删除
                    BetManage.cancelBet({ userId: userId, raceNum: raceNum, betLocation: betLocation } as BetNoticeData)
                    this.scheduleOnce(() => {
                        this.cancelBetLock = false
                    }, 0.5);
                    return
                }
                this.execCancel(roomId, userId, raceNum, betLocation)
                return
            }
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

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: any) => {
            this.focus.node.active = false
        })

        this.node.on(cc.Node.EventType.TOUCH_END, (event: any) => {
            this.focus.node.active = false
            let isTouchMove = touchMoveEvent(event)
            if (isTouchMove) {
                return
            }
            this.focus.node.active = false //在桌子上处理
            if (this.touchLock || this.overBetLimitLock || this.cancelBetLock) {
                return
            }
            this.scheduleOnce(() => { //定时器
                this.touchLock = false
            }, 0.15);
            let oningRaceNum = RoomManage.roomItem.oningRaceNum

            if (RaceManage.raceList[oningRaceNum].state !== RaceState.BET) {
                cc.log('当前不是下注环节，不能下注')
                return
            }
            if (RaceManage.raceList[oningRaceNum].landlordId === UserManage.userInfo.id) {
                cc.log('地主不能下注')
                return
            }
            if (this.isOverBetTime()) {
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

    isOverBetTime(): boolean {
        let betTime = cc.find('Canvas/MiddleTopTimePanel').getComponent('MiddleTopTimePanel').getShowTime()
        if (betTime <= 1) {
            cc.log('超出下注时间')
            return true
        }
        return false
    }

    async execCancel(roomId: number, userId: string, raceNum: number, theBetLocaion: betLocaion) {
        let result = await BetManage.cancelBetByLocation(roomId, userId, raceNum, theBetLocaion)
        this.scheduleOnce(() => {
            this.cancelBetLock = false
        }, 0.5);
        cc.log('删除打印：成功删除下注')
        let notice = {
            type: NoticeType.cancelRaceBet, info: {
                userId: userId,
                roomId: roomId,
                raceNum: raceNum,
                betLocation: theBetLocaion
            } as BetNoticeData
        } as NoticeData
        webSocketManage.send(JSON.stringify(notice));
    }
    // update (dt) {}
}
