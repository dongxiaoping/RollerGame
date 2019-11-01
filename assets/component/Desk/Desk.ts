/* 牌桌
 * 功能：1、提供桌面显示 2、提供桌位的坐标 3、提供天、地、中等位置放置chip的中心点坐标
 * 3、提供出结果后，桌面的提示动画  4、提供用户图标显示管理
 */
const { ccclass, property } = cc._decorator;
import GameMemberManage from '../../store/GameMember/GameMemberManage'
import GameMemberItem from '../../store/GameMember/GameMemberItem'
import { GameMember, gameMemberType } from '../../store/GameMember/GameMemberBase'
import User from '../../store/User/UserManage'
import { UserInfo } from '../../store/User/UserBase'
import { SeatLocaionList } from '../../common/Const'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    private playUserIcon: cc.Prefab = null //玩家icon
    @property(cc.Sprite)
    private deskBg: cc.Sprite = null

    private deskSitList = [] //坐的位置信息 如：[userId:location:{x:0,y:3}]

    public userIsLandlord: boolean = false //当前用户是否为地主
    start() {
        this.setDeskLocation()
        this.showMembers()
    }

    //重新摆放桌子位置
    async setDeskLocation() {
        let ob = await GameMemberManage.requestGameMemberList()
        let memberList = ob.extObject as GameMemberItem[]
        let info = await User.requestUserInfo()
        let userInfo = info.extObject as UserInfo
        if (memberList[userInfo.id].roleType === gameMemberType.LANDLORD) {
            this.userIsLandlord = true
            cc.loader.loadRes('desk/place-banker_e96db884', (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                this.deskBg.spriteFrame = myIcon;
            })
        } else {
            this.userIsLandlord = false
            cc.loader.loadRes('desk/place_a06eb30b', (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                this.deskBg.spriteFrame = myIcon;
            })
        }
        cc.log('桌子摆放完毕')
    }

    async showMembers() {
        this.deskSitList = [] //如果有残留图标 先删除
        let ob = await GameMemberManage.requestGameMemberList()
        let memberList = ob.extObject as GameMemberItem[]
        let info = await User.requestUserInfo()
        let userInfo = info.extObject as UserInfo
        let deskLoc: any = null
        if (memberList[userInfo.id].roleType === gameMemberType.LANDLORD) {
            deskLoc = SeatLocaionList.landlord
        } else {
            deskLoc = SeatLocaionList.member
        }
        let i = 0
        memberList.forEach((item: GameMemberItem): void => {
            var node = cc.instantiate(this.playUserIcon)
            node.name = item.userId
            node.parent = this.node.parent
            if (item.roleType === gameMemberType.LANDLORD) {
                node.setPosition(deskLoc.landlord.x, deskLoc.landlord.y)
                this.deskSitList[item.userId] = deskLoc.landlord
            } else {
                node.setPosition(deskLoc.members[i].x, deskLoc.members[i].y)
                this.deskSitList[item.userId] = deskLoc.members[i]
                i++
            }
            node.active = true
        })
        cc.log('成员坐落初始化完毕')
    }
}
