const { ccclass } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { EventType } from '../common/Const'
@ccclass
class RollControler {
    constructor(){
          this.eventReceive()
          
    }

    //事件接收
    private eventReceive(): void {
        let eventId = `mst_app_${new Date().getTime()}_${Math.ceil(
            Math.random() * 10
          )}`
        eventBus.on(EventType.DICE_COUNT, eventId, (info:any): void => {
            cc.log('接收到色子点数')
            cc.log(info)
          })
    }

    test(): void {
        console.log('roll 控制器')
        // setTimeout(() => {
        //     eventBus.emit(EventType.WAIT_BEGIN, {
        //         num: 3,z: 4
        //     })
        // }, 4000)
    }
}

export default new RollControler()
