const { ccclass, property } = cc._decorator;
import { RollControlerOb } from './RollControler'
import RaceManage from '../store/Races/RaceManage'
import RoomManage from '../store/Room/RoomManage'
import UserManage from '../store/User/UserManage'
import GameMember from '../store/GameMember/GameMemberManage'
import GameMemberItem from '../store/GameMember/GameMemberItem'
import { RaceState, roomState, RaceStateChangeParam } from '../common/Const'
import Room from '../store/Room/RoomManage'
import GameMemberManage from '../store/GameMember/GameMemberManage'
@ccclass
class RollEmulator extends RollControlerOb {
    startRun(): void {
        cc.log('游戏模拟器被启动')
        this.initData() //将本地数据全部初始化一遍，这样后续数据可以直接使用，不用接口请求
        super.startRun()
    }

    //初始化本地数据
    async initData() {
        cc.log('模拟器初始化本地数据')
        let infoOne = await Room.requestRoomInfo()
        let infoTwo = await GameMemberManage.requestGameMemberList()
        let infoThree = await UserManage.requestUserInfo()
        RaceManage.updateBetToRaceInfo() //初始化本地的比赛数据
    }

    //模拟器模拟相关推送数据
    emulateBet(): void {
        cc.log('模拟器发起模拟下注')
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        let landlordId = RaceManage.raceList[oningRaceNum].landlordId
        let memberList = GameMember.gameMenmberList
        memberList.forEach((item: GameMemberItem) => {
            if (item.userId !== landlordId) {
                RaceManage.raceList[oningRaceNum].betInfo[item.userId].bridg = 10
                RaceManage.raceList[oningRaceNum].betInfo[item.userId].land = 50
                RaceManage.raceList[oningRaceNum].betInfo[item.userId].middle = 10
                RaceManage.raceList[oningRaceNum].betInfo[item.userId].sky = 100
                RaceManage.raceList[oningRaceNum].betInfo[item.userId].skyCorner = 20
                RaceManage.raceList[oningRaceNum].betInfo[item.userId].landCorner = 100
            }
        })
        setTimeout(() => {
            cc.log('修改游戏状态为比大小')
            cc.log('我是模拟器，我将比赛状态改为比大小')
            RaceManage.changeRaceState(RaceState.SHOW_DOWN)
        }, 6000)
    }

    responsePlayButtonEvent() {
        cc.log('模拟器控制器接收到游戏开始按钮通知')
        cc.log('房间改为游戏中')
        RoomManage.roomItem.roomState = roomState.PLAYING //改变房间状态为游戏中
        cc.log('我是模拟器，我收到了当前用户点击开始比赛的通知，我将进行中的比赛场次设置为0，我开始了比赛')
        RoomManage.roomItem.oningRaceNum = 0
        cc.log('我是模拟器，我收到了当前用户点击开始比赛的通知，我将第一个房间状态改为选地主')
        RaceManage.changeRaceState(RaceState.CHOICE_LANDLORD)
        cc.log('邀请当前用户当地主')
        RaceManage.raceList[0].landlordId = UserManage.userInfo.id
    }

    responseLocalBeLandlordDeal(wantLandlord: boolean) {
        cc.log('模拟控制器接收到用户是否愿意当地主通知')
        let userId = UserManage.userInfo.id
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        if (wantLandlord) {
            RaceManage.raceList[oningRaceNum].landlordId = userId
        } else {
            RaceManage.raceList[oningRaceNum].landlordId = '24'
        }
        setTimeout(() => {
            cc.log('模拟器开启摇色子环节')
            cc.log('我是模拟器，我收到了本地用户是否愿意当地主的通知，我将比赛状态改为摇色子')
            RaceManage.changeRaceState(RaceState.ROLL_DICE)
        }, 1000)
    }

}

export default new RollEmulator()
