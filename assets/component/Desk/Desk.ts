/* 牌桌
 * 功能：1、提供桌面显示 2、提供桌位的坐标 3、提供天、地、中等位置放置chip的中心点坐标
 * 3、提供出结果后，桌面的提示动画  4、提供用户图标显示管理
 */
const { ccclass, property } = cc._decorator;
import GameMemberManage from '../../store/GameMember/GameMemberManage'
import GameMemberItem from '../../store/GameMember/GameMemberItem'
import { EventType, RaceStateChangeParam, RaceState, LocalNoticeEventType, LocalNoticeEventPara, CompareDxRe, MemberInChairData, GameMember } from '../../common/Const'
import RoomItem from '../../store/Room/RoomItem'
import Room from '../../store/Room/RoomManage'
import { eventBus } from '../../common/EventBus'
import { randEventId } from '../../common/Util'
import RaceManage from '../../store/Races/RaceManage'
import RaceItem from '../../store/Races/RaceItem'
import RoomManage from '../../store/Room/RoomManage';
import UserManage from '../../store/User/UserManage';
import ChairManage from './ChairManage';
@ccclass
export default class Desk extends cc.Component {

    @property(cc.Prefab)
    private playUserIcon: cc.Prefab = null //玩家icon
    @property(cc.Sprite)
    private deskBg: cc.Sprite = null

    @property(cc.Prefab)
    private middleResultWenZi: cc.Prefab = null //比大小通杀 通赔通知

    onLandlordSiteUserId: string = null //当前坐在地主位置上的用户ID

    @property(cc.Prefab)
    private qingXiaZhu: cc.Prefab = null //请下注文字图

    private chairManage: ChairManage;
    start() {
        this.chairManage = new ChairManage(cc, this.playUserIcon)
        this.showMembers()
        this.addEventListener()
    }

    addEventListener() {
        eventBus.on(EventType.LANDLORD_CAHNGE_EVENT, randEventId(), (landlordId: string): void => {
            cc.log('桌子接收到地主改变通知,将该用户挪动到地主椅子')
            this.chairManage.moveToLandlordChair(landlordId)
        })

        eventBus.on(EventType.NEW_MEMBER_IN_ROOM, randEventId(), (newMember: GameMember): void => {
            cc.log('我是桌子，我收到新玩家加入的本地通知,我将玩家入座')
            let member = {
                userId: newMember.userId, userName: newMember.nick,
                userIcon: newMember.icon
            } as MemberInChairData
            this.chairManage.inChair(member)
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
                    cc.log('我是桌子，开牌动画结束，我开始执行比大小动画')
                    this.playingBiDaXiaAnimation((): void => {
                        cc.log('我是桌子，比大小动画执行完毕，我发出比大小动画结束通知')
                        eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.SHOW_DOWN_ANIMATION_FINISHED_NOTICE } as LocalNoticeEventPara)
                    })
                    break
            }
        })


    }

    //比大小动画 比大小动画结束回调
    playingBiDaXiaAnimation(func: any) {
        let oningNum = RoomManage.roomItem.oningRaceNum
        let race = RaceManage.raceList[oningNum]
        let showNode: any = null
        if ((race.skyResult === CompareDxRe.BIG && race.middleResult === CompareDxRe.BIG &&
            race.landResult === CompareDxRe.BIG) || (race.skyResult === CompareDxRe.SMALL &&
                race.middleResult === CompareDxRe.SMALL && race.landResult === CompareDxRe.SMALL)) {
            cc.log('显示通赔或者通杀')
            showNode = cc.instantiate(this.middleResultWenZi)
            showNode.parent = this.node.parent
            showNode.active = true
        }
        setTimeout(() => {
            if (showNode !== null) {
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

    showMembers() {
        this.chairManage.clearAllChair()
        let memberList = GameMemberManage.gameMenmberList
        memberList.forEach((item: GameMemberItem) => {
            let member = {
                userId: item.userId, userName: item.nick,
                userIcon: item.icon
            } as MemberInChairData
            this.chairManage.inChair(member)
        })
    }
}
