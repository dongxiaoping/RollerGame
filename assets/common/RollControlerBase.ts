import { eventBus } from "./EventBus";
import RoomManage from "../store/Room/RoomManage";
import RaceManage from "../store/Races/RaceManage";
import ConfigManage from "../store/Config/ConfigManage";
import { randFloatNum, mergeRaceResult, randomRange } from "./Util";
import {
    betLocaion,
    NoticeType,
    NoticeData,
    RaceState,
    raceResultData,
    roomState,
    ConsoleType,
    gameMemberType
} from "./Const";
import BetManage from "../store/Bets/BetManage";
import UserManage from "../store/User/UserManage";
import webSocketManage from '../common/WebSocketManage'
import GameMemberManage from "../store/GameMember/GameMemberManage";
import GameMemberItem from "../store/GameMember/GameMemberItem";
import log from "loglevel";
export class RollControlerBase {
    public isEmulatorRoom: boolean //是否是模拟房间
    public eventIdList: string[] = []
    public  name:string = 'RollController'
    public setTimeoutList: any[] = []
    public cc: any
    public roomScene: any
    constructor(cc: any, isEmulatorRoom: boolean, roomScene: any) {
        this.cc = cc
        this.isEmulatorRoom = isEmulatorRoom
        this.roomScene = roomScene
    }

    //执行下注业务逻辑
    execBetAction() {
        if (this.isEmulatorRoom) {
            this.emulateBet()
        }
        this.roomScene.adjustBeforeRaceStateChange(RaceState.BET)
        this.roomScene.showXiaZhuPanel()
        this.cc.find('Canvas').getChildByName('DealMachine').getComponent('DealMachine').checkAndAddMajong()
        this.roomScene.showMiddleTopTimePanel()
        this.roomScene.showMiddleTopScorePanel()
    }

    //执行发牌逻辑
    execDealAction() {
        this.roomScene.adjustBeforeRaceStateChange(RaceState.DEAL)
        let kaiShi = cc.instantiate(this.roomScene.kaiShipTip)
        this.roomScene.scheduleOnce(() => {
            kaiShi.parent = this.cc.find('Canvas/Desk')
            kaiShi.setPosition(0, 0);
            kaiShi.active = true
            if (ConfigManage.isTxMusicOpen()) {
                this.roomScene.beginVoice.play()
            }
            this.roomScene.scheduleOnce(() => {
                kaiShi.destroy()
                this.roomScene.beginRollDice()
                this.roomScene.showXiaZhuPanel()
            }, ConfigManage.getBeginTextShowTime());
        }, ConfigManage.getTimeBeforeBeginText());
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
            //this.cc.log('我是游戏控制器，我向服务器发起抢地主通知')
        }
    }

    //模拟对指定用户进行下注
    emulateXiaZhuByUser(userId: string): void {
        let randVal = ConfigManage.getChipValList()
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        if (RaceManage.raceList[oningRaceNum].state !== RaceState.BET) {
            //this.cc.log('当前不是下注状态，不能下注')
            return
        }
        let localXiaZhuLimiTime = ConfigManage.getBetTime()
        let ranTime = randFloatNum(1, localXiaZhuLimiTime - 1)

        let setTimeOutOne = setTimeout(() => {

            BetManage.addBet(oningRaceNum, userId, betLocaion.LAND_CORNER, randVal[randomRange(0, 4)])
        }, ranTime * 1000)
        this.setTimeoutList.push(setTimeOutOne)
        ranTime = randFloatNum(1, localXiaZhuLimiTime - 1)

        let setTimeOutTwo = setTimeout(() => {
            BetManage.addBet(oningRaceNum, userId, betLocaion.SKY, randVal[randomRange(0, 4)])
        }, ranTime * 1000)
        this.setTimeoutList.push(setTimeOutTwo)

        ranTime = randFloatNum(1, localXiaZhuLimiTime - 1)
        let setTimeOut7 = setTimeout(() => {
            BetManage.addBet(oningRaceNum, userId, betLocaion.BRIDG, randVal[randomRange(0, 4)])
        }, ranTime * 1000)
        this.setTimeoutList.push(setTimeOut7)

        ranTime = randFloatNum(1, localXiaZhuLimiTime - 1)
        let setTimeOut8 = setTimeout(() => {
            BetManage.addBet(oningRaceNum, userId, betLocaion.LAND, randVal[randomRange(0, 4)])
        }, ranTime * 1000)
        this.setTimeoutList.push(setTimeOut8)

        ranTime = randFloatNum(1, localXiaZhuLimiTime - 1)
        let setTimeOut9 = setTimeout(() => {
            BetManage.addBet(oningRaceNum, userId, betLocaion.MIDDLE, randVal[randomRange(0, 4)])
        }, ranTime * 1000)
        this.setTimeoutList.push(setTimeOut9)

        ranTime = randFloatNum(1, localXiaZhuLimiTime - 1)
        let setTimeOut10 = setTimeout(() => {
            BetManage.addBet(oningRaceNum, userId, betLocaion.SKY_CORNER, randVal[randomRange(0, 4)])
        }, ranTime * 1000)
        this.setTimeoutList.push(setTimeOut10)

    }

    getRoomResultList(): raceResultData[] {
        let raceCount = RoomManage.roomItem.playCount
        let list = this.getRaceResultList(0)
        for (let i = 1; i < raceCount; i++) {
            let otherList = this.getRaceResultList(i)
            list = mergeRaceResult(list, otherList)
        }
        return list
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


    //模拟器模拟相关推送数据
    public emulateBet(): void {
        //this.cc.log('模拟器发起模拟下注')
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        let landlordId = RaceManage.raceList[oningRaceNum].landlordId
        let memberList = GameMemberManage.gameMenmberList
        memberList.forEach((item: GameMemberItem) => {
            if (item.userId !== landlordId && item.userId !== UserManage.userInfo.id) {
                this.emulateXiaZhuByUser(item.userId)
            }
        })
    }

    public enterSocketRoom() {
        if (RoomManage.roomItem.roomState !== roomState.CLOSE) {
            let notice = {
                type: NoticeType.enterRoom, info: {
                    roomId: RoomManage.roomItem.id,
                    userId: UserManage.userInfo.id
                }
            } as NoticeData
            log.info('进入房间socket请求',notice)
            webSocketManage.send(JSON.stringify(notice));
        } else {
            //this.cc.log('房间已关闭，无法进入')
        }
    }

    playButtonExec() {
        if (this.isEmulatorRoom) {
            RoomManage.roomItem.roomState = roomState.PLAYING
            RaceManage.changeRaceState(RaceState.DEAL)
        } else {
            let startRoomGame = {
                type: NoticeType.startRoomGame, info: {
                    roomId: RoomManage.roomItem.id,
                    userId: UserManage.userInfo.id
                }
            } as NoticeData
            webSocketManage.send(JSON.stringify(startRoomGame));
        }
    }

    //启动下场比赛
    toStartNextEmulatorRace(): void {
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        if ((oningRaceNum + 1) === RoomManage.roomItem.playCount) {
            //this.cc.log('所有比赛都完成')
            //this.cc.log('因为所有比赛都完成了，将房间状态改为比赛全部结束')
            setTimeout(() => {
                RaceManage.setGameOverResultList(this.getRoomResultList())
                RoomManage.roomItem.roomState = roomState.CLOSE
            }, 1000)
            return
        }
        if ((oningRaceNum + 1) > RoomManage.roomItem.playCount) {
            //this.cc.log('所有比赛已完成，无下场比赛')
            return
        }
        //this.cc.log('我是游戏模拟器，我修改了进行中的场次值，开始下场比赛')
        let nextRaceNum = oningRaceNum + 1
        //this.cc.log('当前场次的编号：' + oningRaceNum + ',下场比赛的编号:' + nextRaceNum)
        setTimeout(() => {
            RoomManage.roomItem.changeOningRaceNum(nextRaceNum)
            //this.cc.log('我是游戏模拟器，我开始了下局比赛，所以直接将下场比赛状态改为摇色子')
            RaceManage.changeRaceState(RaceState.DEAL)
        }, 2000)
    }

    close() {
        eventBus.clearAll()
        this.setTimeoutList.forEach((item: any) => {
            clearTimeout(item)
        })
    }
}
