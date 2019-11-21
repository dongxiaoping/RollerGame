const { ccclass } = cc._decorator;
import { config } from '../../common/Config'
import BetItem from './BetItem'
import { appMode, PromiseParam, PromiseResult, BetRecord, GameMember, BetScore } from '../../common/Const'
import { BetList } from '../../mock/BetList'
import axios from 'axios'
import BetLocItem from './BetLocItem';
@ccclass
class BetManage {
    betList: BetItem[] = [] //场次+用户Id 信息集合

    public init(memberList: GameMember[], raceCount: number) {
        let list = []
        for (let j = 0; j < raceCount; j++) {
            list[j] = []
            for (let i = 0; i < memberList.length; i++) {
                let item = {
                    userId: memberList[i].userId,
                    userName: memberList[i].nick,
                    sky: 0,
                    land: 0,
                    middle: 0,
                    bridg: 0,
                    skyCorner: 0,
                    landCorner: 0,
                } as BetScore
                list[j][memberList[i].userId] = new BetLocItem(item)
            }
        }
        this.betList = list
    }


    public requestBetList(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (this.betList !== null) {
                resolve({ result: PromiseResult.SUCCESS, extObject: this.betList })
                return
            }
            if (config.appMode === appMode.LOCAL_TEST) {
                BetList.forEach((item: BetRecord): void => {
                    this.betList.push(new BetItem(item))
                })
            } else {
            }
            resolve({ result: PromiseResult.SUCCESS, extObject: this.betList })
        })
    }

    //     this.raceList.forEach(raceItem => {
    //         raceItem.betInfo = []
    //         memberList.forEach(item => {
    //             raceItem.betInfo[item.userId] = new BetLocItem({
    //                 raceId: raceItem.raceId,
    //                 userId: item.userId,
    //                 userName: item.nick,
    //                 sky: 0,
    //                 land: 0,
    //                 middle: 0,
    //                 bridg: 0,
    //                 skyCorner: 0,
    //                 landCorner: 0,
    //             } as BetScore)
    //         })

    setBetList(list: BetRecord[]) {

    }
}

export default new BetManage