const { ccclass } = cc._decorator;
import { config } from '../../common/Config'
import RaceItem from './RaceItem'
import { appMode, PromiseParam, PromiseResult } from '../../common/Const'
import { RaceList } from '../../mock/RaceList'
import { raceRecord } from './RaceBase'
import GameMemberManage from '../GameMember/GameMemberManage'
import { BetScore } from '../Bets/BetBase'
import BetLocItem from '../Bets/BetLocItem'
import GameMemberItem from '../GameMember/GameMemberItem'
import axios from 'axios'
@ccclass
class RaceManage {
    public raceList: RaceItem[] = []

    public requestRaceList(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (this.raceList.length > 0) {
                resolve({ result: PromiseResult.SUCCESS, extObject: this.raceList })
                return
            }
            if (config.appMode === appMode.DEV) {
                RaceList.forEach((item: raceRecord): void => {
                    this.raceList[item.raceId] = new RaceItem(item)
                })
            } else {

            }
            resolve({ result: PromiseResult.SUCCESS, extObject: this.raceList })
        })
    }

    //将下注信息整合到比赛信息集合中并返回
    async updateBetToRaceInfo() {
        let raceInfo = await this.requestRaceList()
        let raceList = raceInfo.extObject as RaceItem[]
        let memberInfo = await GameMemberManage.requestGameMemberList()
        let memberList = memberInfo.extObject as GameMemberItem[]
        raceList.forEach(raceItem => {
            raceItem.betInfo = []
            memberList.forEach(item => {
                raceItem.betInfo[item.userId] = new BetLocItem({
                    raceId: raceItem.raceId,
                    userId: item.userId,
                    sky: 0,
                    land: 0,
                    middle: 0,
                    bridg: 0,
                    skyCorner: 0,
                    landCorner: 0
                })
            })
        })
        this.raceList = raceList
        cc.log('本地比赛下注数据初始化完毕')
        cc.log(this.raceList)
    }
}

export default new RaceManage