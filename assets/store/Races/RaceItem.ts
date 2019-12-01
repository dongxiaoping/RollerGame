const { ccclass } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { CompareDxRe, EventType, raceRecord, RaceState, RaceStateChangeParam, DiceCountInfo, TableLocationType, raceResultData } from '../../common/Const'
import GameMemberManage from '../GameMember/GameMemberManage';
import GameMemberItem from '../GameMember/GameMemberItem';
@ccclass
export default class RaceItem {
    public raceId: string = null
    public num: number = null
    public _state: RaceState = null
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

    public raceResultList: raceResultData[] //成员本局分数统计结果列表 这个指是从服务器下发的

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

    setRaceResultList(list: raceResultData[]): void {
        function getItemFromResultDataByUserId(userId: string, list: raceResultData[]): raceResultData {
            for (let i = 0; i < list.length; i++) {
                if (list[i].userId === userId) {
                    return list[i]
                }
            }
            return null
        }
        let newList: raceResultData[] = []
        let memberList = GameMemberManage.gameMenmberList
        memberList.forEach((item: GameMemberItem) => {
            let userId = item.userId
            let result = getItemFromResultDataByUserId(userId, list)
            if (result === null) {
                newList.push({
                    raceNum: this.num,
                    userId: userId,
                    score: 0,
                    nick: item.nick,
                    icon: item.icon,
                } as raceResultData)
            } else {
                
                newList.push(result)
            }
        })
        this.raceResultList = newList
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

    set landlordId(val: string) {
        cc.log('地主改变了,下发通知')
        this._landlordId = val
        eventBus.emit(EventType.LANDLORD_CAHNGE_EVENT, val)
    }

    setLandlordIdWithoutNotice(val: string){
        this._landlordId = val
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
