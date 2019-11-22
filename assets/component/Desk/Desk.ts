/* 牌桌
 * 功能：1、提供桌面显示 2、提供桌位的坐标 3、提供天、地、中等位置放置chip的中心点坐标
 * 3、提供出结果后，桌面的提示动画  4、提供用户图标显示管理
 */
const { ccclass, property } = cc._decorator;
import GameMemberManage from '../../store/GameMember/GameMemberManage'
import GameMemberItem from '../../store/GameMember/GameMemberItem'
import { EventType, RaceStateChangeParam, RaceState, LocalNoticeEventType, LocalNoticeEventPara, CompareDxRe } from '../../common/Const'
import RoomItem from '../../store/Room/RoomItem'
import Room from '../../store/Room/RoomManage'
import { eventBus } from '../../common/EventBus'
import { randEventId } from '../../common/Util'
import RaceManage from '../../store/Races/RaceManage'
import RaceItem from '../../store/Races/RaceItem'
import RoomManage from '../../store/Room/RoomManage';
import UserManage from '../../store/User/UserManage';
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    private playUserIcon: cc.Prefab = null //玩家icon
    @property(cc.Sprite)
    private deskBg: cc.Sprite = null

    @property(cc.Prefab)
    private middleResultWenZi: cc.Prefab = null //比大小通杀 通赔通知

    onLandlordSiteUserId: string = null //当前坐在地主位置上的用户ID

    @property(cc.Prefab)
    private qingXiaZhu: cc.Prefab = null //请下注文字图

    private deskSitList = [] //坐的位置信息 如：[userId:location:{x:0,y:3}]
    start() {
        this.showMembers()
        this.addEventListener()
    }

    addEventListener() {
        eventBus.on(EventType.LANDLORD_CAHNGE_EVENT, randEventId(), (landlordId: string): void => {
            cc.log('桌子接收到地主改变通知')
            this.showMembers()
        })

        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, randEventId(), (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.BET:  //下注
                    this.playingXiaZhuAnimation()
                    break
            }
        })

        eventBus.on(EventType.LOCAL_NOTICE_EVENT, randEventId(), (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.OPEN_CARD_FINISHED_NOTICE:
                    this.playingBiDaXiaAnimation((): void => {
                         eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.SHOW_DOWN_ANIMATION_FINISHED_NOTICE } as LocalNoticeEventPara)
                    })
                    break
            }
        })


    }

    clearOldMember() {
        this.onLandlordSiteUserId = null
        this.deskSitList.forEach((item: any) => {
            let name = item.name
            this.node.parent.getChildByName(name).removeAllChildren()
        })
        this.deskSitList = []
    }

    //比大小动画 比大小动画结束回调
    playingBiDaXiaAnimation(func: any) {
        let oningNum = RoomManage.roomItem.oningRaceNum
        let race = RaceManage.raceList[oningNum]
        let showNode:any = null
        if ((race.skyResult === CompareDxRe.BIG && race.middleResult === CompareDxRe.BIG &&
            race.landResult === CompareDxRe.BIG) || (race.skyResult === CompareDxRe.SMALL &&
                race.middleResult === CompareDxRe.SMALL && race.landResult === CompareDxRe.SMALL)) {
            cc.log('显示通赔或者通杀')
            showNode = cc.instantiate(this.middleResultWenZi)
            showNode.parent = this.node.parent
            showNode.active = true
        }
        setTimeout(() => {
            if(showNode!==null){
                showNode.destroy()
            }
            func()
        }, 2000)
    }


    //执行请下注动画
    playingXiaZhuAnimation() {
        let node = cc.instantiate(this.qingXiaZhu)
        node.parent = this.node.parent
        node.active = true
        setTimeout(() => {
            node.active = false
            node.destroy()
            node.parent.getChildByName('QingXiaZhu').destroy()
        }, 1500)
    }

    async showMembers() {
        let roomInfo = Room.roomItem
        let raceList = RaceManage.raceList
        let memberList = GameMemberManage.gameMenmberList
        let isLandlordFind = false
        let leftMembers: any[] = []
        let rightMembers: any[] = []
        let oningRaceNum = Room.roomItem.oningRaceNum
        let landLordId = raceList[oningRaceNum].landlordId
        if (landLordId === '' || landLordId === null) {
            landLordId = UserManage.userInfo.id
        }
        if (landLordId === this.onLandlordSiteUserId) { //这个地方存在一个bug 地主没变 但是成员变了 就不会刷新
            cc.log('地主位置上人员没有变动，不换位置')
            return
        }
        this.clearOldMember()
        memberList.forEach((item: GameMemberItem): void => {
            if (item.userId === landLordId) {
                let node = cc.instantiate(this.playUserIcon)
                node.name = item.userId
                node.parent = this.node.parent.getChildByName('Member_landlord')
                this.onLandlordSiteUserId = item.userId
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
                    this.onLandlordSiteUserId = item.userId
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
