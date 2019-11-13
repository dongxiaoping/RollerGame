const { ccclass } = cc._decorator;
import { config } from '../../common/Config'
import { appMode, PromiseParam, PromiseResult } from '../../common/Const'
import RaceManage from '../Races/RaceManage'
import RaceItem from '../Races/RaceItem'
import axios from 'axios'
@ccclass
class GameStateInfo {
    constructor() {
    }

    //获取指定场次的天、地、中、桥四个位置的结果 弃用
    public requestMjResult(ranceId: string): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (config.appMode === appMode.LOCAL_TEST) {
                RaceManage.requestRaceList().then((configResult: PromiseParam): void => {
                    let list = configResult.extObject as RaceItem[]
                    cc.log('获取各个牌的点数')
                    cc.log('场次ID：' + ranceId)
                    cc.log(list[ranceId].majongResult)
                    resolve({ result: PromiseResult.SUCCESS, extObject: { raceId: ranceId, points: list[ranceId].majongResult } })
                })
            } else {

            }

        })
    }
}

export default new GameStateInfo()
