const { ccclass } = cc._decorator;
import {raceRecord, raceState} from './RaceBase'
import BetLocItem from '../../store/Bets/BetLocItem'
@ccclass
export default class RaceItem {
    public raceId: string = null
    public num: number = null
    public state: raceState = null
    public betInfo: BetLocItem[] = null //下注信息集合

    constructor(val: raceRecord) {
        this.raceId = val.raceId
        this.num = val.num
        this.state = val.state
        this.betInfo = val.betInfo
    }
}
