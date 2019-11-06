/* 牌桌
 * 功能：1、提供桌面显示 2、提供桌位的坐标 3、提供天、地、中等位置放置chip的中心点坐标
 * 3、提供出结果后，桌面的提示动画  4、提供用户图标显示管理
 */
const { ccclass, property } = cc._decorator;
import GameMemberManage from '../../store/GameMember/GameMemberManage'
import GameMemberItem from '../../store/GameMember/GameMemberItem'
import User from '../../store/User/UserManage'
import { UserInfo } from '../../store/User/UserBase'
import { EventType, roomState, GameMember, PushEventPara, PushEventType } from '../../common/Const'
import RoomItem from '../../store/Room/RoomItem'
import Room from '../../store/Room/RoomManage'
import { eventBus } from '../../common/EventBus'
import { randEventId } from '../../common/Util'
import RaceManage from '../../store/Races/RaceManage'
import RaceItem from '../../store/Races/RaceItem'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    private playUserIcon: cc.Prefab = null //玩家icon
    @property(cc.Sprite)
    private deskBg: cc.Sprite = null

    private deskSitList = [] //坐的位置信息 如：[userId:location:{x:0,y:3}]
    start() {
        this.setDeskLocation()
        this.showMembers()
        this.addEventListener()
    }

    addEventListener() {
        eventBus.on(EventType.PUSH_EVENT, randEventId(), (info: PushEventPara): void => {
            if (info.type === PushEventType.LANDLORD_CHANGE) {
                cc.log('桌子接收到地主改变通知')
                this.showMembers()
            }
        })
    }

    //重新摆放桌子位置
    async setDeskLocation() {
        let infoOne = await Room.requestRoomInfo()
        let roomInfo = infoOne.extObject as RoomItem
        let ob = await GameMemberManage.requestGameMemberList()
        let memberList = ob.extObject as GameMemberItem[]
        let info = await User.requestUserInfo()
        let userInfo = info.extObject as UserInfo
        let deskBg: string = 'desk/place_a06eb30b'
        cc.loader.loadRes(deskBg, (error, img) => {
            let myIcon = new cc.SpriteFrame(img);
            this.deskBg.spriteFrame = myIcon;
        })
        cc.log('桌子摆放完毕')
    }

    clearOldMember() {
        this.deskSitList.forEach((item: any) => {
            let name = item.name
            this.node.parent.getChildByName(name).removeAllChildren()
        })
        this.deskSitList = []
    }

    async showMembers() {
        this.clearOldMember()
        let infoOne = await Room.requestRoomInfo()
        let roomInfo = infoOne.extObject as RoomItem
        let infoTwo = await RaceManage.requestRaceList()
        let raceList = infoTwo.extObject as RaceItem[]
        let ob = await GameMemberManage.requestGameMemberList()
        let memberList = ob.extObject as GameMemberItem[]
        let isLandlordFind = false
        let leftMembers: any[] = []
        let rightMembers: any[] = []
        let oningRaceNum = Room.roomItem.oningRaceNum
        let landLordId = raceList[oningRaceNum].landlordId
        if(landLordId === '' || landLordId === null){
            landLordId = User.userInfo.id
        }
        memberList.forEach((item: GameMemberItem): void => {
            if (item.userId === landLordId) {
                let node = cc.instantiate(this.playUserIcon)
                node.name = item.userId
                node.parent = this.node.parent.getChildByName('Member_landlord')
                node.setPosition(0, 0)
                this.deskSitList[item.userId] = { userId: item.userId, name: 'Member_landlord' }
                isLandlordFind = true
                node.active = true
            } else {
                if (isLandlordFind) {
                    leftMembers.push(item)
                } else {
                    rightMembers.push(item)
                }
            }
        })
        if (!isLandlordFind) {
            let k = 0
            let j = 0
            memberList.forEach((item: GameMemberItem): void => {
                let node = cc.instantiate(this.playUserIcon)
                node.name = item.userId
                if (k === 0) {
                    node.parent = this.node.parent.getChildByName('Member_landlord')
                    node.setPosition(0, 0)
                    this.deskSitList[item.userId] = { userId: item.userId, name: 'Member_landlord' }
                    node.active = true
                } else {
                    node.parent = this.node.parent.getChildByName('Member_' + j)
                    node.setPosition(0, 0)
                    this.deskSitList[item.userId] = { userId: item.userId, name: 'Member_' + j }
                    node.active = true
                    j++
                }
                k++
            })
            return
        }
        let i = 0
        leftMembers.forEach((item: GameMemberItem): void => {
            let node = cc.instantiate(this.playUserIcon)
            node.name = item.userId
            node.parent = this.node.parent.getChildByName('Member_' + i)
            node.setPosition(0, 0)
            this.deskSitList[item.userId] = { userId: item.userId, name: 'Member_' + i }
            node.active = true
            i++
        })
        let j = 8
        rightMembers = rightMembers.reverse()
        rightMembers.forEach((item: GameMemberItem): void => {
            let node = cc.instantiate(this.playUserIcon)
            node.name = item.userId
            node.parent = this.node.parent.getChildByName('Member_' + j)
            node.setPosition(0, 0)
            this.deskSitList[item.userId] = { userId: item.userId, name: 'Member_' + j }
            node.active = true
            j--
        })

        cc.log('成员坐落初始化完毕')
    }
}
