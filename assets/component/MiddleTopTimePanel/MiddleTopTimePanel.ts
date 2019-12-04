const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, LocalNoticeEventType, LocalNoticeEventPara } from '../../common/Const'
import { config } from '../../common/Config';
import RoomManage from '../../store/Room/RoomManage';
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    time: cc.Label = null;

    start() {
        cc.log('下注时间管理面板收到下注通知，设置本地下注时间定时器')
        let time = RoomManage.getBetTime()
        this.time.string = time.toString()
        let count: number = 0
        let setInter = setInterval(() => {
            try {
                count++
                if (count > time) {
                    clearInterval(setInter)
                    cc.log('本地下注时间结束，发出本地下注时间已过通知')
                    eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                        type: LocalNoticeEventType.LOCAL_TIME_XIAZHU_FINISHED_NOTICE
                    } as LocalNoticeEventPara)
                    this.node.active = false
                    this.node.destroy()
                } else {
                    this.time.string = (time - count).toString()
                }
            } catch (e) {
                cc.log('定时器出错')
                clearInterval(setInter)
            }
        }, 1000)
    }

}
