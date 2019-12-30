import RoomManage from "../store/Room/RoomManage";
import { roomState, RaceState, GameMember, BetNoticeData, raceResultData, EventType } from "./Const";
import RaceManage from "../store/Races/RaceManage";
import GameMemberManage from "../store/GameMember/GameMemberManage";
import BetManage from "../store/Bets/BetManage";
import { config } from "./Config";
import { eventBus } from "./EventBus";
import UserManage from "../store/User/UserManage";

export let ws: any = null
export interface NoticeData {
    type: NoticeType
    info: NoticeInfo
}

export function closeWs() {
    if (ws !== null) {
        ws.close()
        cc.log('关闭socket连接')
    }
    ws = null
}

//开启一个新socket，并返回，已存在返回false
export function onOpenWs() {
    if (ws === null) {
        ws = new WebSocket(config.websocketAddress)
      //  ws.onopen = onopen
        ws.onmessage = onmessage
        cc.log('开启socket连接')
        return ws
    }
    return false //表示已经开启,调用失败
}

///////////////////////////////////
export interface NoticeInfo {
    roomId?: number
    raceNum?: number //当前是第几局
    raceCount?: number //房间比赛有几场
    landlordId?: string //当前局的地主ID
    landlordLastCount?: number //一次选中坐庄持续的场次数
    userId?: string
}

export enum NoticeType {
    startRoomGame = 'startRoomGame', //开始房间的比赛 房主调用
    landlordSelected = 'landlordSelected', //玩家选择当地主通知
    enterRoom = 'enterRoom', //普通玩家进入房间
    outRoom = 'outRoom', //玩家退出socket的房间，如果房间比赛未开始，同时也会退出数据库中的房间
    raceBet = 'raceBet', //玩家下注通知
    cancelRaceBet = 'cancelRaceBet' //取消指定区域的下注

}

let raceStatusDefine = {
    "NOT_BEGIN": 1, "CHOICE_LANDLORD": 2, "ROLL_DICE": 3,
    "DEAL": 4, "BET": 5, "SHOW_DOWN": 6, "SHOW_RESULT": 7, "FINISHED": 8
};
let enterRoom = { type: 'enterRoom', info: { roomId: 2234 } };//进入房间事件
let startRoomGame = { type: 'startRoomGame', info: { roomId: 2234 } };
let landlordSelected = { type: 'landlordSelected', info: { roomId: 2234, raceNum: 0, landlordId: 4 } }; //用户抢地主
function onopen() {
    // ws.send(JSON.stringify(enterRoom));
    // ws.send(JSON.stringify(startRoomGame));
    // setTimeout(() => {
    //     ws.send(JSON.stringify(landlordSelected));
    // }, 5000);
}

function onmessage(e: any): void {
    var info = JSON.parse(e.data)
    var type = info.type
    var message = info.info
    console.log(JSON.stringify(info));
    switch (type) {
        case 'gameBegin':
            message as NoticeInfo
            console.log('socket收到游戏开始通知,我将游戏状态设置为开始');
            RoomManage.roomItem.roomState = roomState.PLAYING
            UserManage.costDiamondInRoom(RoomManage.roomItem.id, UserManage.userInfo.id)
            break;
        case 'newMemberInRoom':
            message as GameMember
            console.log('socket收到有新成员加入房间通知');
            GameMemberManage.addGameMember(message)
            if(message.userId === RoomManage.roomItem.creatUserId){
                eventBus.emit(EventType.SOCKET_CREAT_ROOM_SUCCESS, null)
            }
            break;
        case 'raceStateChoiceLandlord': //接收选地主通知
            message as NoticeInfo
            console.log('start_game_test:socket收到游戏选地主通知,我将比赛状态设置为选地主,当前比赛场次:' + RoomManage.roomItem.oningRaceNum);
            RaceManage.changeRaceState(RaceState.CHOICE_LANDLORD)
            break;
        case 'landlordSelected': //接收地主被选中通知
            message as NoticeInfo
            let landlordLastCount = message.landlordLastCount
            let fromRaceNum = message.raceNum
            let landlordId = typeof message.landlordId ? message.landlordId : null
            RaceManage.changeRaceLandlord(landlordId, landlordLastCount, fromRaceNum)
            console.log('socket收到游戏地主被选中通知');
            break;
        case 'raceStateRollDice':
            message as NoticeInfo
            RaceManage.changeRaceState(RaceState.ROLL_DICE)
            console.log('摇色子');
            break;
        case 'raceStateDeal':
            message as NoticeInfo
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
            RaceManage.changeRaceState(RaceState.SHOW_DOWN)
            console.log('比大小');
            break;
        case 'raceStateShowResult':
            let resultList = message.resultList as raceResultData[]
            let raceNum = message.raceNum
            RaceManage.raceList[raceNum].setRaceResultList(resultList)
            RaceManage.changeRaceState(RaceState.SHOW_RESULT)
            console.log('显示结果');
            break;
        case 'raceStateFinished':
            message as NoticeInfo
            RaceManage.changeRaceState(RaceState.FINISHED)
            console.log('本场比赛结束');
            break;
        case 'betNotice': //下注通知
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
    }
}