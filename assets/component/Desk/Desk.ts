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
import { roomState } from '../../store/Room/RoomBase'
import RoomItem from '../../store/Room/RoomItem'
import Room from '../../store/Room/RoomManage'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    private playUserIcon: cc.Prefab = null //玩家icon
    @property(cc.Sprite)
    private deskBg: cc.Sprite = null
    private deskBridgIsTop: boolean = false //桌子的摆放姿势，如果true表示桥朝上

    private deskSitList = [] //坐的位置信息 如：[userId:location:{x:0,y:3}]
    start() {
        this.setDeskLocation()
        this.showMembers()
    }

    //重新摆放桌子位置
    async setDeskLocation() {
        let infoOne = await Room.requestRoomInfo()
        let roomInfo = infoOne.extObject as RoomItem
        let ob = await GameMemberManage.requestGameMemberList()
        let memberList = ob.extObject as GameMemberItem[]
        let info = await User.requestUserInfo()
        let userInfo = info.extObject as UserInfo
        let deskBg: string = null
        if (roomInfo.roomState === roomState.OPEN || memberList[userInfo.id].roleType !== gameMemberType.LANDLORD) {
            deskBg = 'desk/place_a06eb30b'
            this.deskBridgIsTop = true
        } else {
            deskBg = 'desk/place-banker_e96db884'
            this.deskBridgIsTop = false
        }
        cc.loader.loadRes(deskBg, (error, img) => {
            let myIcon = new cc.SpriteFrame(img);
            this.deskBg.spriteFrame = myIcon;
        })
        cc.log('桌子摆放完毕')
    }

    async showMembers() {
        this.deskSitList = [] //如果有残留图标 先删除
        let infoOne = await Room.requestRoomInfo()
        let roomInfo = infoOne.extObject as RoomItem
        let ob = await GameMemberManage.requestGameMemberList()
        let memberList = ob.extObject as GameMemberItem[]
        let deskLoc: any = null
        if (this.deskBridgIsTop) {
            deskLoc = SeatLocaionList.member
        } else {
            deskLoc = SeatLocaionList.landlord
        }
        if (roomInfo.roomState === roomState.OPEN) {
            let i = 0
            let z = 0
            memberList.forEach((item: GameMemberItem): void => {
                var node = cc.instantiate(this.playUserIcon)
                node.name = item.userId
                node.parent = this.node.parent
                if (z === 0) {
                    node.setPosition(deskLoc.landlord.x, deskLoc.landlord.y)
                    this.deskSitList[item.userId] = deskLoc.landlord
                } else {
                    node.setPosition(deskLoc.members[i].x, deskLoc.members[i].y)
                    this.deskSitList[item.userId] = deskLoc.members[i]
                    i++
                }
                z++
                node.active = true
            })
        }
        cc.log('成员坐落初始化完毕')
    }
}
