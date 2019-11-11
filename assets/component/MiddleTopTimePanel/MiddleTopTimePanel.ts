const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { randEventId } from '../../common/Util'

import { EventType, RaceStateChangeParam, RaceState, LocalNoticeEventType, LocalNoticeEventPara } from '../../common/Const'
import RaceManage from '../../store/Races/RaceManage';
import { config } from '../../common/Config';
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    time: cc.Label = null;

    start() {
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, randEventId(), (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.BET:  //下注
                    cc.log('下注时间管理面板收到下注通知，设置本地下注时间定时器')
                    let time = config.localXiaZhuLimiTime
                    this.time.string = time.toString()
                    let count: number = 0
                    let setInter = setInterval(() => {
                        count++
                        if (count > time) {
                            clearInterval(setInter)
                            cc.log('本地下注时间结束，发出本地下注时间已过通知')
                            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                                type: LocalNoticeEventType.LOCAL_TIME_XIAZHU_FINISHED_NOTICE
                            } as LocalNoticeEventPara)
                        } else {
                            this.time.string = (time - count).toString()
                        }
                    }, 1000)
                    break
            }
        })
    }

}
