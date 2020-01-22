import { eventBus } from '../common/EventBus'
import { NoticeData, NoticeType, RaceState, EventType, TableLocationType, RaceStateChangeParam, LocalNoticeEventPara, LocalNoticeEventType, roomState, BetNoticeData } from '../common/Const'
import { randEventId } from '../common/Util'
import RoomManage from '../store/Room/RoomManage'
import UserManage from '../store/User/UserManage';
import { RollControlerBase } from './RollControlerBase';
import webSocketManage from '../common/WebSocketManage'
export class RollControler extends RollControlerBase {
    public start() {
        cc.log('游戏控制器被启动')
        this.eventReceive()
    }

    public enterSocketRoom() {
        if (RoomManage.roomItem.roomState !== roomState.CLOSE) {
            let notice = {
                type: NoticeType.enterRoom, info: {
                    roomId: RoomManage.roomItem.id,
                    userId: UserManage.userInfo.id
                }
            } as NoticeData
            webSocketManage.send(JSON.stringify(notice));
            cc.log('我是玩家，我向服务器发起进入socket房间的websocket通知')
        }else{
            cc.log('房间已关闭，无法进入')
        }
    }

    //添加事件接受
    eventReceive() {
        //本地事件通知
        eventBus.on(EventType.LOCAL_NOTICE_EVENT, randEventId(), (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.PLAY_BUTTON_EVENT:
                    cc.log('start_game_test:我是游戏控制器，我接受到本地事件，游戏开始按钮被点击的通知')
                    this.noticeSocketToBeginGame()
                    break
                case LocalNoticeEventType.LOCAL_BE_LANDLORD_RESULT:
                    cc.log('我是游戏控制器，我接受到本地事件，响应是否当地主的通知')
                    this.responseLocalBeLandlordDeal(info.info)
                    break
                case LocalNoticeEventType.LOCAL_BET_CLICK_NOTICE: //本地下注事件
                    let betInfo = info.info as BetNoticeData
                    let notice = { type: NoticeType.raceBet, info: betInfo } as NoticeData
                    webSocketManage.send(JSON.stringify(notice));
                    break
            }
        })
    }
    public noticeSocketToBeginGame() {
        let startRoomGame = {
            type: NoticeType.startRoomGame, info: {
                roomId: RoomManage.roomItem.id,
                userId: UserManage.userInfo.id
            }
        } as NoticeData
        webSocketManage.send(JSON.stringify(startRoomGame));
        cc.log('start_game_test:我是游戏控制器，我向服务器发起游戏开始的websocket通知')
        cc.log('start_game_test:' + JSON.stringify(startRoomGame))
    }

    responseLocalBeLandlordDeal(wantLandlord: boolean) {
        let userId = UserManage.userInfo.id
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        if (wantLandlord) {
            let notice = {
                type: NoticeType.landlordSelected, info: {
                    roomId: RoomManage.roomItem.id,
                    raceNum: oningRaceNum,
                    landlordId: userId
                }
            } as NoticeData
            webSocketManage.send(JSON.stringify(notice));
            cc.log('我是游戏控制器，我向服务器发起抢地主通知')
        }
    }
}
export default RollControler
