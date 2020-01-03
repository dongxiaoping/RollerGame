import RaceManage from '../store/Races/RaceManage'
import RoomManage from '../store/Room/RoomManage'
import UserManage from '../store/User/UserManage'
import GameMemberItem from '../store/GameMember/GameMemberItem'
import { RaceState, roomState, RaceStateChangeParam, gameMemberType, memberState, GameMember, LocalNoticeEventType, EventType, LocalNoticeEventPara, TableLocationType, raceResultData, BetNoticeData, betLocaion } from '../common/Const'
import Room from '../store/Room/RoomManage'
import { roomInfo } from '../mock/RoomInfo'
import GameMemberManage from '../store/GameMember/GameMemberManage'
import { GameMemberList } from '../mock/GameMemberList'
import { RaceList } from '../mock/RaceList';
import { eventBus } from './EventBus';
import { randEventId } from './Util';
import { RollControlerBase } from './RollControlerBase';
import BetManage from '../store/Bets/BetManage';
import { randFloatNum } from '../common/Util';
class RollEmulator extends RollControlerBase {
    eventIdList: string[] = []
    public setTimeoutList: any[] = []
    public start() {
        cc.log('游戏模拟器被启动')
        this.initData()
        this.eventReceive()
    }

    //添加事件接受
    eventReceive() {
        //比赛流程状态改变通知
        let eventId = randEventId()
        this.eventIdList.push(eventId)
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, eventId, (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.SHOW_DOWN: //比大小
                    this.toShowMjResult()
                    break
                case RaceState.BET:  //下注
                    this.emulateBet()
                    break
                case RaceState.FINISHED:  //当场比赛结束
                    this.toStartNextRace()
                    break
            }
        })

        //本地事件通知
        let eventIdTwo = randEventId()
        this.eventIdList.push(eventIdTwo)
        eventBus.on(EventType.LOCAL_NOTICE_EVENT, eventIdTwo, (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.PLAY_BUTTON_EVENT:  //游戏开始按钮被点击
                    this.responsePlayButtonEvent()
                    break
                case LocalNoticeEventType.LOCAL_BE_LANDLORD_RESULT: //响应本地是否选择当地主结果
                    cc.log('响应本地是否选择当地主')//弃用
                    break
                case LocalNoticeEventType.ROLL_DICE_FINISHED_NOTICE: //响应摇色子动画结束通知
                    cc.log('响应摇色子动画结束通知,修改状态为发牌')
                    cc.log('我是游戏模拟器，我接到了摇色子动画结束的通知，我将比赛状态改为发牌')
                    RaceManage.changeRaceState(RaceState.DEAL)
                    break
                case LocalNoticeEventType.DELIVERY_CARD_FINISHED_NOTICE:
                    cc.log('响应发牌动画结束通知,将状态改为下注')
                    cc.log('我是游戏模拟器，我接到了发牌动画结束的通知，我将比赛状态改为下注')
                    RaceManage.changeRaceState(RaceState.BET)
                    break
                case LocalNoticeEventType.LOCAL_TIME_XIAZHU_FINISHED_NOTICE: //本地下注时间已过
                    cc.log('我是模拟器，当前下注时间已过，我将比赛状态改为比大小')
                    setTimeout(() => {
                        RaceManage.changeRaceState(RaceState.SHOW_DOWN)
                    }, 2000)
                    break
                case LocalNoticeEventType.SHOW_DOWN_ANIMATION_FINISHED_NOTICE: //比大小动画结束通知
                    cc.log('我是游戏模拟器，我接到了比大小动画结束通知,我将比赛状态改为显示结果')
                    let raceResultListOne = this.getRaceResultList(RoomManage.roomItem.oningRaceNum)
                    RaceManage.raceList[RoomManage.roomItem.oningRaceNum].setRaceResultList(raceResultListOne)
                    RaceManage.changeRaceState(RaceState.SHOW_RESULT)
                    let showResultTime = RoomManage.getShowResultTime()
                    setTimeout(() => {
                        cc.log('显示单局比赛结果已经持续了2s,我将单场比赛状态改为结束')
                        RaceManage.changeRaceState(RaceState.FINISHED)
                    }, showResultTime * 1000)
                    break
                case LocalNoticeEventType.LOCAL_BET_CLICK_NOTICE: //本地下注事件
                    let betInfo = info.info as BetNoticeData
                    BetManage.addBet(betInfo.raceNum, betInfo.userId, betInfo.betLocation, betInfo.betVal)
                    break
            }
        })
    }

    getRaceResultList(raceNum: number): raceResultData[] {
        let list = []
        GameMemberManage.gameMenmberList.forEach((item: GameMemberItem) => {
            let addItem = { userId: item.userId, score: null, nick: item.nick, icon: item.icon } as raceResultData
            addItem.score = RaceManage.getUserTheRaceScore(raceNum, item.userId)
            list.push(addItem)
        })
        return list
    }

    getRoomResultList(): raceResultData[] {
        let raceCount = RoomManage.roomItem.playCount
        let list = this.getRaceResultList(0)
        for (let i = 1; i < raceCount; i++) {
            let otherList = this.getRaceResultList(i)
            list = this.mergeRaceResult(list, otherList)
        }
        return list
    }

    mergeRaceResult(listOne: raceResultData[], listTwo: raceResultData[]): raceResultData[] {
        for (let i = 0; i < listOne.length; i++) {
            let item = listOne[i]
            let itemExist = false
            for (let j = 0; j < listTwo.length; j++) {
                if (item.userId === listTwo[j].userId) {
                    itemExist = true
                    listTwo[j].score += item.score
                }
            }
            if (!itemExist) {
                listTwo.push(item)
            }
        }
        return listTwo
    }

    //初始化本地数据
    initData() {
        cc.log('模拟器初始化本地数据')
        let userInfo = UserManage.userInfo
        Room.setRoomItem(roomInfo)
        Room.roomItem.creatUserId = userInfo.id
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

    //模拟器模拟相关推送数据
    emulateBet(): void {
        cc.log('模拟器发起模拟下注')
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        let landlordId = RaceManage.raceList[oningRaceNum].landlordId
        let memberList = GameMemberManage.gameMenmberList
        memberList.forEach((item: GameMemberItem) => {
            if (item.userId !== landlordId && item.userId !== UserManage.userInfo.id) {
                this.emulateXiaZhuByUser(item.userId)
            }
        })
    }

    //模拟对指定用户进行下注
    emulateXiaZhuByUser(userId: string): void {
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        if (RaceManage.raceList[oningRaceNum].state !== RaceState.BET) {
            cc.log('当前不是下注状态，不能下注')
            return
        }
        let localXiaZhuLimiTime = RoomManage.getBetTime()
        let ranTime = randFloatNum(1, localXiaZhuLimiTime - 1)

        let setTimeOutOne = setTimeout(() => {
            BetManage.addBet(oningRaceNum, userId, betLocaion.LAND_CORNER, 10)
        }, ranTime * 1000)
        this.setTimeoutList.push(setTimeOutOne)
        ranTime = randFloatNum(1, localXiaZhuLimiTime - 1)

        let setTimeOutTwo = setTimeout(() => {
            BetManage.addBet(oningRaceNum, userId, betLocaion.SKY, 20)
        }, ranTime * 1000)
        this.setTimeoutList.push(setTimeOutTwo)

        ranTime = randFloatNum(1, localXiaZhuLimiTime - 1)
        let setTimeOut7 = setTimeout(() => {
            BetManage.addBet(oningRaceNum, userId, betLocaion.BRIDG, 20)
        }, ranTime * 1000)
        this.setTimeoutList.push(setTimeOut7)

        ranTime = randFloatNum(1, localXiaZhuLimiTime - 1)
        let setTimeOut8 = setTimeout(() => {
            BetManage.addBet(oningRaceNum, userId, betLocaion.LAND, 50)
        }, ranTime * 1000)
        this.setTimeoutList.push(setTimeOut8)

        ranTime = randFloatNum(1, localXiaZhuLimiTime - 1)
        let setTimeOut9 = setTimeout(() => {
            BetManage.addBet(oningRaceNum, userId, betLocaion.MIDDLE, 100)
        }, ranTime * 1000)
        this.setTimeoutList.push(setTimeOut9)

        ranTime = randFloatNum(1, localXiaZhuLimiTime - 1)
        let setTimeOut10 = setTimeout(() => {
            BetManage.addBet(oningRaceNum, userId, betLocaion.SKY_CORNER, 100)
        }, ranTime * 1000)
        this.setTimeoutList.push(setTimeOut10)

    }

    responsePlayButtonEvent() {
        cc.log('游戏模拟器，接收到游戏开始按钮通知')
        cc.log('房间改为游戏中')
        RoomManage.roomItem.roomState = roomState.PLAYING //改变房间状态为游戏中
        cc.log('我是模拟器，我收到了当前用户点击开始比赛的通知，我将进行中的比赛场次设置为0，我开始了比赛')
        RoomManage.roomItem.oningRaceNum = 0
        cc.log('我是模拟器，我收到了当前用户点击开始比赛的通知，我将第一个房间状态改为选地主')
        RaceManage.changeRaceState(RaceState.ROLL_DICE)
    }

    //启动下场比赛
    toStartNextRace(): void {
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        if ((oningRaceNum + 1) === RoomManage.roomItem.playCount) {
            cc.log('所有比赛都完成')
            cc.log('因为所有比赛都完成了，将房间状态改为比赛全部结束')
            setTimeout(() => {
                RaceManage.setGameOverResultList(this.getRoomResultList())
                RoomManage.roomItem.roomState = roomState.ALL_RACE_FINISHED
            }, 2000)
            return
        }
        if ((oningRaceNum + 1) > RoomManage.roomItem.playCount) {
            cc.log('所有比赛已完成，无下场比赛')
            return
        }
        cc.log('我是游戏模拟器，我修改了进行中的场次值，开始下场比赛')
        let nextRaceNum = oningRaceNum + 1
        cc.log('当前场次的编号：' + oningRaceNum + ',下场比赛的编号:' + nextRaceNum)
        setTimeout(() => {
            RoomManage.roomItem.oningRaceNum = nextRaceNum
            cc.log('我是游戏模拟器，我开始了下局比赛，所以直接将下场比赛状态改为摇色子')
            RaceManage.changeRaceState(RaceState.ROLL_DICE)
        }, 2000)
    }

    //显示结果麻将结果通知
    toShowMjResult(): void {
        cc.log('发出翻牌通知')
        eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: TableLocationType.LANDLORD } as LocalNoticeEventPara)
    }

    close(): void {
        super.close()
        this.setTimeoutList.forEach((item: any) => {
            clearTimeout(item)
        })
    }
}

export default RollEmulator
