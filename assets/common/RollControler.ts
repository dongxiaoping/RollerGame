const { ccclass } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { EventType } from '../common/Const'
@ccclass
class RollControler {
    test(): void {
        console.log('roll 控制器')
        setTimeout(() => {
            eventBus.emit(EventType.WAIT_BEGIN, {
                num: 3,z: 4
            })
        }, 4000)
    }
}

export default new RollControler()
