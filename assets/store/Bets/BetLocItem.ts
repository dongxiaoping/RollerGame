const { ccclass } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, PushEventPara, PushEventType, betLocaion, BetScore } from '../../common/Const'
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
    public score: number = null //本局比赛的得分

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
        this.score = val.score
    }

    get sky(): number {
        return this._sky
    }
    set sky(val: number) {
        if (this._sky !== null) {
            this.valueChangeNotice(betLocaion.SKY_CORNER, this._sky, val)
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
        let info = { raceId: this.raceId, userId: this.userId, betLocation: locatIon, fromVal: fromVal, toValue: toValue }
        eventBus.emit(EventType.PUSH_EVENT, {
            type: PushEventType.BET_CHIP_CHANGE, info: info
        } as PushEventPara)
        cc.log('投注值改变通知')
        cc.log(info)
    }
}
