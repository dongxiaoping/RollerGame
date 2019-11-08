const { ccclass } = cc._decorator;
import BetLocItem from '../../store/Bets/BetLocItem'
import { eventBus } from '../../common/EventBus'
import { isLandlordMahjongWin } from '../../common/Util'
import { CompareDxRe, LocationResultDetail, EventType, raceRecord, RaceState, MajongResult, RaceStateChangeParam } from '../../common/Const'
@ccclass
export default class RaceItem {
    public raceId: string = null
    public num: number = null
    public _state: RaceState = null
    private _landlordId: string = null
    public betInfo: BetLocItem[] = null //下注信息集合
    public majongResult: MajongResult = null //麻将点数信息
    private locationResultDetail: LocationResultDetail = null //本场比赛各个位置的输赢信息
    constructor(val: raceRecord) {
        this.raceId = val.raceId
        this.num = val.num
        this.state = val.state
        this.betInfo = val.betInfo
        this.landlordId = val.landlordId
        this.majongResult = val.majongResult
    }

    //获取本局比赛赢位
    getWinTableLocation(): LocationResultDetail {
        if (this.majongResult === null) {
            return null
        }
        if (this.locationResultDetail !== null) {
            return this.locationResultDetail
        }

        let locationResultDetail = {
            sky: CompareDxRe.EQ,
            land: CompareDxRe.EQ,
            middle: CompareDxRe.EQ,
            bridg: CompareDxRe.EQ,
            sky_corner: CompareDxRe.EQ,
            land_corner: CompareDxRe.EQ,
        } as LocationResultDetail

        let isSkyWin = !isLandlordMahjongWin(this.majongResult.landlord, this.majongResult.sky)
        let isLandWin = !isLandlordMahjongWin(this.majongResult.landlord, this.majongResult.land)
        let isMiddleWin = !isLandlordMahjongWin(this.majongResult.landlord, this.majongResult.middle)
        if(isSkyWin){
            locationResultDetail.sky = CompareDxRe.BIG
        }else{
            locationResultDetail.sky = CompareDxRe.SMALL
        }
        if(isLandWin){
            locationResultDetail.land = CompareDxRe.BIG
        }else{
            locationResultDetail.land = CompareDxRe.SMALL
        }
        if(isMiddleWin){
            locationResultDetail.middle = CompareDxRe.BIG
        }else{
            locationResultDetail.middle = CompareDxRe.SMALL
        }

        if(isSkyWin && isLandWin){
            locationResultDetail.bridg = CompareDxRe.BIG
        }else if(!isSkyWin && !isLandWin) {
            locationResultDetail.bridg = CompareDxRe.SMALL
        }else {
            locationResultDetail.bridg = CompareDxRe.EQ
        }

        if(isSkyWin && isMiddleWin){
            locationResultDetail.sky_corner = CompareDxRe.BIG
        }else if(!isSkyWin && !isMiddleWin) {
            locationResultDetail.sky_corner = CompareDxRe.SMALL
        }else {
            locationResultDetail.sky_corner = CompareDxRe.EQ
        }

        if(isMiddleWin && isLandWin){
            locationResultDetail.land_corner = CompareDxRe.BIG
        }else if(!isMiddleWin && !isLandWin) {
            locationResultDetail.land_corner = CompareDxRe.SMALL
        }else {
            locationResultDetail.land_corner = CompareDxRe.EQ
        }
        this.locationResultDetail = locationResultDetail
        return this.locationResultDetail
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
