import { NoticeInfo, roomState, GameMember, EventType, RaceState, raceResultData, BetNoticeData, LocalNoticeEventType, memberState, ResponseStatus, CartonMessage, ChatMessageType } from "./Const";
import RoomManage from "../store/Room/RoomManage";
import UserManage from "../store/User/UserManage";
import GameMemberManage from "../store/GameMember/GameMemberManage";
import { eventBus } from "./EventBus";
import RaceManage from "../store/Races/RaceManage";
import BetManage from "../store/Bets/BetManage";
import { config } from "./Config";
import { roomGameConfig } from "./RoomGameConfig";

class WebSocketManage {
    public ws: any = null

    public closeWs(): void {
        if (this.ws !== null) {
            this.ws.close()
        }
        this.ws = null
    }

    public openWs(onOpen: any, onClose: any): any {
        if (this.ws === null) {
            try {
                this.ws = new WebSocket(config.websocketAddress)
                this.ws.onmessage = this.onmessage
                this.ws.onopen = () => {
                    //cc.log('socket连接成功')
                    onOpen()
                }
                this.ws.onclose = () => {
                    //cc.log('socket关闭')
                    onClose()
                    this.ws = null
                }
                //cc.log('开启socket连接')
            } catch (e) {
                //cc.log(e)
            }
            return true
        }
        return false //表示已经开启,调用失败
    }

    send(message: string): void {
        if (this.ws !== null) {
            this.ws.send(message)
        }
    }

    //每个状态都带比赛房间号以及当前场次，一旦发现场次不匹配，立即执行恢复同步动作
    private onmessage(e: any): void {
        let info = JSON.parse(e.data)
        let type = info.type
        let message = info.info
        let roomResult: raceResultData[] = null
        //console.log(JSON.stringify(info));
        switch (type) {
            case 'memberInSocketRoom':
                message as GameMember
                //console.log('socket房间有新成员进入通知');
                GameMemberManage.addGameMember(message)
                if (message.userId == UserManage.userInfo.id && RoomManage.roomItem.creatUserId == message.userId && RoomManage.roomItem.roomState == roomState.OPEN) {
                    //cc.log('房主加入房间')
                    eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                        type: LocalNoticeEventType.TO_SHOW_START_BUTTON,
                        info: null
                    })
                }
                break;
            case 'memberOutSocketRoom':
                //console.log('socket房间有成员退出通知，用户：' + message.userId);
                if (RoomManage.roomItem.creatUserId != message.userId && RoomManage.roomItem.roomState == roomState.OPEN) {
                    GameMemberManage.outGameMember(message.userId)
                } else {
                    //状态改为离线
                    if (typeof (GameMemberManage.gameMenmberList[message.userId]) !== 'undefined') {
                        GameMemberManage.gameMenmberList[message.userId].state = memberState.OffLine
                    }
                }
                break;
            case 'raceStateChoiceLandlord': //接收选地主通知
                message as NoticeInfo
                if (message.raceNum == 0) { //房间开始
                    RoomManage.roomItem.roomState = roomState.PLAYING
                    UserManage.costDiamond(RoomManage.roomItem.id, UserManage.userInfo.id)
                }
                RoomManage.roomItem.changeOningRaceNum(message.raceNum)
                //console.log('start_game_test:socket收到游戏选地主通知,我将比赛状态设置为选地主,当前比赛场次:' + RoomManage.roomItem.oningRaceNum);
                RaceManage.changeRaceState(RaceState.CHOICE_LANDLORD)
                break;
            case 'raceStateDeal':
                message as NoticeInfo
                RoomManage.roomItem.changeOningRaceNum(message.raceNum)
                RaceManage.changeRaceLandlord(message.landlordId, 1, message.raceNum)
                RaceManage.changeRaceState(RaceState.DEAL)
                //console.log('发牌');
                break;
            case 'raceStateBet':
                message as NoticeInfo
                RoomManage.roomItem.changeOningRaceNum(message.raceNum)
                RaceManage.changeRaceLandlord(message.landlordId, 1, message.raceNum)
                RaceManage.changeRaceState(RaceState.BET)
                //console.log('下注');
                break;
            case 'raceStateShowDown':
                message as NoticeInfo
                RoomManage.roomItem.changeOningRaceNum(message.raceNum)
                RaceManage.changeRaceLandlord(message.landlordId, 1, message.raceNum)
                let raceResult = message.raceResult as raceResultData[]
                setTimeout(() => {
                    eventBus.emit(EventType.USER_SCORE_NOTICE, message.roomResult)
                }, (roomGameConfig.showDownTime + 1) * 1000)
                RaceManage.raceList[message.raceNum].setRaceResultList(raceResult)
                RaceManage.changeRaceState(RaceState.SHOW_DOWN)
                //console.log('比大小，包括开牌，播报牌位的胜负关系');
                break;
            case 'betNotice': //下注通知  //TODO 如果人物在本地没找到怎么办
                message as BetNoticeData
                BetManage.addBet(message.raceNum, message.userId, message.betLocation, message.betVal)
                //console.log('下注接收通知');
                break;
            case 'allRaceFinished': //所有游戏结束
                roomResult = message.roomResult as raceResultData[]
                //console.log('所有游戏执行完毕,设置房间比赛结果');
                RaceManage.setGameOverResultList(roomResult)
                RoomManage.roomItem.roomState = roomState.CLOSE
                break;
            case 'cancelBetSuccessNotice': //删除下注成功通知
                message as BetNoticeData
                BetManage.cancelBet(message)
                break;
            case 'chatCartonMessage': //动画消息信息
                message as CartonMessage
                eventBus.emit(EventType.CARTON_MESSAGE_NOTICE, message)
                break;
            case 'memberWaitForLandlord': //用户选择当庄
                let setInfo = { userId: message.userId, type: ChatMessageType.PIC, message: 'EE30' } as CartonMessage
                eventBus.emit(EventType.CARTON_MESSAGE_NOTICE, setInfo)
                break;
        }
    }
}
export default new WebSocketManage()