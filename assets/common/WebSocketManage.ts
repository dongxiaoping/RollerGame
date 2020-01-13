import { NoticeInfo, roomState, GameMember, EventType, RaceState, raceResultData, BetNoticeData } from "./Const";
import RoomManage from "../store/Room/RoomManage";
import UserManage from "../store/User/UserManage";
import GameMemberManage from "../store/GameMember/GameMemberManage";
import { eventBus } from "./EventBus";
import RaceManage from "../store/Races/RaceManage";
import BetManage from "../store/Bets/BetManage";
import { config } from "./Config";

class WebSocketManage {
    public ws: any = null
    public isHasConnected: boolean = false //是否已连接

    public closeWs(): void {
        if (this.ws !== null) {
            this.ws.close()
        }
        this.ws = null
    }

    public openWs(onOpen: any, onClose: any): any {
        if (this.ws === null) {
            this.ws = new WebSocket(config.websocketAddress)
            this.ws.onmessage = this.onmessage
            this.ws.onopen = () => {
                cc.log('socket连接成功')
                onOpen()
                this.isHasConnected = true
            }
            this.ws.onclose = () => {
                cc.log('socket关闭')
                this.isHasConnected = false
                onClose()
                this.ws = null
            }
            cc.log('开启socket连接')
            return true
        }
        return false //表示已经开启,调用失败
    }

    public hasConnected(): boolean {
        return this.isHasConnected
    }

    send(message: string): void {
        if (this.ws !== null && this.isHasConnected) {
            this.ws.send(message)
        }
    }

    //每个状态都带比赛房间号以及当前场次，一旦发现场次不匹配，立即执行恢复同步动作
    private onmessage(e: any): void {
        var info = JSON.parse(e.data)
        var type = info.type
        var message = info.info
        console.log(JSON.stringify(info));
        switch (type) {
            case 'gameBegin':
                message as NoticeInfo
                console.log('socket收到游戏开始通知,我将房间状态设置为开始，并且扣除房间费用');
                RoomManage.roomItem.roomState = roomState.PLAYING
                UserManage.costDiamondInRoom(RoomManage.roomItem.id, UserManage.userInfo.id)
                break;
            case 'newMemberInRoom':
                message as GameMember
                console.log('socket收到有新成员加入房间通知');
                GameMemberManage.addGameMember(message)
                if (message.userId === RoomManage.roomItem.creatUserId) {
                    eventBus.emit(EventType.SOCKET_CREAT_ROOM_SUCCESS, null)
                }
                break;
            case 'raceStateChoiceLandlord': //接收选地主通知
                message as NoticeInfo
                console.log('start_game_test:socket收到游戏选地主通知,我将比赛状态设置为选地主,当前比赛场次:' + RoomManage.roomItem.oningRaceNum);
                RaceManage.changeRaceState(RaceState.CHOICE_LANDLORD)
                break;
            case 'raceStateDeal':
                message as NoticeInfo
                let landlordId = message.landlordId
                let theRaceNum = message.raceNum
                RoomManage.roomItem.changeOningRaceNum(theRaceNum)
                RaceManage.changeRaceLandlord(landlordId, 1, theRaceNum)
                RaceManage.changeRaceState(RaceState.DEAL)
                console.log('发牌');
                break;
            case 'raceStateBet':
                message as NoticeInfo
                RaceManage.changeRaceState(RaceState.BET)
                console.log('下注');
                break;
            case 'raceStateShowDown':
                message as NoticeInfo
                let raceNum = message.raceNum
                let resultList = message.resultList as raceResultData[]
                RaceManage.raceList[raceNum].setRaceResultList(resultList)
                RaceManage.changeRaceState(RaceState.SHOW_DOWN)
                console.log('比大小，包括开牌，播报牌位的胜负关系');
                break;
            case 'betNotice': //下注通知  //TODO 如果人物在本地没找到怎么办
                let message1 = message as BetNoticeData
                BetManage.addBet(message1.raceNum, message1.userId, message1.betLocation, message1.betVal)
                console.log('下注接收通知');
                break;
            case 'memberOffLine': //有成员从socket房间中退出
                message as NoticeInfo
                let userId = message.userId
                console.log('有成员从socket房间中退出,用户Id' + userId);
                break;
            case 'allRaceFinished': //所有游戏结束
                let roomResult = message.roomResult as raceResultData[]
                console.log('所有游戏执行完毕,设置房间比赛结果');
                RaceManage.setGameOverResultList(roomResult)
                RoomManage.roomItem.roomState = roomState.ALL_RACE_FINISHED
                break;
            case 'cancelBetSuccessNotice': //删除下注成功通知
                message as BetNoticeData
                BetManage.cancelBet(message)
                break;
            case 'memberOutRoom': //用户退出房间
                GameMemberManage.outGameMember(message.user_id)
                console.log('用户退出房间，用户：' + message.user_id)
                break;
        }
    }
}
export default new WebSocketManage()