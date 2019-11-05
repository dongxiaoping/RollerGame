const { ccclass, property } = cc._decorator;
import RaceManage from '../../store/Races/RaceManage'
import Room from '../../store/Room/RoomManage'
import GameMemberManage from '../../store/GameMember/GameMemberManage'
import RoomManage from '../../store/Room/RoomManage'
import UserManage from '../../store/User/UserManage'
import RaceItem from '../../store/Races/RaceItem'
import { GameMember, gameMemberType, memberState, raceRecord, raceState, MajongResult, IconValueList } from '../../common/Const'
import BetLocItem from '../../store/Bets/BetLocItem'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    myScore: cc.Label = null;
    @property(cc.Prefab)
    memberScoreItem: cc.Prefab = null;
    @property(cc.Label)
    landlordName: cc.Label = null;
    @property(cc.Label)
    landlordScore: cc.Label = null;

    @property(cc.Sprite)
    sky_dian_1: cc.Sprite = null;
    @property(cc.Sprite)
    sky_dian_2: cc.Sprite = null;
    @property(cc.Sprite)
    middle_dian_1: cc.Sprite = null;
    @property(cc.Sprite)
    middle_dian_2: cc.Sprite = null;
    @property(cc.Sprite)
    land_dian_1: cc.Sprite = null;
    @property(cc.Sprite)
    land_dian_2: cc.Sprite = null;
    @property(cc.Sprite)
    landlord_dian_1: cc.Sprite = null;
    @property(cc.Sprite)
    landlord_dian_2: cc.Sprite = null;
    start() {
        this.show()
    }

    drawResult(ob: cc.Sprite, val: number) {
        let list = IconValueList[val]
        for (let i = 0; i < list.length; i++) {
            ob.node.getChildByName(list[i]).active = true
        }

    }

    show() {
        cc.log('开始显示结果面板信息')
        let raceNum = RoomManage.roomItem.oningRaceNum
        cc.log('当前比赛的场次号' + raceNum)
        let raceInfo = RaceManage.raceList[raceNum]
        let betInfoList = raceInfo.betInfo
        let majongResult = raceInfo.majongResult
        let landloardId = raceInfo.landlordId
        cc.log(raceInfo)
        cc.log(landloardId)
        this.drawResult(this.sky_dian_1,majongResult.sky.one)
        this.drawResult(this.sky_dian_2,majongResult.sky.two)
        this.drawResult(this.middle_dian_1,majongResult.middle.one)
        this.drawResult(this.middle_dian_2,majongResult.middle.two)
        this.drawResult(this.land_dian_1,majongResult.land.one)
        this.drawResult(this.land_dian_2,majongResult.land.two)
        this.drawResult(this.landlord_dian_1,majongResult.landlord.one)
        this.drawResult(this.landlord_dian_2,majongResult.landlord.two)


        // let nick = this.landlordInfo.nick //地主名称
        // let landlordId = this.landlordInfo.userId as string
        // let majongResult = this.raceInfo.majongResult //点数结果
        // let memberResultList = this.raceInfo.betInfo //成员得分列表
        // let memberListOb = this.node.getChildByName('MemberList')
        let myUserId = UserManage.userInfo.id
        let myScore = betInfoList[myUserId].score
        this.myScore.string = myScore
        this.landlordName.string = GameMemberManage.gameMenmberList[landloardId].nick
        this.landlordScore.string = betInfoList[landloardId].score
        let i = 1
        betInfoList.forEach((item: BetLocItem) => {
            let node = cc.instantiate(this.memberScoreItem)
            let nameLabel = node.getChildByName('name').getComponents(cc.Label)
            let scoreLabel = node.getChildByName('score').getComponents(cc.Label)
            nameLabel[0].string = i + '. ' + item.userName
            scoreLabel[0].string = item.score + ''
            node.parent = this.node.getChildByName('MemberList')
            i++
        })
        // let landlordScore = this.raceInfo.betInfo[0].score //得住得分
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
        if (raceInfo === null) {
            cc.log('无法显示比赛结果面板，找不到正在进行中的比赛')
            return
        } else {
            cc.log('需要显示的比赛信息')
            cc.log(raceInfo)
            let landloard = null
            let memberList = GameMemberManage.gameMenmberList
            memberList.forEach((item, index) => {
                // if(item.roleType == gameMemberType)
            })
        }

    }

    // update (dt) {}
}
