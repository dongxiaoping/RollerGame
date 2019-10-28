const { ccclass } = cc._decorator;
import {raceRecord, raceState} from './RaceBase'

@ccclass
export default class RaceItem {
    private raceId: string = null
    private num: number = null
    private state: raceState = null

    constructor(val: raceRecord) {
        this.raceId = val.raceId
        this.num = val.num
        this.state = val.state
    }
}
