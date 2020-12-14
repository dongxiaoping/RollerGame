import {
    NoticeInfo, roomState, GameMember, EventType, RaceState, raceResultData, BetNoticeData, LocalNoticeEventType,
    memberState, gameMemberType, CartonMessage, ChatMessageType, ConsoleType, LocalNoticeEventPara, voiceNotice
} from "./Const";
import RoomManage from "../store/Room/RoomManage";
import UserManage from "../store/User/UserManage";
import GameMemberManage from "../store/GameMember/GameMemberManage";
import { eventBus } from "./EventBus";
import RaceManage from "../store/Races/RaceManage";
import BetManage from "../store/Bets/BetManage";
import { config } from "./Config";
import ConfigManage from "../store/Config/ConfigManage";
import log from 'loglevel'
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
        log.info('接收到socket通知', info)
        switch (type) {
            case 'memberInSocketRoom':
                message as GameMember
                log.info('接收到有成员进入房间通知')
                if(message.roleType == gameMemberType.LIMIT || message.state == memberState.KickOut){
                    log.error('被限制进入用户或者被踢出用户，不能进入')
                    return
                }else if(message.roleType == gameMemberType.VISITOR){
                    log.info('游客进入')
                }else {
                    log.info('玩家进入')
                    GameMemberManage.addGameMember(message)
                    if (message.userId == UserManage.userInfo.id && RoomManage.roomItem.creatUserId == message.userId && RoomManage.roomItem.roomState == roomState.OPEN) {
                        log.info('房主在房间还没开始的情况下进入房间，本地通知显示开始按钮')
                        eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                            type: LocalNoticeEventType.TO_SHOW_START_BUTTON,
                            info: null
                        })
                    }
                }
                break;
            case 'memberOutRoom':
                message = message.data
                //Log.i([ConsoleType.SOCKET, ConsoleType.SOCKET_GET], "WebSocketManage/onmessage",['接到有成员退出通知',message])
                if (RoomManage.roomItem.creatUserId != message.userId && RoomManage.roomItem.roomState == roomState.OPEN) {
                    GameMemberManage.outGameMember(message.userId)
                } else {
                    //状态改为离线
                    // Log.i([ConsoleType.SOCKET, ConsoleType.SOCKET_GET], "WebSocketManage/onmessage",['游戏中，改为离线状态'])
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
            case 'raceStateShowDown': //TODO这个地方不清晰
                message as NoticeInfo
                RoomManage.roomItem.changeOningRaceNum(message.raceNum)
                RaceManage.changeRaceLandlord(message.landlordId, 1, message.raceNum)
                let raceResult = message.raceResult as raceResultData[]
                setTimeout(() => {
                    eventBus.emit(EventType.USER_SCORE_NOTICE, message.roomResult) //这个地方有问题，这个地方是，修改总的数据
                    //   Log.i([ConsoleType.SOCKET, ConsoleType.SOCKET_GET, ConsoleType.RACE_SCORE], "WebSocketManage/onmessage",
                    //   ['同步服务器上用户当前总的得分数到本地',message.roomResult])
                }, (ConfigManage.getShowDownTime() + 1) * 1000)
                RaceManage.raceList[message.raceNum].setRaceResultList(raceResult)//这个地方是同步当前场次本地和服务器的用户得分数据
                //  Log.i([ConsoleType.SOCKET, ConsoleType.SOCKET_GET, ConsoleType.RACE_SCORE], "WebSocketManage/onmessage",
                //  ['同步服务器上用户当前场次的得分数到本地',raceResult])
                RaceManage.changeRaceState(RaceState.SHOW_DOWN)
                //console.log('比大小，包括开牌，播报牌位的胜负关系');
                break;
            case 'betNotice': //下注通知 值为负数表示取消下注
                message as BetNoticeData
                if (message.betVal < 0) { //表示取消下注
                    let betVal = message.betVal
                    BetManage.cancelBet(message)
                    if (message.userId == UserManage.userInfo.id) {
                        let xiaZhuVal = RaceManage.getClickXiaZhuVal()
                        RaceManage.setClickXiaZhuVal(xiaZhuVal + betVal)
                    }
                } else {
                    BetManage.addBet(message.raceNum, message.userId, message.betLocation, message.betVal)
                }
                //console.log('下注接收通知');
                break;
            case 'allRaceFinished': //所有游戏结束
                roomResult = message.roomResult as raceResultData[]
                //console.log('所有游戏执行完毕,设置房间比赛结果');
                RaceManage.setGameOverResultList(roomResult)
                RoomManage.roomItem.roomState = roomState.CLOSE
                break;
            case 'chatCartonMessage': //动画消息信息
                message as CartonMessage
                eventBus.emit(EventType.CARTON_MESSAGE_NOTICE, message)
                break;
            case 'memberWaitForLandlord': //用户选择当庄
                let setInfo = { userId: message.userId, type: ChatMessageType.QIANG_ZHUANG, message: 0 } as CartonMessage
                // console.log('接收到用户抢庄通知：'+JSON.stringify(setInfo))
                eventBus.emit(EventType.CARTON_MESSAGE_NOTICE, setInfo)
                break;
            case 'checkRoomMember': //房间游戏启动前的成员核对
                message as GameMember[]
                GameMemberManage.checkRoomMember(message);
                break;
            case 'audioPlayNotice': //语音
                message as voiceNotice
                console.log('接受到语音通知')
                console.log(message)
                eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                    type: LocalNoticeEventType.PLAY_AUDIO_LOCAL_NOTICE, info: message
                } as LocalNoticeEventPara)
                break;
        }
    }
}
export default new WebSocketManage()