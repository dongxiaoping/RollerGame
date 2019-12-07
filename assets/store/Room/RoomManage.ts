import { config } from '../../common/Config'
import RoomItem from './RoomItem'
import { appMode, PromiseParam, PromiseResult, RoomInfo, CreateRoomPayModel, ResponseData, ResponseStatus, raceRecord, GameMember, BetRecord, EnterRoomParam } from '../../common/Const'
import { roomInfo } from '../../mock/RoomInfo'
import axios from 'axios'
import { Ajax } from '../../common/Util';
import RaceManage from '../Races/RaceManage';
import GameMemberManage from '../GameMember/GameMemberManage';
import { RoomGameConfig, roomGameConfig } from '../../common/RoomGameConfig';
import BetManage from '../Bets/BetManage';
class RoomManage {
    public roomItem: RoomItem = null
    private netRoomGameConfig: RoomGameConfig = null //网络下发的配置文件信息
    private enterRoomParam: EnterRoomParam = null //进入房间的传参
    public requestRoomInfo(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (this.roomItem !== null) {
                resolve({ result: PromiseResult.SUCCESS, extObject: this.roomItem })
                return
            }
            if (config.appMode === appMode.LOCAL_TEST) {
                this.setRoomItem(roomInfo)
            } else {

            }
            resolve({ result: PromiseResult.SUCCESS, extObject: this.roomItem })
        })
    }

    public reSet(){
        this.roomItem = null
        this.netRoomGameConfig = null
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

    public setNetRoomGameConfig(info: RoomGameConfig) {
        this.netRoomGameConfig = info
    }

    //摇色子时间
    public getRollDiceTime(): number {
        if (this.netRoomGameConfig !== null) {
            return this.netRoomGameConfig.rollDiceTime - this.netRoomGameConfig.delayTime
        }
        return roomGameConfig.rollDiceTime
    }

    //发牌时间
    public getDealTime(): number {
        if (this.netRoomGameConfig !== null) {
            return this.netRoomGameConfig.dealTime - this.netRoomGameConfig.delayTime
        }
        return roomGameConfig.dealTime
    }

    //下注时间
    public getBetTime(): number {
        if (this.netRoomGameConfig !== null) {
            return this.netRoomGameConfig.betTime - this.netRoomGameConfig.delayTime
        }
        return roomGameConfig.betTime
    }

    //比大小时间
    public getShowDownTime(): number {
        if (this.netRoomGameConfig !== null) {
            return this.netRoomGameConfig.showDownTime - this.netRoomGameConfig.delayTime
        }
        return roomGameConfig.showDownTime
    }

    //显示结果时间
    public getShowResultTime(): number {
        if (this.netRoomGameConfig !== null) {
            return this.netRoomGameConfig.showResultTime - this.netRoomGameConfig.delayTime
        }
        return roomGameConfig.showResultTime
    }

    public setRoomItem(theRoomInfo: RoomInfo) {
        this.roomItem = new RoomItem(theRoomInfo)
    }

    //creatUserId 创建者ID、 memberLimit 人员数量限制 ， playCount场次，roomPay 房间费用支付模式， costLimit下注上限
    public createRoom(creatUserId: string, memberLimit: number, playCount: number, roomPay: CreateRoomPayModel, costLimit: number): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            Ajax({
                method: 'POST',
                url: '/race/room/create_room',
                data: {
                    creatUserId: creatUserId,
                    memberLimit: memberLimit,
                    playCount: playCount,
                    roomPay: roomPay,
                    costLimit: costLimit
                }
            }).then(res => {
                let info = res.data as ResponseData
                resolve({ result: ResponseStatus.SUCCESS, extObject: info.data })
            })
        })
    }

    public loginRoom(userId: string, rommId: number): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {

            let httpUrl = config.serverAddress + '/race/room/login_in_room'
            axios
                .get(httpUrl, {
                    params: {
                        userId: userId,
                        roomId: rommId
                    }
                })
                .then((res: any): void => {
                    let info = res.data as ResponseData
                    if (info.status === ResponseStatus.FAIL) { //加入房间失败
                        resolve({ result: ResponseStatus.FAIL, extObject: '' })
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
                    resolve({ result: ResponseStatus.SUCCESS, extObject: '' })
                })
        })
    }

}

export default new RoomManage()