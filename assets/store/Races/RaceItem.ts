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
    public landlordScore: DiceCountInfo = null
    public skyScore: DiceCountInfo = null
    public middleScore: DiceCountInfo = null
    public landScore: DiceCountInfo = null

    public points: DiceCountInfo = null

    public landResult: CompareDxRe = null
    public middleResult: CompareDxRe = null
    public bridgResult: CompareDxRe = null
    public landCornerResult: CompareDxRe = null
    public skyCornerResult: CompareDxRe = null
    public skyResult: CompareDxRe = null

    constructor(val: raceRecord) {
        this.raceId = val.id
        this.num = val.raceNum
        this.state = val.playState
        this.landlordId = val.landlordId

        this.landlordScore = val.landlordScore
        this.skyScore = val.skyScore
        this.middleScore = val.middleScore
        this.landScore = val.landScore

        this.points = val.points

        this.landResult = val.landResult
        this.middleResult = val.middleResult
        this.bridgResult = val.bridgResult
        this.landCornerResult = val.landCornerResult
        this.skyCornerResult = val.skyCornerResult
        this.skyResult = val.skyResult
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
