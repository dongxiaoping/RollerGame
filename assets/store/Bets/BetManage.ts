const { ccclass } = cc._decorator;
import { config } from '../../common/Config'
import { appMode, PromiseParam, PromiseResult, BetRecord, GameMember, betLocaion, BetScore } from '../../common/Const'
import { BetList } from '../../mock/BetList'
import Betitem from './BetItem';
@ccclass
class BetManage {
    betList: Betitem[][]= [] //场次+用户Id 信息集合

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
                list[j][memberList[i].userId] = new Betitem(item)
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
                 //   this.betList.push(new BetItem(item))
                })
            } else {
            }
            resolve({ result: PromiseResult.SUCCESS, extObject: this.betList })
        })
    }

    addBet(oningRaceNum: number, userId: string, location: betLocaion, val: number) {
        if(typeof(this.betList[oningRaceNum])==='undefined'){
            this.betList[oningRaceNum] = [];
        }
        if(typeof(this.betList[oningRaceNum][userId])==='undefined'){
            let item =   {
                userId: userId,
                sky: 0,
                land: 0,
                middle: 0,
                bridg: 0,
                skyCorner: 0,
                landCorner: 0,
            } as BetRecord
            this.betList[oningRaceNum][userId] = new Betitem(item)
        }
        this.betList[oningRaceNum][userId][location] = val
    }
}

export default new BetManage