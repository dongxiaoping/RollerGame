const { ccclass } = cc._decorator;
import { raceRecord, raceState, MajongResult } from './RaceBase'
import BetLocItem from '../../store/Bets/BetLocItem'
import { eventBus } from '../../common/EventBus'
import { EventType, GameState } from '../../common/Const'
@ccclass
export default class RaceItem {
    public raceId: string = null
    public num: number = null
    public _state: raceState = null
    public betInfo: BetLocItem[] = null //下注信息集合
    public majongResult: MajongResult = null

    constructor(val: raceRecord) {
        this.raceId = val.raceId
        this.num = val.num
        this.state = val.state
        this.betInfo = val.betInfo
        this.majongResult = val.majongResult
    }

    get state(): raceState {
        return this._state
    }

    set state(val: raceState) {
        if (this._state != null) {
            cc.log('单场游戏状态改变了,下发通知')
            eventBus.emit(EventType.GAME_STATE_CHANGE, {
                from: this._state, to: val, raceId: this.raceId, num: this.num
            })
        }
        this._state = val
    }
}
