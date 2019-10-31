const { ccclass } = cc._decorator;
import {raceRecord, raceState} from './RaceBase'
import BetItem from '../../store/Bets/BetItem'
@ccclass
export default class RaceItem {
    public raceId: string = null
    public num: number = null
    public state: raceState = null
    public betInfo: BetItem[][] = null //下注信息集合

    constructor(val: raceRecord) {
        this.raceId = val.raceId
        this.num = val.num
        this.state = val.state
        this.betInfo = val.betInfo
    }
}
