const { ccclass } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { EventType, GameState } from '../common/Const'
@ccclass
export class RollControlerOb {
    _isRuning: boolean = false
    get isRuning() {
        return this._isRuning;
    }
    set isRuning(value) {
        if (!this._isRuning && value) {
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

    //发出摇色子的指令
    toRollDice(): void {
        eventBus.emit(EventType.GAME_STATE_CHANGE, {
            from: GameState.CHOICE_LANDLORD, to: GameState.ROLL_DICE
        })
    }

    //事件接收
    private eventReceive(): void {
        let eventId = `roll_${new Date().getTime()}_${Math.ceil(
            Math.random() * 10
        )}`
        eventBus.on(EventType.DICE_COUNT, eventId, (info: any): void => {
            cc.log('接收到色子点数')
            cc.log(info)
        })
    }
}

export  const rollControler = new RollControlerOb()
