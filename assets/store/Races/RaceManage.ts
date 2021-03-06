import RaceItem from './RaceItem'
import { PromiseParam, PromiseResult, raceRecord, RaceState, betLocaion, raceResultData, CompareDxRe } from '../../common/Const'
import RoomManage from '../../store/Room/RoomManage'
import BetManage from '../Bets/BetManage';
import Betitem from '../Bets/BetItem';
import GameMemberManage from '../GameMember/GameMemberManage';
import { getMemeberResultScoreList } from '../../common/Util';
class RaceManage {
    public raceList: RaceItem[] = []
    public gameOverResultList: raceResultData[] //所有场次比赛的结果统计
    private clickXiaZhuVal: number = 0 //当前用户当前场次总下注值

    setRaceList(list: raceRecord[]) {
        list.forEach((item: raceRecord): void => {
            this.raceList[item.raceNum] = new RaceItem(item)
        })
    }

    public clear() {
        this.raceList = []
        this.gameOverResultList = null
    }

    getClickXiaZhuVal(): number {
        return this.clickXiaZhuVal
    }

    setClickXiaZhuVal(val: number) {
        this.clickXiaZhuVal = val
    }

    setGameOverResultList(list: raceResultData[]) {
        this.gameOverResultList = getMemeberResultScoreList(list, GameMemberManage.gameMenmberList)
    }

    /*在本地计算指定场次、指定用户的比赛得分
     *@raceNum 比赛场次
     *@userId 用户ID
    */
    getUserTheRaceScore(raceNum: number, userId: string) {
        let score = 0
        let raceItem = this.raceList[raceNum]
        if (userId === this.raceList[raceNum].landlordId) {
            if (typeof (BetManage.betList[raceNum]) === 'undefined') {
                return score
            }
            BetManage.betList[raceNum].forEach((item: Betitem) => {
                score -= item.getScore(raceItem.skyResult, raceItem.middleResult, raceItem.landResult,
                    raceItem.skyCornerResult, raceItem.bridgResult, raceItem.landCornerResult)
            })
            return score
        }
        if (typeof (BetManage.betList[raceNum]) === 'undefined' ||
            typeof (BetManage.betList[raceNum][userId]) === 'undefined') {
            return score
        }
        let userBetitem = BetManage.betList[raceNum][userId] as Betitem
        return userBetitem.getScore(raceItem.skyResult, raceItem.middleResult, raceItem.landResult,
            raceItem.skyCornerResult, raceItem.bridgResult, raceItem.landCornerResult)
    }

    //通过本地下注信息获取用户比赛分数，下注进行中的直接做减法
    getUserScore(userId: string) {
        let score = 0
        let i = 0
        for (; i <= RoomManage.roomItem.oningRaceNum; i++) {
            if (this.raceList[i].state == RaceState.BET) {
                if (typeof (BetManage.betList[i]) != 'undefined' &&
                    typeof (BetManage.betList[i][userId]) != 'undefined') {
                    score -= BetManage.betList[i][userId].getXiaZhuVal()
                }
            } else {
                score += this.getUserTheRaceScore(i, userId)
            }
        }
        return score
    }


    public requestRaceList(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
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
        let i = 0
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        while (i < landlordLastCount) {
            if (typeof (this.raceList[fromRaceNum + i]) != 'undefined') {
                this.raceList[fromRaceNum + i].setLandlordId(landlordId, oningRaceNum)
            }
            i++
        }
    }

}

export default new RaceManage