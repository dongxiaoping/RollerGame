const { ccclass } = cc._decorator;
import BetLocItem from '../../store/Bets/BetLocItem'
import { eventBus } from '../../common/EventBus'
import { CompareDxRe, LocationResultDetail, EventType, raceRecord, RaceState, MajongResult, RaceStateChangeParam, DiceCountInfo } from '../../common/Const'
@ccclass
export default class RaceItem {
    public raceId: string = null
    public num: number = null
    public _state: RaceState = null
    private _landlordId: string = null
    public betInfo: BetLocItem[] = null //下注信息集合
    public majongResult: MajongResult = null //麻将点数信息
    public points: DiceCountInfo = null
    public locationResultDetail: LocationResultDetail = null //本场比赛各个位置的输赢信息
    constructor(val: raceRecord) {
        this.raceId = val.raceId
        this.num = val.num
        this.state = val.state
        this.betInfo = val.betInfo
        this.landlordId = val.landlordId
        this.majongResult = val.majongResult
        this.locationResultDetail = val.locationResultDetail
        this.points = val.points
    }

    get landlordId(): string {
        return this._landlordId
    }

    set landlordId(val: string) {
        if (this._landlordId != null && this._landlordId != val) {
            cc.log('地主改变了,下发通知')
            this._landlordId = val
            eventBus.emit(EventType.LANDLORD_CAHNGE_EVENT, val)
        } else {
            this._landlordId = val
        }
    }


    get state(): RaceState {
        return this._state
    }

    set state(val: RaceState) {
        if (this._state != null) {
            cc.log('单场游戏状态改变了,下发通知')
            eventBus.emit(EventType.RACE_STATE_CHANGE_EVENT, {
                fromState: this._state, toState: val, raceId: this.raceId, raceNum: this.num
            } as RaceStateChangeParam)
        }
        this._state = val
    }
}
