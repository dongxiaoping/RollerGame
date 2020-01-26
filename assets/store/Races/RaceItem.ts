import { eventBus } from '../../common/EventBus'
import { CompareDxRe, EventType, raceRecord, RaceState, RaceStateChangeParam, DiceCountInfo, TableLocationType, raceResultData, betLocaion } from '../../common/Const'
import GameMemberManage from '../GameMember/GameMemberManage';
import { getMemeberResultScoreList } from '../../common/Util';

export default class RaceItem {
    public raceId: string = null
    public num: number = null
    private _state: RaceState = null
    private _landlordId: string = null
    public landlordScore: DiceCountInfo = null
    public skyScore: DiceCountInfo = null  //牌值
    public middleScore: DiceCountInfo = null
    public landScore: DiceCountInfo = null

    public points: DiceCountInfo = null

    public landResult: CompareDxRe = null //输赢结果
    public middleResult: CompareDxRe = null
    public bridgResult: CompareDxRe = null
    public landCornerResult: CompareDxRe = null
    public skyCornerResult: CompareDxRe = null
    public skyResult: CompareDxRe = null

    public raceResultList: raceResultData[] = null //成员本局分数统计结果列表 这个指是从服务器下发的

    constructor(val: raceRecord) {
        this.raceId = val.id
        this.num = val.raceNum
        this._state = val.playState

        this.landlordScore = val.landlordScore
        this.skyScore = val.skyScore
        this.middleScore = val.middleScore
        this.landScore = val.landScore

        this.points = val.points
        this._landlordId = val.landlordId
        this.landResult = val.landResult
        this.middleResult = val.middleResult
        this.bridgResult = val.bridgResult
        this.landCornerResult = val.landCornerResult
        this.skyCornerResult = val.skyCornerResult
        this.skyResult = val.skyResult
    }

    getUserRaceScore(userId: string): number {
        if (this.raceResultList === null) {
            return 0
        }
        for (let i = 0; i < this.raceResultList.length; i++) {
            if (this.raceResultList[i].userId === userId) {
                return this.raceResultList[i].score
            }
        }
        return 0
    }

    getLocationResult(location: betLocaion): CompareDxRe {
        switch (location) {
            case betLocaion.SKY:
                return this.skyResult
            case betLocaion.MIDDLE:
                return this.middleResult
            case betLocaion.LAND:
                return this.landResult
            case betLocaion.SKY_CORNER:
                return this.skyCornerResult
            case betLocaion.BRIDG:
                return this.bridgResult
            case betLocaion.LAND_CORNER:
                return this.landCornerResult
        }
        cc.log('位置错误')
        return null
    }

    setRaceResultList(list: raceResultData[]): void {
        this.raceResultList = getMemeberResultScoreList(list, GameMemberManage.gameMenmberList)
    }

    getMahjongScore(location: TableLocationType) {
        switch (location) {
            case TableLocationType.SKY:
                return this.skyScore;
            case TableLocationType.MIDDLE:
                return this.middleScore;
            case TableLocationType.LAND:
                return this.landScore;
            case TableLocationType.LANDLORD:
                return this.landlordScore;
        }
    }


    get landlordId(): string {
        return this._landlordId
    }

    setLandlordId(val: string, oningRace: number) {
        if (oningRace == this.num) {
            eventBus.emit(EventType.LANDLORD_CAHNGE_EVENT, val)
        }
        this._landlordId = val
    }


    get state(): RaceState {
        return this._state
    }

    set state(val: RaceState) {
        if (this._state != null) {
            cc.log('单场游戏状态改变了,下发通知')
            this._state = val
            let raceChangeInfo = { toState: val, raceId: this.raceId, raceNum: this.num } as RaceStateChangeParam
            cc.log(raceChangeInfo)
            eventBus.emit(EventType.RACE_STATE_CHANGE_EVENT, raceChangeInfo)
        }
        this._state = val
    }
}
