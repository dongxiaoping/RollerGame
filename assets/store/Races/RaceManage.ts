const { ccclass } = cc._decorator;
import { config } from '../../common/Config'
import RaceItem from './RaceItem'
import { appMode, PromiseParam, PromiseResult, raceRecord, BetScore, RaceState, betLocaion } from '../../common/Const'
import { RaceList } from '../../mock/RaceList'
import GameMemberManage from '../GameMember/GameMemberManage'
import GameMemberItem from '../GameMember/GameMemberItem'
import RoomManage from '../../store/Room/RoomManage'
import axios from 'axios'
import { randFloatNum } from '../../common/Util';
import BetManage from '../Bets/BetManage';
@ccclass
class RaceManage {
    public raceList: RaceItem[] = []

    //通过用户id获取该用户全场比赛的分数合
    getScoreByUserId(userId: string): number {
        let score: number = 0
        this.raceList.forEach((item: RaceItem) => {
           // score = score + item.betInfo[userId].score
        })
        return score
    }

    setRaceList(list: raceRecord[]) {
        list.forEach((item: raceRecord): void => {
            this.raceList[item.raceNum] = new RaceItem(item)
        })
    }

    //模拟对指定用户进行下注
    emulateXiaZhuByUser(userId: string): void {
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        if (this.raceList[oningRaceNum].state !== RaceState.BET) {
            cc.log('当前不是下注状态，不能下注')
            return
        }
        let ranTime = randFloatNum(1, config.localXiaZhuLimiTime - 1)
        setTimeout(() => {
           BetManage.addBet(oningRaceNum,userId,betLocaion.LAND_CORNER,10)
        }, ranTime * 1000)
        ranTime = randFloatNum(1, config.localXiaZhuLimiTime - 1)
        setTimeout(() => {
            BetManage.addBet(oningRaceNum,userId,betLocaion.SKY,20)
        }, ranTime * 1000)
        ranTime = randFloatNum(1, config.localXiaZhuLimiTime - 1)
        setTimeout(() => {
            BetManage.addBet(oningRaceNum,userId,betLocaion.BRIDG,20)
        }, ranTime * 1000)
        ranTime = randFloatNum(1, config.localXiaZhuLimiTime - 1)
        setTimeout(() => {
            BetManage.addBet(oningRaceNum,userId,betLocaion.LAND,50)
        }, ranTime * 1000)
        ranTime = randFloatNum(1, config.localXiaZhuLimiTime - 1)
        setTimeout(() => {
            BetManage.addBet(oningRaceNum,userId,betLocaion.MIDDLE,100)
        }, ranTime * 1000)
        ranTime = randFloatNum(1, config.localXiaZhuLimiTime - 1)
        setTimeout(() => {
            BetManage.addBet(oningRaceNum,userId,betLocaion.SKY_CORNER,100)
        }, ranTime * 1000)
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

    changeRaceLandlord(landlordId: string): void {
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        this.raceList[oningRaceNum].landlordId = landlordId
    }

}

export default new RaceManage