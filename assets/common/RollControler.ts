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
        this.localEventReceive()
        this.serverEventReceive()
        this.gameEventReceive()

    }

    gameEventReceive() {
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, randEventId(), (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.SHOW_DOWN:
                    this.toShowMjResult()
                    break
            }
        })
    }

    getMjResultFromService() {

    }

    //显示结果麻将结果通知
    toShowMjResult(): void {
        debugger
        cc.log('发出翻牌通知')
        eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: TableLocationType.LANDLORD } as LocalNoticeEventPara)
        // setTimeout(() => {
        //     eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: TableLocationType.LAND } as LocalNoticeEventPara)
        // }
        //     , 1000)
        // setTimeout(() => {
        //     eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: TableLocationType.MIDDLE } as LocalNoticeEventPara)
        // }
        //     , 2000)
        // setTimeout(() => {
        //     eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: TableLocationType.SKY } as LocalNoticeEventPara)
        // }
        //     , 3000)
    }

    // //指令，发出摇色子的指令
    // toRollDice(): void {
    //     cc.log('控制器发出摇色子指令')
    //     // eventBus.emit(EventType.GAME_STATE_CHANGE, {
    //     //     from: GameState.CHOICE_LANDLORD, to: GameState.ROLL_DICE
    //     // })
    // }

    //指令，游戏开始，开始选地主通知
    // toChoiceLandlord(): void {
    //     cc.log('控制器发出选地主指令')
    //     // eventBus.emit(EventType.GAME_STATE_CHANGE, {
    //     //     from: GameState.WAIT_BEGIN, to: GameState.CHOICE_LANDLORD
    //     // })
    // }

    //服务器端推送事件接收,并将事件转化为本地事件发出去 ，模拟器重写该函数主动触发
    //websocke在这个地方调用
    serverEventReceive(): void {
        cc.log('添加服务器推送事件接收')
    }

    //接收到本地游戏开始按钮后的事件处理逻辑
    responsePlayBottomEvent() {
        cc.log('控制器接收到游戏开始按钮通知')

    }

    responseLocalBeLandlordDeal(wantLandlord: boolean) {
        cc.log('控制器接收到用户是否愿意当地主通知')
    }

    //事件接收
    private localEventReceive(): void {
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
                case LocalNoticeEventType.LOCAL_BE_LANDLORD_RESULT: //响应本地是否选择当地主
                    cc.log('响应本地是否选择当地主')
                    this.responseLocalBeLandlordDeal(info.info)
                    break
                case LocalNoticeEventType.ROLL_DICE_FINISHED_NOTICE: //响应摇色子动画结束通知
                    cc.log('响应摇色子动画结束通知,修改状态为发牌')
                    debugger
                    RaceManage.changeRaceState(RaceState.DEAL)
                    break
                case LocalNoticeEventType.DELIVERY_CARD_FINISHED_NOTICE:
                    cc.log('响应发牌动画结束通知,将状态改为下注')
                    debugger
                    RaceManage.changeRaceState(RaceState.BET)
                    break
            }
        })

        // eventBus.on(EventType.CHILD_GAME_STATE_CHANGE, randEventId(), (info: ChildGameParam): void => {
        //     if (info.parentState === GameState.ROLL_DICE && info.childState === ChildGameState.ROLL_DICE.DICE_COUNT) {
        //         cc.log('接收到色子点数')
        //         cc.log(info.val)
        //         cc.log('摇色子结束，将本场状态值改为发牌')
        //         RaceManage.raceList[1].state = raceState.DEAL
        //     } else if (info.parentState === GameState.WAIT_BEGIN && info.childState === ChildGameState.WAIT_BEGIN.PLAY_BUTTON_EVENT) {
        //         this.responsePlayBottomEvent()
        //     } else if(info.parentState === GameState.CHOICE_LANDLORD && info.childState === ChildGameState.CHOICE_LANDLORD.LOCAL_BE_LANDLORD_RESULT) {
        //         this.responseLocalBeLandlordDeal(info.val)
        //     }
        // })

        // eventBus.on(EventType.GAME_LINK_FINISH, randEventId(), (info: any): void => {
        //     cc.log('控制器接收到游戏环节结束通知')
        //     let state = info.state
        //     switch (state) {
        //         case GameState.CHOICE_LANDLORD:  //选地主结束
        //             cc.log('选地主结束,发指令，开始摇色子流程')
        //             this.toRollDice()
        //             break
        //         case GameState.DEAL:  //发牌结束
        //             this.toBet()
        //     }
        // })

        // eventBus.on(EventType.GAME_STATE_CHANGE, randEventId(), (info: any): void => {
        //     let to = info.to
        //     switch (to) {
        //         case GameState.SHOW_DOWN: 
        //             cc.log('控制器收到比大小指令，开始比大小流程')
        //             this.toShowMjResult()
        //             break
        //     }
        // })
    }
}

export const rollControler = new RollControlerOb()
