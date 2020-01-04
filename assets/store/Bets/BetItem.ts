const { ccclass } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { CompareDxRe, EventType, betLocaion, BetChipChangeInfo, LocationResultDetail, BetRecord } from '../../common/Const'
import RaceItem from '../Races/RaceItem';
/*
本地存储的记录
*/
export default class Betitem {
    public userId: string = null
    public raceNum: number = null
    private _sky: number = 0
    private _land: number = 0
    private _middle: number = 0
    private _bridg: number = 0
    private _skyCorner: number = 0
    private _landCorner: number = 0

    constructor(val: BetRecord) {
        this.raceNum = val.raceNum
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
        this.valueChangeNotice(betLocaion.SKY, this._sky, val)
        this._sky = val
    }

    get land(): number {
        return this._land
    }
    set land(val: number) {
        this.valueChangeNotice(betLocaion.LAND, this._land, val)
        this._land = val
    }

    get middle(): number {
        return this._middle
    }
    set middle(val: number) {
        this.valueChangeNotice(betLocaion.MIDDLE, this._middle, val)
        this._middle = val
    }

    get bridg(): number {
        return this._bridg
    }
    set bridg(val: number) {
        this.valueChangeNotice(betLocaion.BRIDG, this._bridg, val)
        this._bridg = val
    }

    get skyCorner(): number {
        return this._skyCorner
    }
    set skyCorner(val: number) {
        this.valueChangeNotice(betLocaion.SKY_CORNER, this._skyCorner, val)
        this._skyCorner = val
    }

    get landCorner(): number {
        return this._landCorner
    }
    set landCorner(val: number) {
        this.valueChangeNotice(betLocaion.LAND_CORNER, this._landCorner, val)
        this._landCorner = val
    }

    //获取当前在各个位置的下注值和
    getXiaZhuVal() {
        return this.sky + this.middle + this.land + this.skyCorner + this.bridg + this.landCorner
    }

    valueChangeNotice(locatIon: betLocaion, fromVal: number, toValue: number): void {
        if (fromVal === 0 && toValue === 0) {
            return
        }
        if (fromVal !== 0 && toValue === 0) {
            let info = { raceNum: this.raceNum, userId: this.userId, betLocation: locatIon, fromVal: fromVal } as BetChipChangeInfo
            eventBus.emit(EventType.BET_CANCE_NOTICE, info)
        } else {
            let info = { raceNum: this.raceNum, userId: this.userId, betLocation: locatIon, fromVal: fromVal, toValue: toValue } as BetChipChangeInfo
            cc.log('投注值改变通知' + JSON.stringify(info))
            eventBus.emit(EventType.BET_CHIP_CHANGE_EVENT, info)
        }
    }

    //根据各个位置的输赢、获取当前场次，当前用户，当前时刻的得分
    getScore(skyResult: CompareDxRe, middleResult: CompareDxRe, landResult: CompareDxRe,
        skyCornerResult: CompareDxRe, bridgResult: CompareDxRe, landCornerResult: CompareDxRe): number {
        let score: number = 0
        switch (skyResult) {
            case CompareDxRe.BIG:
                score = score + this.sky
                break
            case CompareDxRe.SMALL:
                score = score - this.sky
                break
            case CompareDxRe.EQ:
                break
        }

        switch (middleResult) {
            case CompareDxRe.BIG:
                score = score + this.middle
                break
            case CompareDxRe.SMALL:
                score = score - this.middle
                break
            case CompareDxRe.EQ:
                break
        }

        switch (landResult) {
            case CompareDxRe.BIG:
                score = score + this.land
                break
            case CompareDxRe.SMALL:
                score = score - this.land
                break
            case CompareDxRe.EQ:
                break
        }

        switch (bridgResult) {
            case CompareDxRe.BIG:
                score = score + this.bridg
                break
            case CompareDxRe.SMALL:
                score = score - this.bridg
                break
            case CompareDxRe.EQ:
                break
        }

        switch (landCornerResult) {
            case CompareDxRe.BIG:
                score = score + this.landCorner
                break
            case CompareDxRe.SMALL:
                score = score - this.landCorner
                break
            case CompareDxRe.EQ:
                break
        }

        switch (skyCornerResult) {
            case CompareDxRe.BIG:
                score = score + this.skyCorner
                break
            case CompareDxRe.SMALL:
                score = score - this.skyCorner
                break
            case CompareDxRe.EQ:
                break
        }
        return score
    }
}
