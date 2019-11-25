import RoomManage from "../store/Room/RoomManage";
import { roomState, RaceState, GameMember, BetNoticeData } from "./Const";
import RaceManage from "../store/Races/RaceManage";
import GameMemberManage from "../store/GameMember/GameMemberManage";
import BetManage from "../store/Bets/BetManage";

const { ccclass, property } = cc._decorator;
export let ws: any = new WebSocket("ws://127.0.0.1:2346");

export interface NoticeData {
    type: NoticeType
    info: NoticeInfo
}

///////////////////////////////////
export interface NoticeInfo {
    roomId?: number
    raceNum?: number //当前是第几局
    raceCount?: number //房间比赛有几场
    landlordId?: string //当前局的地主ID
    userId?: string
}

export enum NoticeType {
    startRoomGame = 'startRoomGame', //开始房间的比赛 房主调用
    createAndEnterRoom = 'createAndEnterRoom', //创建并进入房间，这个只有房主才能调用
    landlordSelected = 'landlordSelected', //玩家选择当地主通知
    enterRoom = 'enterRoom' //普通玩家进入房间
}

let raceStatusDefine = {
    "NOT_BEGIN": 1, "CHOICE_LANDLORD": 2, "ROLL_DICE": 3,
    "DEAL": 4, "BET": 5, "SHOW_DOWN": 6, "SHOW_RESULT": 7, "FINISHED": 8
};
let enterRoom = { type: 'enterRoom', info: { roomId: 2234 } };//进入房间事件
let startRoomGame = { type: 'startRoomGame', info: { roomId: 2234 } };
let landlordSelected = { type: 'landlordSelected', info: { roomId: 2234, raceNum: 0, landlordId: 4 } }; //用户抢地主
let createAndEnterRoom = { type: 'createAndEnterRoom', info: { roomId: 2234, raceCount: 4,userId:4 } };
ws.onopen = () => {
    // ws.send(JSON.stringify(enterRoom));
    // ws.send(JSON.stringify(startRoomGame));
    // setTimeout(() => {
    //     ws.send(JSON.stringify(landlordSelected));
    // }, 5000);
}

ws.onmessage = (e: any): void => {
    var info = JSON.parse(e.data)
    var type = info.type
    var message = info.info
    console.log(JSON.stringify(info));
    let roomId = message.roomId ? message.roomId : null
    let raceNum = message.raceNum ? message.raceNum : null
    let landlordId = message.landlordId ? message.landlordId : null
    switch (type) {
        case 'gameBegin':
            message as NoticeInfo
            console.log('socket收到游戏开始通知,我将游戏状态设置为开始');
            RoomManage.roomItem.roomState = roomState.PLAYING
            break;
        case 'newMemberInRoom':
            message as GameMember
            console.log('socket收到有新成员加入房间通知');
            GameMemberManage.addGameMember(message)
            break;
        case 'raceStateChoiceLandlord': //接收选地主通知
            message as NoticeInfo
            RaceManage.changeRaceState(RaceState.CHOICE_LANDLORD)
            console.log('socket收到游戏选地主通知,我将比赛状态设置为选地主,当前比赛场次:' + RoomManage.roomItem.oningRaceNum);
            break;
        case 'landlordSelected': //接收地主被选中通知
            message as NoticeInfo
            RaceManage.changeRaceLandlord(landlordId)
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
            message as NoticeInfo
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
    }
}