const { ccclass } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { CompareDxRe, EventType, betLocaion, BetScore, BetChipChangeInfo, LocationResultDetail } from '../../common/Const'
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
    public score: number = null //地主的分数是统计面板统计后赋值的

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
        return this._landCorner
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

    //根据各个位置的输赢、获取当前场次，当前用户，当前时刻的得分
    getScore(locationResultDetail: LocationResultDetail): number {
        let score: number = 0
        switch (locationResultDetail.sky) {
            case CompareDxRe.BIG:
                score = score + this.sky
                break
            case CompareDxRe.SMALL:
                score = score - this.sky
                break
            case CompareDxRe.EQ:
                break
        }

        switch (locationResultDetail.middle) {
            case CompareDxRe.BIG:
                score = score + this.middle
                break
            case CompareDxRe.SMALL:
                score = score - this.middle
                break
            case CompareDxRe.EQ:
                break
        }

        switch (locationResultDetail.land) {
            case CompareDxRe.BIG:
                score = score + this.land
                break
            case CompareDxRe.SMALL:
                score = score - this.land
                break
            case CompareDxRe.EQ:
                break
        }

        switch (locationResultDetail.bridg) {
            case CompareDxRe.BIG:
                score = score + this.bridg
                break
            case CompareDxRe.SMALL:
                score = score - this.bridg
                break
            case CompareDxRe.EQ:
                break
        }

        switch (locationResultDetail.land_corner) {
            case CompareDxRe.BIG:
                score = score + this.landCorner
                break
            case CompareDxRe.SMALL:
                score = score - this.landCorner
                break
            case CompareDxRe.EQ:
                break
        }

        switch (locationResultDetail.sky_corner) {
            case CompareDxRe.BIG:
                score = score + this.skyCorner
                break
            case CompareDxRe.SMALL:
                score = score - this.skyCorner
                break
            case CompareDxRe.EQ:
                break
        }
        cc.log('我是' + this.userName + ',比大小信息,我的得分是:' + score)
        cc.log(this)
        this.score = score
        return score
    }
}
