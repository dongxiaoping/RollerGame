import { config } from '../../common/Config'
import { PromiseParam, BetRecord, betLocaion, BetNoticeData, InterfaceUrl, ResponseStatus } from '../../common/Const'
import Betitem from './BetItem';
import axios from 'axios'
class BetManage {
    public betList: Betitem[][] = []

    //用户取消下注
    public cancelBetByLocation(roomId: number, userId: string, raceNum: number, betLocation: betLocaion): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            let httpUrl = config.serverAddress + InterfaceUrl.CANCEL_BET
            axios
            .get(httpUrl, {
                params: {
                    userId: userId,
                    roomId:roomId,
                    raceNum:raceNum,
                    betLocation:betLocation
                }
            })
            .then((response: any): void => {
                let info = response.data
                if(info.status == 0){
                    resolve({ result: ResponseStatus.FAIL, extObject: info })
                    return
                }
                resolve({ result: ResponseStatus.SUCCESS, extObject: '' })
            }).catch(function(e){
                resolve({ result: ResponseStatus.FAIL, extObject: {status:0,message:'net_error',data:''} })
            })
        })
    }

    public clear() {
        this.betList = []
    }

    public cancelBet(info: BetNoticeData) {
        try {
            this.betList[info.raceNum][info.userId][info.betLocation] = 0
        } catch (e) {
            //cc.log(e)
        }
    }

    public getBetByLocation(info: BetNoticeData) {
        try {
            return this.betList[info.raceNum][info.userId][info.betLocation]
        } catch (e) {
            return 0
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