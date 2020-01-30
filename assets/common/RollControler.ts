import { eventBus } from '../common/EventBus'
import { NoticeData, NoticeType, RaceState, EventType, TableLocationType, RaceStateChangeParam, LocalNoticeEventPara, LocalNoticeEventType, roomState, BetNoticeData, gameMemberType, memberState, GameMember, betLocaion, raceResultData } from '../common/Const'
import { randEventId, randFloatNum, mergeRaceResult } from '../common/Util'
import RoomManage from '../store/Room/RoomManage'
import UserManage from '../store/User/UserManage';
import { roomInfo } from '../mock/RoomInfo'
import { RollControlerBase } from './RollControlerBase';
import webSocketManage from '../common/WebSocketManage'
import { GameMemberList } from '../mock/GameMemberList';
import GameMemberManage from '../store/GameMember/GameMemberManage';
import RaceManage from '../store/Races/RaceManage';
import { RaceList } from '../mock/RaceList';
import BetManage from '../store/Bets/BetManage';
import GameMemberItem from '../store/GameMember/GameMemberItem';
import ConfigManage from '../store/Config/ConfigManage';
export class RollControler extends RollControlerBase {
    constructor(cc: any, isEmulatorRoom: boolean) {
        super(cc, isEmulatorRoom)
    }

    public start() {
        this.cc.log('游戏控制器被启动')
        this.initData()
        this.localNoticeEvent()
        this.raceStateChangeEvent()
    }

    raceStateChangeEvent() {
        let eventId = randEventId()
        this.eventIdList.push(eventId)
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, eventId, (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.BET:  //下注
                    if (this.isEmulatorRoom) {
                        this.emulateBet()
                    }
                    break
                case RaceState.FINISHED:  //当场比赛结束
                    if (this.isEmulatorRoom) {
                        this.toStartNextEmulatorRace()
                    }
                    break
            }
        })
    }

    localNoticeEvent() {
        let eventId = randEventId()
        this.eventIdList.push(eventId)
        eventBus.on(EventType.LOCAL_NOTICE_EVENT, eventId, (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.PLAY_BUTTON_EVENT:
                    this.cc.log('start_game_test:我是游戏控制器，我接受到本地事件，游戏开始按钮被点击的通知')
                    this.playButtonExec()
                    break
                case LocalNoticeEventType.DELIVERY_CARD_FINISHED_NOTICE:
                    this.cc.log('响应发牌动画结束通知,将状态改为下注')
                    if (this.isEmulatorRoom) {
                        RaceManage.changeRaceState(RaceState.BET)
                    }
                    break
                case LocalNoticeEventType.LOCAL_BE_LANDLORD_RESULT:
                    this.cc.log('我是游戏控制器，我接受到本地事件，响应是否当地主的通知')
                    this.responseLocalBeLandlordDeal(info.info)
                    break
                case LocalNoticeEventType.LOCAL_BET_CLICK_NOTICE: //本地下注事件
                    if (this.isEmulatorRoom) {
                        let betInfo = info.info as BetNoticeData
                        BetManage.addBet(betInfo.raceNum, betInfo.userId, betInfo.betLocation, betInfo.betVal)
                    } else {
                        let betInfo = info.info as BetNoticeData
                        let notice = { type: NoticeType.raceBet, info: betInfo } as NoticeData
                        webSocketManage.send(JSON.stringify(notice));
                    }
                    break
                case LocalNoticeEventType.LOCAL_TIME_XIAZHU_FINISHED_NOTICE: //本地下注时间已过
                    if (this.isEmulatorRoom) {
                        this.cc.log('我是模拟器，当前下注时间已过，我将比赛状态改为比大小')
                        setTimeout(() => {
                            RaceManage.changeRaceState(RaceState.SHOW_DOWN)
                        }, 2000)
                    }
                    break
            }
        })
    }

    //初始化本地数据
    initData() {
        if (this.isEmulatorRoom) {
            this.cc.log('模拟器初始化本地数据')
            let userInfo = UserManage.userInfo
            RoomManage.setRoomItem(roomInfo)
            RoomManage.roomItem.creatUserId = userInfo.id
            let memeberOwn = {
                userId: '',
                roleType: gameMemberType.MANAGE,
                nick: '',
                icon: '',
                score: 0,
                state: memberState.OnLine
            } as GameMember
            memeberOwn['userId'] = userInfo.id
            memeberOwn['nick'] = userInfo.nick
            memeberOwn['icon'] = userInfo.icon
            GameMemberList.splice(0, 0, memeberOwn)
            let newMembers = [memeberOwn];
            GameMemberList.forEach((item: GameMember) => {
                newMembers.push(item)
            })
            GameMemberManage.setGameMemberList(newMembers)
            RaceManage.setRaceList(RaceList)
        }
    }
}
export default RollControler
