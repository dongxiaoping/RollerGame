const { ccclass } = cc._decorator;
import { config } from '../../common/Config'
import RaceItem from './RaceItem'
import { appMode, PromiseParam, PromiseResult, raceRecord, BetScore, RaceState } from '../../common/Const'
import { RaceList } from '../../mock/RaceList'
import GameMemberManage from '../GameMember/GameMemberManage'
import BetLocItem from '../Bets/BetLocItem'
import GameMemberItem from '../GameMember/GameMemberItem'
import RoomManage from '../../store/Room/RoomManage'
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
                    this.raceList[item.num] = new RaceItem(item)
                })
            } else {

            }
            resolve({ result: PromiseResult.SUCCESS, extObject: this.raceList })
        })
    }

    //获取当前正在进行中的比赛场次相关信息,如果没有返回null
    getPlayingRaceInfo() {
        let i = 0
        for (; i < this.raceList.length; i++) {
            if (this.raceList[i].state !== RaceState.NOT_BEGIN && this.raceList[i].state !== RaceState.FINISHED) {
                return this.raceList[i]
            }
        }
        return null
    }

    //修改当前进行中的场次游戏状态
    changeRaceState(toState: RaceState): void {
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        this.raceList[oningRaceNum].state = toState
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
                    userName: item.nick,
                    sky: 0,
                    land: 0,
                    middle: 0,
                    bridg: 0,
                    skyCorner: 0,
                    landCorner: 0,
                    score: 0
                } as BetScore)
            })
        })
        this.raceList = raceList
        cc.log('本地比赛下注数据初始化完毕')
        cc.log(this.raceList)
    }
}

export default new RaceManage