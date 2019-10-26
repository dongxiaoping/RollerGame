const { ccclass, property } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { EventType, GameState } from '../common/Const'
import { RollControlerOb } from './RollControler'
@ccclass
class RollEmulator extends RollControlerOb {
    startRun(): void{
        super.startRun()
        this.startEulator()
    }

    startEulator(): void {
        setTimeout(() => {
            this.toRollDice()
        }, 4000)
    }
}

export default new RollEmulator()
