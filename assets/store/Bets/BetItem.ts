const { ccclass } = cc._decorator;
import { BetRecord } from './BetBase'

@ccclass
export default class BetItem {
    private id: string = null
    private userId: string = null
    private _moneyValue: number = null

    constructor(val: BetRecord) {
        this.id = val.id
        this.userId = val.userId
        this.moneyValue = val.moneyValue
    }

    get moneyValue(): number {
        return this._moneyValue
    }
    set moneyValue(val: number) {
        cc.log('下注值被改变了')
        this._moneyValue= val
    }
}
