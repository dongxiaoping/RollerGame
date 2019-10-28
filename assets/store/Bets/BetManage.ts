const { ccclass } = cc._decorator;
import { config } from '../../common/Config'
import BetItem from './BetItem'
import { appMode, PromiseParam, PromiseResult } from '../../common/Const'
import { BetList } from '../../mock/BetList'
import { BetRecord } from './BetBase'
import axios from 'axios'
@ccclass
class BetManage {
    private betList: BetItem[] = []

    public requestBetList(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (config.appMode === appMode.DEV) {
                BetList.forEach((item: BetRecord): void => {
                    this.betList.push(new BetItem(item))
                })
            } else {

            }
            resolve({ result: PromiseResult.SUCCESS, extObject: this.raceList })
        })
    }
}

export default new BetManage