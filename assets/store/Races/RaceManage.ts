const { ccclass } = cc._decorator;
import { config } from '../../common/Config'
import RaceItem from './RaceItem'
import { appMode, PromiseParam, PromiseResult } from '../../common/Const'
import { RaceList } from '../../mock/RaceList'
import { raceRecord } from './RaceBase'
import axios from 'axios'
@ccclass
class RaceManage {
    private raceList: RaceItem[] = []

    public requestRaceList(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (config.appMode === appMode.DEV) {
                RaceList.forEach((item: raceRecord): void => {
                    this.raceList.push(new RaceItem(item))
                })
            } else {

            }
            resolve({ result: PromiseResult.SUCCESS, extObject: this.raceList })
        })
    }
}

export default new RaceManage