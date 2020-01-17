import { config } from '../../common/Config'
import RoomItem from './RoomItem'
import { InterfaceUrl, PromiseParam, PromiseResult, RoomInfo, CreateRoomPayModel, ResponseData, ResponseStatus, raceRecord, GameMember, EnterRoomParam, EnterRoomFail, CreateRoomFail } from '../../common/Const'
import http from '../../common/Http'
import RaceManage from '../Races/RaceManage';
import GameMemberManage from '../GameMember/GameMemberManage';
import BetManage from '../Bets/BetManage';
class RoomManage {
    public roomItem: RoomItem = null
    private enterRoomParam: EnterRoomParam = null //进入房间的传参

    public requestRoomInfo(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            resolve({ result: PromiseResult.SUCCESS, extObject: this.roomItem })
        })
    }

    public reSet() {
        this.roomItem = null
        RaceManage.reSet()
        GameMemberManage.reSet()
        BetManage.reSet()
    }

    public getEnterRoomParam() {
        return this.enterRoomParam
    }

    public setEnterRoomParam(info: EnterRoomParam) {
        this.enterRoomParam = info
    }

    public setRoomItem(theRoomInfo: RoomInfo) {
        this.roomItem = new RoomItem(theRoomInfo)
    }

    //creatUserId 创建者ID、 memberLimit 人员数量限制 ， playCount场次，roomPay 房间费用支付模式， costLimit下注上限
    public createRoom(creatUserId: string, memberLimit: number, playCount: number, roomPay: CreateRoomPayModel, costLimit: number): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            let httpUrl = config.serverAddress + InterfaceUrl.CREATE_ROOM
            let paramString = '?creatUserId=' + creatUserId + '&memberLimit=' + memberLimit +
                '&playCount=' + playCount + '&roomPay=' + roomPay + '&costLimit=' + costLimit
            httpUrl = httpUrl + paramString
            http.getWithUrl(httpUrl, (error: boolean, info: ResponseData) => {
                if (error) {
                    resolve({ result: ResponseStatus.FAIL, extObject: { message: CreateRoomFail.interface_fail } })
                    return
                }
                if (info.status === ResponseStatus.FAIL) { //创建房间失败
                    resolve({ result: ResponseStatus.FAIL, extObject: info })
                    return
                }
                let roomInfo = info.data as RoomInfo
                resolve({ result: ResponseStatus.SUCCESS, extObject: roomInfo })
            })
        })
    }

    public loginRoom(userId: string, rommId: number): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            let httpUrl = config.serverAddress + InterfaceUrl.LOGIN_IN_ROOM + '?userId=' + userId + '&roomId=' + rommId
            http.getWithUrl(httpUrl, (error: boolean, info: ResponseData) => {
                if (error) {
                    resolve({ result: ResponseStatus.FAIL, extObject: { message: EnterRoomFail.interface_fail } })
                    return
                }
                if (info.status === ResponseStatus.FAIL) { //加入房间失败
                    resolve({ result: ResponseStatus.FAIL, extObject: info })
                    return
                }
                let data = info.data;
                let roomInfo = data.room as RoomInfo;

                let races = data.races
                for (let i = 0; i < races.length; i++) {
                    races[i].points = JSON.parse(races[i].points);
                    races[i].landlordScore = JSON.parse(races[i].landlordScore);
                    races[i].skyScore = JSON.parse(races[i].skyScore);
                    races[i].landScore = JSON.parse(races[i].landScore);
                    races[i].middleScore = JSON.parse(races[i].middleScore);
                }
                races as raceRecord[];
                let members = data.members as GameMember[];
                this.setRoomItem(roomInfo);
                RaceManage.setRaceList(races);
                GameMemberManage.setGameMemberList(members);
                resolve({ result: ResponseStatus.SUCCESS, extObject: info })
            })
        })
    }

    public isRoomExist(rommId: number): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            let httpUrl = config.serverAddress + InterfaceUrl.IS_ROOM_EXIST + '?roomId=' + rommId
            http.getWithUrl(httpUrl, (error: boolean, info: ResponseData) => {
                if (error) {
                    resolve({ result: ResponseStatus.FAIL, extObject: { message: EnterRoomFail.interface_fail } })
                    return
                }
                if (info.status === ResponseStatus.FAIL) {
                    resolve({ result: ResponseStatus.FAIL, extObject: info })
                    return
                }
                resolve({ result: ResponseStatus.SUCCESS, extObject: info })
            })
        })
    }

}

export default new RoomManage()