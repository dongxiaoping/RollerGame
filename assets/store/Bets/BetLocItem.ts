const { ccclass } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, betLocaion, BetScore, BetChipChangeInfo, LocationResultDetail } from '../../common/Const'
/*
本地存储的记录
*/
@ccclass
export default class BetLocItem {
    public userId: string = null
    public userName: string = null
    public raceId: string = null
    public _sky: number = null
    public _land: number = null
    public _middle: number = null
    public _bridg: number = null
    public _skyCorner: number = null
    public _landCorner: number = null

    constructor(val: BetScore) {
        this.raceId = val.raceId
        this.userId = val.userId
        this.sky = val.sky
        this.userName = val.userName
        this.land = val.land
        this.middle = val.middle
        this.bridg = val.bridg
        this.skyCorner = val.skyCorner
        this.landCorner = val.landCorner
    }

    //根据各个位置的输赢、获取当前场次，当前用户，当前时刻的得分
    getScore(locationResultDetail: LocationResultDetail): number { 
        return 0
    }

    get sky(): number {
        return this._sky
    }
    set sky(val: number) {
        if (this._sky !== null) {
            this.valueChangeNotice(betLocaion.SKY, this._sky, val)
        }
        this._sky = val
    }

    get land(): number {
        return this._land
    }
    set land(val: number) {
        if (this._land !== null) {
            this.valueChangeNotice(betLocaion.LAND, this._land, val)
        }
        this._land = val
    }

    get middle(): number {
        return this._middle
    }
    set middle(val: number) {
        if (this._middle !== null) {
            this.valueChangeNotice(betLocaion.MIDDLE, this._middle, val)
        }
        this._middle = val
    }

    get bridg(): number {
        return this._bridg
    }
    set bridg(val: number) {
        if (this._bridg !== null) {
            this.valueChangeNotice(betLocaion.BRIDG, this._bridg, val)
        }
        this._bridg = val
    }

    get skyCorner(): number {
        return this._skyCorner
    }
    set skyCorner(val: number) {
        if (this._skyCorner !== null) {
            this.valueChangeNotice(betLocaion.SKY_CORNER, this._skyCorner, val)
        }
        this._skyCorner = val
    }

    get landCorner(): number {
        return this.landCorner
    }
    set landCorner(val: number) {
        if (this._landCorner !== null) {
            this.valueChangeNotice(betLocaion.LAND_CORNER, this._landCorner, val)
        }
        this._landCorner = val
    }

    valueChangeNotice(locatIon: betLocaion, fromVal: number, toValue: number): void {
        let info = { raceId: this.raceId, userId: this.userId, betLocation: locatIon, fromVal: fromVal, toValue: toValue } as BetChipChangeInfo
        cc.log('投注值改变通知' + JSON.stringify(info))
        eventBus.emit(EventType.BET_CHIP_CHANGE_EVENT, info)
    }
}
