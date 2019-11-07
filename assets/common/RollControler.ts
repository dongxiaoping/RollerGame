const { ccclass } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { RaceState, EventType, TableLocationType, RaceStateChangeParam, LocalNoticeEventPara, LocalNoticeEventType, PushEventPara, PushEventType } from '../common/Const'
import { randEventId } from '../common/Util'
import RaceManage from '../store/Races/RaceManage'
import RoomManage from '../store/Room/RoomManage'
import UserManage from '../store/User/UserManage'
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
                case RaceState.SHOW_DOWN:
                    this.toShowMjResult()
                    break
                case RaceState.BET:
                    this.emulateBet()
                    break
            }
        })

        //本地事件通知
        eventBus.on(EventType.LOCAL_NOTICE_EVENT, randEventId(), (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.PLAY_BUTTON_EVENT:  //游戏开始按钮被点击
                    cc.log('向当前用户推送当地主邀请')
                    eventBus.emit(EventType.PUSH_EVENT, {
                        type: PushEventType.LANDLOAD_WELCOME,
                        info: { userId: UserManage.userInfo.id }
                    } as PushEventPara)
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
            }
        })
    }

    //显示结果麻将结果通知
    toShowMjResult(): void {
        cc.log('发出翻牌通知')
        eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: TableLocationType.LANDLORD } as LocalNoticeEventPara)
        setTimeout(() => {
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: TableLocationType.LAND } as LocalNoticeEventPara)
        }
            , 1000)
        setTimeout(() => {
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: TableLocationType.MIDDLE } as LocalNoticeEventPara)
        }
            , 2000)
        setTimeout(() => {
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: TableLocationType.SKY } as LocalNoticeEventPara)
        }
            , 3000)
    }

    responseLocalBeLandlordDeal(wantLandlord: boolean) {
        cc.log('控制器接收到用户是否愿意当地主通知')
    }

    emulateBet():void{ //控制器不实现

    }
}

export const rollControler = new RollControlerOb()
