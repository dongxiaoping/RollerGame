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
        this.enterSocketRoom()
    }

    public enterSocketRoom() {
        if (RoomManage.roomItem.roomState === roomState.OPEN) {
            let notice = {
                type: NoticeType.enterRoom, info: {
                    roomId: RoomManage.roomItem.id,
                    userId: UserManage.userInfo.id
                }
            } as NoticeData
            webSocketManage.send(JSON.stringify(notice));
            cc.log('我是玩家，我向服务器发起进入socket房间的websocket通知')
        }else{
            cc.log('房间已开始，无法进入')
        }
    }

    //添加事件接受
    eventReceive() {
        //比赛流程状态改变通知
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, randEventId(), (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.SHOW_DOWN:
                    cc.log('我是游戏控制器，我接受到比赛事件，状态改为比大小的通知')
                    this.toShowMjResult()
                    break
                case RaceState.BET:
                    cc.log('我是游戏控制器，我接受到比赛事件，状态改为下注的通知')
                    break
                case RaceState.FINISHED:
                    cc.log('我是游戏控制器，我接受到比赛事件，状态改为比赛结束的通知')
                    this.dealtheRaceFinished() //将当前进行中的游戏改为下场
                    break
            }
        })

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
                case LocalNoticeEventType.ROLL_DICE_FINISHED_NOTICE:
                    cc.log('我是游戏控制器，我接受到本地事件，摇色子动画结束的通知')

                    break
                case LocalNoticeEventType.DELIVERY_CARD_FINISHED_NOTICE:
                    cc.log('我是游戏控制器，我接受到本地事件，发牌动画结束的通知')

                    break
                case LocalNoticeEventType.LOCAL_TIME_XIAZHU_FINISHED_NOTICE:
                    cc.log('我是游戏控制器，我接受到本地事件，下注时间结束的通知')
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

    public dealtheRaceFinished() {
        cc.log('我是游戏控制器，我将进行中的比赛改为下一场')
        let nextOningRaceNum = RoomManage.roomItem.oningRaceNum + 1
        if (nextOningRaceNum >= RoomManage.roomItem.playCount) {
            cc.log('所有比赛结束')
            return
        }
        RoomManage.roomItem.changeOningRaceNum(nextOningRaceNum)
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

    //显示结果麻将结果通知
    toShowMjResult(): void {
        cc.log('发出翻牌通知')
        eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
            type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE,
            info: TableLocationType.LANDLORD
        } as LocalNoticeEventPara)
    }
}
export default RollControler
