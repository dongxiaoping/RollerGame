const { ccclass } = cc._decorator;
import { BetRecord, betLocaion, BetScore } from './BetBase'

@ccclass
export default class BetLocItem {
    public userId: string = null
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
        this.land = val.land
        this.middle = val.middle
        this.bridg = val.bridg
        this.skyCorner = val.skyCorner
        this.landCorner = val.landCorner
    }

    get sky(): number {
        return this._sky
    }
    set sky(val: number) {
        this.valueChangeNotice(betLocaion.SKY_CORNER,this._sky,val)
        this._sky = val
    }

    get land(): number {
        return this._land
    }
    set land(val: number) {
        this.valueChangeNotice(betLocaion.LAND,this._land,val)
        this._land = val
    }

    get middle(): number {
        return this._middle
    }
    set middle(val: number) {
        this.valueChangeNotice(betLocaion.MIDDLE,this._middle,val)
        this._middle = val
    }

    get bridg(): number {
        return this._bridg
    }
    set bridg(val: number) {
        this.valueChangeNotice(betLocaion.BRIDG,this._bridg,val)
        this._bridg = val
    }

    get skyCorner(): number {
        return this._skyCorner
    }
    set skyCorner(val: number) {
        this.valueChangeNotice(betLocaion.SKY_CORNER,this._skyCorner,val)
        this._skyCorner = val
    }

    get landCorner(): number {
        return this.landCorner
    }
    set landCorner(val: number) {
        this.valueChangeNotice(betLocaion.LAND_CORNER,this._landCorner,val)
        this._landCorner = val
    }

    valueChangeNotice(locatIon: betLocaion, fromVal: number, toValue: number): void {
        
        cc.log('投注值改变通知')
    }
}
