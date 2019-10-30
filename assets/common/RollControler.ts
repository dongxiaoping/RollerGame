const { ccclass } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { EventType, GameState, DiceCountInfo, ChildGameParam, ChildGameState } from '../common/Const'
import { randEventId } from '../common/Util'
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
    }





    //指令，发出摇色子的指令
    toRollDice(): void {
        cc.log('控制器发出摇色子指令')
        eventBus.emit(EventType.GAME_STATE_CHANGE, {
            from: GameState.CHOICE_LANDLORD, to: GameState.ROLL_DICE
        })
    }

    //指令，游戏开始，开始选地主通知
    toChoiceLandlord(): void {
        cc.log('控制器发出选地主指令')
        eventBus.emit(EventType.GAME_STATE_CHANGE, {
            from: GameState.WAIT_BEGIN, to: GameState.CHOICE_LANDLORD
        })
    }

    //服务器端推送事件接收,并将事件转化为本地事件发出去 ，模拟器重写该函数主动触发
    //websocke在这个地方调用
    serverEventReceive(): void {
        cc.log('添加服务器推送事件接收')
    }

    //事件接收
    private localEventReceive(): void {
        eventBus.on(EventType.CHILD_GAME_STATE_CHANGE, randEventId(), (info: ChildGameParam): void => {
            if (info.parentState === GameState.ROLL_DICE && info.childState === ChildGameState.ROLL_DICE.DICE_COUNT) {
                cc.log('接收到色子点数')
                cc.log(info.val)
                cc.log('摇色子结束，发指令，开始发牌指令')
                eventBus.emit(EventType.GAME_STATE_CHANGE, {
                    from: GameState.ROLL_DICE, to: GameState.DEAL
                })
            } else if (info.parentState === GameState.WAIT_BEGIN && info.childState === ChildGameState.WAIT_BEGIN.PLAY_BUTTON_EVENT) {
                cc.log('控制器接收到游戏开始按钮通知')
                this.toChoiceLandlord()
                cc.log(info)
            }
        })

        eventBus.on(EventType.GAME_LINK_FINISH, randEventId(), (info: any): void => {
            cc.log('控制器接收到游戏环节结束通知')
            let state = info.state
            switch (state) {
                case GameState.CHOICE_LANDLORD:  //选地主结束
                    cc.log('选地主结束,发指令，开始摇色子流程')
                    this.toRollDice()
                    break
            }
        })
    }
}

export const rollControler = new RollControlerOb()
