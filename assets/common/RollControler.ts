const { ccclass } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { RaceState, EventType, TableLocationType, RaceStateChangeParam, LocalNoticeEventPara, LocalNoticeEventType, roomState } from '../common/Const'
import { randEventId } from '../common/Util'
import RaceManage from '../store/Races/RaceManage'
import RoomManage from '../store/Room/RoomManage'
import GameMemberManage from '../store/GameMember/GameMemberManage'
import GameMemberItem from '../store/GameMember/GameMemberItem'
@ccclass
export class RollControlerOb {
    _isRuning: boolean = false
    get isRuning() {
        return this._isRuning;
    }
    set isRuning(value: boolean) {
        if (!this._isRuning && value) {
            cc.log('游戏控制器被启动')
            this.startRun()
        }
        this._isRuning = value;
    }

    startRun(): void {
        this.initControl()
    }

    //启动控制器
    private initControl(): void {
        this.eventReceive()
    }

    //添加事件接受
    eventReceive() {
        //比赛流程状态改变通知
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, randEventId(), (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.SHOW_DOWN: //比大小
                    this.toShowMjResult()
                    break
                case RaceState.BET:  //下注
                    this.emulateBet()
                    break
                case RaceState.FINISHED:  //当场比赛结束
                    this.toStartNextRace()
                    break
            }
        })

        //本地事件通知
        eventBus.on(EventType.LOCAL_NOTICE_EVENT, randEventId(), (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.PLAY_BUTTON_EVENT:  //游戏开始按钮被点击
                    this.responsePlayButtonEvent()
                    break
                case LocalNoticeEventType.LOCAL_BE_LANDLORD_RESULT: //响应本地是否选择当地主结果
                    cc.log('响应本地是否选择当地主')
                    this.responseLocalBeLandlordDeal(info.info)
                    break
                case LocalNoticeEventType.ROLL_DICE_FINISHED_NOTICE: //响应摇色子动画结束通知
                    cc.log('响应摇色子动画结束通知,修改状态为发牌')
                    cc.log('我是控制器，我接到了摇色子动画结束的通知，我将比赛状态改为发牌')
                    RaceManage.changeRaceState(RaceState.DEAL)
                    break
                case LocalNoticeEventType.DELIVERY_CARD_FINISHED_NOTICE:
                    cc.log('响应发牌动画结束通知,将状态改为下注')
                    cc.log('我是控制器，我接到了发牌动画结束的通知，我将比赛状态改为下注')
                    RaceManage.changeRaceState(RaceState.BET)
                    break
                case LocalNoticeEventType.LOCAL_TIME_XIAZHU_FINISHED_NOTICE: //本地下注时间已过
                    cc.log('我是模拟器，当前下注时间已过，我将比赛状态改为比大小')
                    RaceManage.changeRaceState(RaceState.SHOW_DOWN)
                    break
                case LocalNoticeEventType.OPEN_CARD_FINISHED_NOTICE:
                    cc.log('我是控制器，我接到了开牌动画结束通知，我将比赛状态改为下注')
                    setTimeout(() => {
                        cc.log('比大小已经持续了4s,我将比赛状态改为显示单局结果')
                        RaceManage.changeRaceState(RaceState.SHOW_RESULT)
                        setTimeout(() => {
                            cc.log('显示单局比赛结果已经持续了2s,我将单场比赛状态改为结束')
                            RaceManage.changeRaceState(RaceState.FINISHED)
                        }, 2000)
                    }, 5000)
                    break
            }
        })
    }

    //向服务器发请求，改变游戏状态
    responsePlayButtonEvent(): void {
        cc.log('控制器收到游戏按钮点击事件')
    }

    //启动下场比赛
    toStartNextRace(): void {
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        if ((oningRaceNum + 1) === RoomManage.roomItem.playCount) {
            cc.log('所有比赛都完成')
            cc.log('因为所有比赛都完成了，将房间状态改为比赛全部结束')
            RoomManage.roomItem.roomState = roomState.ALL_RACE_FINISHED
            return
        }
        if ((oningRaceNum + 1) > RoomManage.roomItem.playCount) {
            cc.log('所有比赛已完成，无下场比赛')
            return
        }
        cc.log('我是控制器，我修改了进行中的场次值，开始下场比赛')
        let nextRaceNum = oningRaceNum + 1
        cc.log('当前场次的编号：' + oningRaceNum + ',下场比赛的编号:' + nextRaceNum)
        setTimeout(() => {
            RoomManage.roomItem.oningRaceNum = nextRaceNum
            cc.log('我是控制器，我开始了下局比赛，所以直接将下场比赛状态改为摇色子')
            let i = 0
            GameMemberManage.gameMenmberList.forEach((item: GameMemberItem) => {
                if (i === nextRaceNum) {
                    cc.log('我是控制器，因为开始了下场比赛，我随机修改了地主值')
                    RaceManage.raceList[nextRaceNum].landlordId = item.userId
                }
                i++
            })
            RaceManage.changeRaceState(RaceState.ROLL_DICE)
        }, 3000)
    }
    //显示结果麻将结果通知
    toShowMjResult(): void {
        cc.log('发出翻牌通知')
        eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: TableLocationType.LANDLORD } as LocalNoticeEventPara)
    }

    responseLocalBeLandlordDeal(wantLandlord: boolean) {
        cc.log('控制器接收到用户是否愿意当地主通知')
    }

    emulateBet(): void { //控制器不实现

    }
}

export const rollControler = new RollControlerOb()
