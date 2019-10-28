const { ccclass } = cc._decorator;
import { BetRecord } from './BetBase'

@ccclass
export default class BetItem {
    private id: string = null
    private userId: string = null
    private moneyValue: number = null

    constructor(val: BetRecord) {
        this.id = val.id
        this.userId = val.userId
        this.moneyValue = val.moneyValue
    }
}
