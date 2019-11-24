const { ccclass } = cc._decorator;
import { config } from '../../common/Config'
import RoomItem from './RoomItem'
import { appMode, PromiseParam, PromiseResult, RoomInfo, CreateRoomPayModel, ResponseData, ResponseStatus, raceRecord, GameMember, BetRecord } from '../../common/Const'
import { roomInfo } from '../../mock/RoomInfo'
import axios from 'axios'
import { Ajax } from '../../common/Util';
import RaceManage from '../Races/RaceManage';
import GameMemberManage from '../GameMember/GameMemberManage';
import BetManage from '../Bets/BetManage';
@ccclass
class RoomManage {
    public roomItem: RoomItem = null

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

    setRoomItem(theRoomInfo: RoomInfo) {
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
                    let data = info.data;
                    let roomInfo = data.room as RoomInfo;

                    let races = data.races
                    for(let i=0;i<races.length;i++){
                        races[i].points = JSON.parse(races[i].points);
                        races[i].landlordScore= JSON.parse(races[i].landlordScore);
                        races[i].skyScore= JSON.parse(races[i].skyScore);
                        races[i].landScore= JSON.parse(races[i].landScore);
                        races[i].middleScore= JSON.parse(races[i].middleScore);
                    }
                    races as raceRecord[];

                    let members = data.members as GameMember[];
                    let betRecords =  data.betRecords as BetRecord[];
                    this.setRoomItem(roomInfo);
                    RaceManage.setRaceList(races);
                    GameMemberManage.setGameMemberList(members);
                    //BetManage.setBetList(betRecords);
                    resolve({ result: ResponseStatus.SUCCESS, extObject: '' })
                })
        })
    }

}

export default new RoomManage()