const { ccclass, property } = cc._decorator;
import RaceManage from '../store/Races/RaceManage'
import RoomManage from '../store/Room/RoomManage'
import UserManage from '../store/User/UserManage'
import GameMemberItem from '../store/GameMember/GameMemberItem'
import { RaceState, roomState, RaceStateChangeParam, gameMemberType, memberState, GameMember, LocalNoticeEventType, EventType, LocalNoticeEventPara, TableLocationType, raceResultData } from '../common/Const'
import Room from '../store/Room/RoomManage'
import { roomInfo } from '../mock/RoomInfo'
import GameMemberManage from '../store/GameMember/GameMemberManage'
import { GameMemberList } from '../mock/GameMemberList'
import { userInfo } from '../mock/UserInfo'
import { RaceList } from '../mock/RaceList';
import { eventBus } from './EventBus';
import { randEventId } from './Util';
import { RollControlerBase } from './RollControlerBase';
@ccclass
class RollEmulator extends RollControlerBase{
    public isRuning: boolean = false
    public start() {
        cc.log('游戏模拟器被启动')
        this.isRuning = true
        this.initData()
        this.eventReceive()
    }

    //添加事件接受
    eventReceive() {
        //比赛流程状态改变通知
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, randEventId(), (info: RaceStateChangeParam): void => {
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
        eventBus.on(EventType.LOCAL_NOTICE_EVENT, randEventId(), (info: LocalNoticeEventPara): void => {
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
                    RaceManage.changeRaceState(RaceState.SHOW_DOWN)
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
                    }, showResultTime*1000)
                    break
            }
        })
    }

    getRaceResultList(raceNum:number){
        let list = []
        GameMemberManage.gameMenmberList.forEach((item:GameMemberItem)=>{
            let addItem = {userId:item.userId,score:null,nick:item.nick,icon:item.icon} as raceResultData
            addItem.score = RaceManage.getUserTheRaceScore(raceNum, item.userId)
            list.push(addItem)
        })
        return list
    }

    //初始化本地数据
     initData() {
        cc.log('模拟器初始化本地数据')
        UserManage.setUserInfo(userInfo)
        Room.setRoomItem(roomInfo)

        let memeberOwn = {
            userId: '',
            roleType: gameMemberType.MANAGE,
            nick: '',
            icon: '',
            score: 0,
            state: memberState.OnLine
        } as GameMember
        memeberOwn['userId'] = userInfo['id']
        memeberOwn['nick'] = userInfo.nick
        memeberOwn['icon'] = userInfo.icon
        GameMemberList.splice(0, 0, memeberOwn)
        let newMembers = [memeberOwn];
        GameMemberList.forEach((item: GameMember) => {
            newMembers.push(item)
        })
        GameMemberManage.setGameMemberList(newMembers)

        RaceManage.setRaceList(RaceList)
        //  BetManage.init(GameMemberList, roomInfo.playCount)
        //  BetManage.setBetList(BetList)
        //  RaceManage.updateEmulatorRaceInfo()
    }

    //模拟器模拟相关推送数据
    emulateBet(): void {
        cc.log('模拟器发起模拟下注')
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        let landlordId = RaceManage.raceList[oningRaceNum].landlordId
        let memberList = GameMemberManage.gameMenmberList
        memberList.forEach((item: GameMemberItem) => {
            if (item.userId !== landlordId && item.userId !== UserManage.userInfo.id) {
                RaceManage.emulateXiaZhuByUser(item.userId)
            }
        })
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

    // responseLocalBeLandlordDeal(wantLandlord: boolean) {
    //     cc.log('游戏模拟器接收到用户是否愿意当地主通知')
    //     let userId = UserManage.userInfo.id
    //     let oningRaceNum = RoomManage.roomItem.oningRaceNum
    //     if (wantLandlord) {
    //         RaceManage.raceList[oningRaceNum].landlordId = userId
    //     } else {
    //         RaceManage.raceList[oningRaceNum].landlordId = '24'
    //     }
    //     setTimeout(() => {
    //         cc.log('模拟器开启摇色子环节')
    //         cc.log('我是模拟器，我收到了本地用户是否愿意当地主的通知，我将比赛状态改为摇色子')
    //         RaceManage.changeRaceState(RaceState.ROLL_DICE)
    //     }, 1000)
    // }

    //启动下场比赛
    toStartNextRace(): void {
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        if ((oningRaceNum + 1) === RoomManage.roomItem.playCount) {
            cc.log('所有比赛都完成')
            cc.log('因为所有比赛都完成了，将房间状态改为比赛全部结束')
            setTimeout(() => {
                //RaceManage.setGameOverResultList(RaceResultListOne)
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
        }, 3000)
    }

    //显示结果麻将结果通知
    toShowMjResult(): void {
        cc.log('发出翻牌通知')
        eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: TableLocationType.LANDLORD } as LocalNoticeEventPara)
    }

}

export default new RollEmulator()
