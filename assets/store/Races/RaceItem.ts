const { ccclass } = cc._decorator;
import BetLocItem from '../../store/Bets/BetLocItem'
import { eventBus } from '../../common/EventBus'
import { EventType, GameState, raceRecord, raceState, MajongResult, PushEventPara, PushEventType } from '../../common/Const'
@ccclass
export default class RaceItem {
    public raceId: string = null
    public num: number = null
    public _state: raceState = null
    public _landlordId: string = null
    public betInfo: BetLocItem[] = null //下注信息集合
    public majongResult: MajongResult = null

    constructor(val: raceRecord) {
        this.raceId = val.raceId
        this.num = val.num
        this.state = val.state
        this.betInfo = val.betInfo
        this.landlordId = val.landlordId
        this.majongResult = val.majongResult
    }

    get landlordId(): string {
        return this._landlordId
    }

    set landlordId(val: string) {
        if (this._landlordId != null) {
            cc.log('地主改变了,下发通知')
            eventBus.emit(EventType.PUSH_EVENT, { eventType: PushEventType.LANDLORD_CHANGE } as PushEventPara)
        }
        this._landlordId = val
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
