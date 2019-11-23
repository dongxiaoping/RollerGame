const { ccclass } = cc._decorator;
import { eventBus } from '../common/EventBus'
import { RaceState, EventType, TableLocationType, RaceStateChangeParam, LocalNoticeEventPara, LocalNoticeEventType, roomState } from '../common/Const'
import { randEventId } from '../common/Util'
import RaceManage from '../store/Races/RaceManage'
import RoomManage from '../store/Room/RoomManage'
import GameMemberManage from '../store/GameMember/GameMemberManage'
import GameMemberItem from '../store/GameMember/GameMemberItem'
import { config } from './Config';
@ccclass
export class RollControler {
    public isRuning: boolean = false
    public start() {
        cc.log('游戏控制器被启动')
        this.isRuning = true
    }
}

export default new RollControler()
