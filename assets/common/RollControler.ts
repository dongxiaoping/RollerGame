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
import { roomGameConfig } from './RoomGameConfig';
export class RollControler extends RollControlerBase {
    constructor(cc: any, isEmulatorRoom: boolean, roomScene: any) {
        super(cc, isEmulatorRoom, roomScene)
    }

    public start() {
        this.cc.log('游戏控制器被启动')
        this.initData()
        this.localNoticeEvent()
        this.raceStateChangeEvent()
    }

    raceStateChangeEvent() {
        let eventIdOne = randEventId()
        this.eventIdList.push(eventIdOne)
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, eventIdOne, (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.CHOICE_LANDLORD: //选庄
                    this.roomScene.adjustBeforeRaceStateChange(RaceState.CHOICE_LANDLORD)
                    this.roomScene.showChoiceLandLordPanel()
                    break
                case RaceState.DEAL://发牌
                    this.execDealAction()
                    break
                case RaceState.BET:  //下注
                    this.execBetAction()
                    break
                case RaceState.SHOW_DOWN:
                    this.roomScene.adjustBeforeRaceStateChange(RaceState.SHOW_DOWN)
                    this.cc.find('Canvas').getChildByName('DealMachine').getComponent('DealMachine').checkAndAddMajong()
                    eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                        type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE,
                        info: TableLocationType.LANDLORD
                    } as LocalNoticeEventPara)
                    break
                case RaceState.FINISHED:  //当场比赛结束
                    if (this.isEmulatorRoom) {
                        this.toStartNextEmulatorRace()
                    }
                    this.roomScene.adjustBeforeRaceStateChange(RaceState.FINISHED)
                    break
            }
        })

        let eventIdTwo = randEventId()
        this.eventIdList.push(eventIdTwo)
        eventBus.on(EventType.ROOM_STATE_CHANGE_EVENT, eventIdTwo, (state: roomState): void => {
            switch (state) {
                case roomState.CLOSE:
                    this.roomScene.showRoomResultPanel()
                    break
            }
        })
    }

    localNoticeEvent() {
        let eventIdOne = randEventId()
        this.eventIdList.push(eventIdOne)
        eventBus.on(EventType.LOCAL_NOTICE_EVENT, eventIdOne, (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.PLAY_BUTTON_EVENT: //开始按钮被点击事件通知
                    this.cc.log('start_game_test:我是游戏控制器，我接受到本地事件，游戏开始按钮被点击的通知')
                    this.playButtonExec()
                    break
                case LocalNoticeEventType.ROLL_DICE_FINISHED_NOTICE: //摇色子结束通知
                    this.roomScene.cleanRollDice()
                    this.roomScene.beginDeal()
                    break
                case LocalNoticeEventType.DELIVERY_CARD_FINISHED_NOTICE: //发牌结束通知
                    this.cc.log('响应发牌动画结束通知,将状态改为下注')
                    if (this.isEmulatorRoom) {
                        RaceManage.changeRaceState(RaceState.BET)
                    }
                    break
                case LocalNoticeEventType.LOCAL_BE_LANDLORD_RESULT: //
                    this.cc.log('我是游戏控制器，我接受到本地事件，响应是否当地主的通知')
                    this.responseLocalBeLandlordDeal(info.info)
                    break
                case LocalNoticeEventType.LOCAL_BET_CLICK_NOTICE: //本地下注事件通知
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
                case LocalNoticeEventType.SHOW_DOWN_ANIMATION_FINISHED_NOTICE: //比大小动画结束通知
                    if (this.isEmulatorRoom) {
                        let raceResultListOne = this.getRaceResultList(RoomManage.roomItem.oningRaceNum)
                        RaceManage.raceList[RoomManage.roomItem.oningRaceNum].setRaceResultList(raceResultListOne)
                        this.roomScene.scheduleOnce(() => {
                            cc.log('显示单局比赛结果显示完毕，我将单场比赛状态改为结束')
                            RaceManage.changeRaceState(RaceState.FINISHED)
                        }, ConfigManage.getShowResultTime());
                    }
                    this.roomScene.destroyMiddleTopScorePanel()
                    this.roomScene.toShowRaceResultPanel()
                    this.roomScene.closeXiaZhuPanel()
                    break
                case LocalNoticeEventType.TO_LOBBY_EVENT:
                    this.roomScene.execBackLobby()
                    break
                case LocalNoticeEventType.BACK_MUSIC_STATE_CHANGE_NOTICE: //背景音乐状态改变通知
                    if (info.info) {
                        this.roomScene.backMusic.play()
                    } else {
                        this.roomScene.backMusic.stop()
                    }
                    break
                case LocalNoticeEventType.TO_SHOW_START_BUTTON: //显示开始按钮通知
                    this.roomScene.showStartButton()
                    break
                case LocalNoticeEventType.SOCKET_CONNECT_NOTICE: //socket连接结果通知
                    if (info.info) { //连接成功通知
                        cc.log('接到socket连接通知，进入socket房间')
                        this.enterSocketRoom()
                    } else {
                        cc.log('接到socket连接失败通知，弹出提示框')
                        this.roomScene.scoketFailTip()
                    }
                    break
            }
        })

        let eventIdTwo = randEventId()
        this.eventIdList.push(eventIdTwo)
        eventBus.on(EventType.RACING_NUM_CHANGE_EVENT, eventIdTwo, (num: number): void => {
            let roomInfo = RoomManage.roomItem
            let count = RoomManage.roomItem.oningRaceNum
            this.roomScene.showPlayCountLimit.string = '当前牌局：' + (count + 1) + '/' + roomInfo.playCount
        })


        let eventIdThree = randEventId()
        this.eventIdList.push(eventIdThree)
        eventBus.on(EventType.LANDLORD_CAHNGE_EVENT, eventIdThree, (landlordId: string): void => {
            if (landlordId === UserManage.userInfo.id) {
                this.roomScene.roleSprite.spriteFrame = this.roomScene.zhuangIcon
            } else {
                this.roomScene.roleSprite.spriteFrame = this.roomScene.xianIcon
            }
        })

        let eventIdFour = randEventId()
        this.eventIdList.push(eventIdFour)
        eventBus.on(EventType.USER_SCORE_NOTICE, eventIdFour, (list: raceResultData[]): void => {
            if (typeof (list[UserManage.userInfo.id]) != 'undefined') {
                this.roomScene.userScoreLabel.string = list[UserManage.userInfo.id] + ''
            } else {
                this.roomScene.userScoreLabel.string = '0'
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
