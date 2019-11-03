const {ccclass, property} = cc._decorator;
import RaceManage from '../../store/Races/RaceManage'
import Room from '../../store/Room/RoomManage'
import GameMemberManage from '../../store/GameMember/GameMemberManage'
import UserManage from '../../store/User/UserManage'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
      //  this.initData()
    }

     //初始化本地数据
     async initData() {
        cc.log('模拟器初始化本地数据')
        let infoOne = await Room.requestRoomInfo()
        let infoTwo = await GameMemberManage.requestGameMemberList()
        let infoThree = await UserManage.requestUserInfo()
        RaceManage.updateBetToRaceInfo() //初始化本地的比赛数据

        ///////////
        let raceInfo = RaceManage.getPlayingRaceInfo()
        if(raceInfo === null){
            cc.log('无法显示比赛结果面板，找不到正在进行中的比赛')
            return
        }else {
            cc.log('需要显示的比赛信息')
            cc.log(raceInfo)
            let landloard = null
            let memberList = GameMemberManage.gameMenmberList
            memberList.forEach((item,index)=>{
               // if(item.roleType == gameMemberType)
            })
        }

    }

    // update (dt) {}
}
