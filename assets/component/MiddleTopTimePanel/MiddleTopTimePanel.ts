const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, LocalNoticeEventType, LocalNoticeEventPara } from '../../common/Const'
import { config } from '../../common/Config';
import RoomManage from '../../store/Room/RoomManage';
import ConfigManage from '../../store/Config/ConfigManage';
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    time: cc.Label = null;
    @property(cc.AudioSource)
    stopBetVoice: cc.AudioSource = null; //停止下注语音

    start() {
        cc.log('下注时间管理面板收到下注通知，设置本地下注时间定时器')
        let time = RoomManage.getBetTime()
        this.time.string = time.toString()
        let count: number = 0
        this.schedule(() => {
            count++
            let showTime = time - count
            if (showTime == 2 && ConfigManage.isTxMusicOpen()) {
                this.stopBetVoice.play()
            }
            this.time.string = showTime.toString()
            if (showTime <= 0) {
                eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                    type: LocalNoticeEventType.LOCAL_TIME_XIAZHU_FINISHED_NOTICE
                } as LocalNoticeEventPara)
                this.node.active = false
                this.node.destroy()
            }
        }, 1, time, 1); //间隔时间s，重复次数，延迟时间s //执行次数=重复次数+1
    }

}
