const { ccclass } = cc._decorator;
import { config } from '../../common/Config'
import RaceItem from './RaceItem'
import { appMode, PromiseParam, PromiseResult, raceRecord, RaceState, betLocaion, raceResultData, CompareDxRe } from '../../common/Const'
import { RaceList } from '../../mock/RaceList'
import RoomManage from '../../store/Room/RoomManage'
import axios from 'axios'
import BetManage from '../Bets/BetManage';
import Betitem from '../Bets/BetItem';
@ccclass
class RaceManage {
    public raceList: RaceItem[] = []
    public gameOverResultList: raceResultData[] //所有场次比赛的结果统计

    setRaceList(list: raceRecord[]) {
        list.forEach((item: raceRecord): void => {
            this.raceList[item.raceNum] = new RaceItem(item)
        })
    }

    setGameOverResultList(list: raceResultData[]) {
        this.gameOverResultList = list
    }

    /*在本地计算指定场次、指定用户的比赛得分
     *@raceNum 比赛场次
     *@userId 用户ID
    */
    getUserTheRaceScore(raceNum: number, userId: string) {
        let score = 0
        let raceItem = this.raceList[raceNum]
        if (userId === this.raceList[raceNum].landlordId) {
            BetManage.betList[raceNum].forEach((item: Betitem) => {
                score -= item.getScore(raceItem.skyResult, raceItem.middleResult, raceItem.landResult,
                    raceItem.skyCornerResult, raceItem.bridgResult, raceItem.landCornerResult)
            })
            return score
        }
        if (typeof (BetManage.betList[raceNum][userId]) === 'undefined') {
            return score
        }
        let userBetitem = BetManage.betList[raceNum][userId] as Betitem
        return userBetitem.getScore(raceItem.skyResult, raceItem.middleResult, raceItem.landResult,
            raceItem.skyCornerResult, raceItem.bridgResult, raceItem.landCornerResult)
    }

    public requestRaceList(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (this.raceList.length > 0) {
                resolve({ result: PromiseResult.SUCCESS, extObject: this.raceList })
                return
            }
            if (config.appMode === appMode.LOCAL_TEST) {
                this.setRaceList(RaceList)
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

    //说明
    changeRaceLandlord(landlordId: string, landlordLastCount: number, fromRaceNum: number): void {
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        if (fromRaceNum !== oningRaceNum) {
            cc.log('错误,下发的抢庄当前场次和本地当前场次不一致')
            return
        }
        let totalCount = RoomManage.roomItem.playCount
        this.raceList[oningRaceNum].landlordId = landlordId
        for (let i = 1; i < landlordLastCount; i++) {
            if (oningRaceNum + i < totalCount) {
                this.raceList[oningRaceNum + i].setLandlordIdWithoutNotice(landlordId)
            }
        }
    }

}

export default new RaceManage