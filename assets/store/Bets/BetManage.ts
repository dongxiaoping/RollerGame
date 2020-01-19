import { config } from '../../common/Config'
import { PromiseParam, PromiseResult, BetRecord, betLocaion, BetNoticeData, InterfaceUrl } from '../../common/Const'
import Betitem from './BetItem';
import http from '../../common/Http'
class BetManage {
    public betList: Betitem[][] = []

    //用户取消下注
    public cancelBetByLocation(roomId: number, userId: string, raceNum: number, betLocation: betLocaion): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            let httpUrl = config.serverAddress + InterfaceUrl.CANCEL_BET + '?userId=' + userId + '&roomId=' + roomId + '&raceNum=' + raceNum + '&betLocation=' + betLocation
            http.getWithUrl(httpUrl, (status: boolean, info: any) => {
                resolve({ result: PromiseResult.SUCCESS, extObject: '' })
            })
        })
    }

    public reSet() {
        this.betList = []
    }

    public cancelBet(info: BetNoticeData) {
        let partLocation = info.betLocation
        let userId = info.userId
        let onRaceNum = info.raceNum
        try {
            this.betList[onRaceNum][userId][partLocation] = 0
        } catch (e) {
            cc.log(e)
        }
    }

    public setBetList(betlist: BetRecord[]) {
        let list = []
        betlist.forEach((item: BetRecord): void => {
            if (typeof (list[item.raceNum]) === 'undefined') {
                list[item.raceNum] = []
            }
            list[item.raceNum][item.userId] = new Betitem(item)
        })
        this.betList = list
    }

    addBet(oningRaceNum: number, userId: string, location: betLocaion, val: number) {
        if (typeof (this.betList[oningRaceNum]) === 'undefined') {
            this.betList[oningRaceNum] = [];
        }
        if (typeof (this.betList[oningRaceNum][userId]) === 'undefined') {
            let item = {
                userId: userId,
                raceNum: oningRaceNum,
                sky: 0,
                land: 0,
                middle: 0,
                bridg: 0,
                skyCorner: 0,
                landCorner: 0,
            } as BetRecord
            this.betList[oningRaceNum][userId] = new Betitem(item)
        }
        this.betList[oningRaceNum][userId][location] = this.betList[oningRaceNum][userId][location] + val
    }
}

export default new BetManage