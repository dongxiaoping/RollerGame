const { ccclass } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { EventType, GameState, DiceCountInfo } from '../common/Const'
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

    startRun(): void{
        this.initControl()
    }

    //启动控制器
    private initControl(): void {
        this.eventReceive()
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

    //事件接收
    private eventReceive(): void {
        eventBus.on(EventType.DICE_COUNT, randEventId(), (info: DiceCountInfo): void => {
            cc.log('接收到色子点数')
            cc.log(info)
        })

        eventBus.on(EventType.PLAY_BUTTON_EVENT, randEventId(), (info: any): void => {
            cc.log('控制器接收到游戏开始按钮通知')
            this.toChoiceLandlord()
            cc.log(info)
        })
    }
}

export  const rollControler = new RollControlerOb()
