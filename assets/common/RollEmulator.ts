const { ccclass, property } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { EventType, GameState } from '../common/Const'
import  from './'
@ccclass
class RollEmulator {
    _isRuning: boolean = false
    get isRuning() {
        return this._isRuning;
    }
    set isRuning(value) {
        if (!this._isRuning && value) {
            this.startEmulator()
        }
        this._isRuning = value;
    }

    //启动模拟器
    private startEmulator(): void {
        setTimeout(() => {
            eventBus.emit(EventType.GAME_STATE_CHANGE, {
                from: GameState.CHOICE_LANDLORD, to: GameState.ROLL_DICE
            })
        }, 4000)
    }
}

export default new RollEmulator()
