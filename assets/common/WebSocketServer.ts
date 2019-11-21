const { ccclass, property } = cc._decorator;
let ws: any = new WebSocket("ws://127.0.0.1:2346");

let raceStatusDefine = {
    "NOT_BEGIN": 1, "CHOICE_LANDLORD": 2, "ROLL_DICE": 3,
    "DEAL": 4, "BET": 5, "SHOW_DOWN": 6, "SHOW_RESULT": 7, "FINISHED": 8
};
let enterRoom = { type: 'enterRoom', info: { roomId: 2234 } };//进入房间事件
let startRoomGame = { type: 'startRoomGame', info: { roomId: 2234, raceCount: 4 } }; //房间开始game raceCount 场次
let landlordSelected = { type: 'landlordSelected', info: { roomId: 2234, raceNum: 0, landlordId: 4 } }; //用户抢地主

ws.onopen = () => {
    ws.send(JSON.stringify(enterRoom));
    ws.send(JSON.stringify(startRoomGame));
    setTimeout(() => {
        ws.send(JSON.stringify(landlordSelected));
    }, 5000);
}

ws.onmessage = (e: any): void => {
    var info = JSON.parse(e.data)
    var type = info.type
    var message = info.info
    console.log(JSON.stringify(info));
    switch (type) {
        case 'choiceLandlord':
            console.log('选地主');
            break;
        case 'rollDice':
            console.log('摇色子');
            break;
        case 'deal':
            console.log('发牌');
            break;
        case 'bet':
            console.log('下注');
            break;
        case 'showDown':
            console.log('比大小');
            break;
        case 'showResult':
            console.log('显示结果');
            break;
        case 'finished':
            console.log('本场比赛结束');
            break;
    }
}

export default ws