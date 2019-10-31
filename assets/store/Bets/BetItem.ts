const { ccclass } = cc._decorator;
import { BetRecord, betLocaion } from './BetBase'

@ccclass
export default class BetItem {
    public id: string = null
    public userId: string = null
    public raceId: string = null
    public betLocaion: betLocaion = null
    public _moneyValue: number = null

    constructor(val: BetRecord) {
        this.id = val.id
        this.userId = val.userId
        this.raceId = val.raceId
        this.betLocaion = val.betLocaion
        this.moneyValue = val.moneyValue
    }

    get moneyValue(): number {
        return this._moneyValue
    }
    set moneyValue(val: number) {
        cc.log('下注值被改变了,玩家:' + this.userId + ',旧的下注值:' + this._moneyValue + ',新的值：' + val)
        this._moneyValue = val
    }
}
