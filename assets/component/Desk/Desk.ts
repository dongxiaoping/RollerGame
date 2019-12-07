/* 牌桌
 * 功能：1、提供桌面显示 2、提供桌位的坐标 3、提供天、地、中等位置放置chip的中心点坐标
 * 3、提供出结果后，桌面的提示动画  4、提供用户图标显示管理
 */
const { ccclass, property } = cc._decorator;
import GameMemberManage from '../../store/GameMember/GameMemberManage'
import GameMemberItem from '../../store/GameMember/GameMemberItem'
import { EventType, RaceStateChangeParam, RaceState, LocalNoticeEventType, LocalNoticeEventPara, CompareDxRe, MemberInChairData, GameMember, BetChipChangeInfo, betLocaion, DiceCountInfo, TableLocationType } from '../../common/Const'
import { eventBus } from '../../common/EventBus'
import { randEventId } from '../../common/Util'
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage';
import ChairManage from './ChairManage';
import { getLocationByLocaitonType } from '../DealMachine/DealMachineBase';
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

    @property(cc.Prefab)
    private majongResultLabel: cc.Prefab = null  //麻将分数文字标签

    @property(cc.AudioSource)
    qingxiazhu: cc.AudioSource = null //请下注语音

    mahjongResulNodes: any[] = [] //麻将结果文字标签节点，需要在结束后销毁，所以保存实例化node


    private chairManage: ChairManage;
    start() {
        this.chairManage = new ChairManage(cc, this.playUserIcon)
        this.showMembers()
        this.addEventListener()
    }

    cleanMahjongResulNodes() {
        this.mahjongResulNodes.forEach((item: any) => {
            item.active = false
            item.destroy()
        })
        this.mahjongResulNodes = []
    }

    showBetLimitTip() {
        let node = this.node.getChildByName('OverBetLimitTip')
        if (node.active) {
            return
        }
        node.active = true
        this.scheduleOnce(() => {
            this.node.getChildByName('OverBetLimitTip').active = false
        }, 3);
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
                    this.deskPartsToOpen()
                    this.playingXiaZhuAnimation()
                    break
                case RaceState.FINISHED:
                    this.deskPartsToClean()
                    this.cleanMahjongResulNodes()
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
                case LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE:
                    let tableLocationType = info.info as TableLocationType
                    let majongScore = RaceManage.raceList[RoomManage.roomItem.oningRaceNum].getMahjongScore(tableLocationType)
                    this.toMahjongValueLabelShow(tableLocationType, majongScore)
                    break
            }
        })

        eventBus.on(EventType.BET_CHIP_CHANGE_EVENT, randEventId(), (betInfo: BetChipChangeInfo): void => {
            this.deskPartToBet(betInfo)
        })
    }

    //对应文字麻将点数文字显示
    toMahjongValueLabelShow(tableLocationType: TableLocationType, majongScore: DiceCountInfo) {
        let location = getLocationByLocaitonType(tableLocationType)
        let node = cc.instantiate(this.majongResultLabel)
        node.parent = this.node.parent
        node.setPosition(location.x, location.y - 50);
        node.getComponent('MahjongResultLabel').showResultWenZi(majongScore)
        node.active = true
        this.mahjongResulNodes.push(node)
    }



    //向指定位置下注
    deskPartToBet(betInfo: BetChipChangeInfo) {
        let betLocationType = betInfo.betLocation
        if (betLocationType === betLocaion.SKY) {
            this.node.getChildByName('SkyPart').getComponent('DeskPart').toBet(betInfo)
        } else if (betLocationType === betLocaion.MIDDLE) {
            this.node.getChildByName('MiddlePart').getComponent('DeskPart').toBet(betInfo)
        } else if (betLocationType === betLocaion.LAND) {
            this.node.getChildByName('LandPart').getComponent('DeskPart').toBet(betInfo)
        } else if (betLocationType === betLocaion.SKY_CORNER) {
            this.node.getChildByName('SkyCornerPart').getComponent('DeskPart').toBet(betInfo)
        } else if (betLocationType === betLocaion.BRIDG) {
            this.node.getChildByName('BridgPart').getComponent('DeskPart').toBet(betInfo)
        } else if (betLocationType === betLocaion.LAND_CORNER) {
            this.node.getChildByName('LandCornerPart').getComponent('DeskPart').toBet(betInfo)
        } else {
            cc.log('下注异常，没有找到位置')
        }

    }

    deskPartsToClean() {
        this.node.getChildByName('SkyPart').getComponent('DeskPart').toClearn()
        this.node.getChildByName('MiddlePart').getComponent('DeskPart').toClearn()
        this.node.getChildByName('LandPart').getComponent('DeskPart').toClearn()
        this.node.getChildByName('SkyCornerPart').getComponent('DeskPart').toClearn()
        this.node.getChildByName('BridgPart').getComponent('DeskPart').toClearn()
        this.node.getChildByName('LandCornerPart').getComponent('DeskPart').toClearn()
    }

    deskPartsToOpen() {
        this.node.getChildByName('SkyPart').getComponent('DeskPart').toOpen()
        this.node.getChildByName('MiddlePart').getComponent('DeskPart').toOpen()
        this.node.getChildByName('LandPart').getComponent('DeskPart').toOpen()
        this.node.getChildByName('SkyCornerPart').getComponent('DeskPart').toOpen()
        this.node.getChildByName('BridgPart').getComponent('DeskPart').toOpen()
        this.node.getChildByName('LandCornerPart').getComponent('DeskPart').toOpen()
    }

    //比大小动画 比大小动画结束回调
    playingBiDaXiaAnimation(func: any) {
        let oningNum = RoomManage.roomItem.oningRaceNum
        let race = RaceManage.raceList[oningNum]
        let middleResultAmimation: any = null
        if ((race.skyResult === CompareDxRe.BIG && race.middleResult === CompareDxRe.BIG &&
            race.landResult === CompareDxRe.BIG) || (race.skyResult === CompareDxRe.SMALL &&
                race.middleResult === CompareDxRe.SMALL && race.landResult === CompareDxRe.SMALL)) {
            cc.log('显示通赔或者通杀')
            middleResultAmimation = cc.instantiate(this.middleResultWenZi)
            middleResultAmimation.parent = this.node.parent
            middleResultAmimation.active = true
        }
        let timeSet = RoomManage.getShowDownTime()
        this.scheduleOnce(() => {
            if (middleResultAmimation !== null) {
                middleResultAmimation.destroy()
                cc.log('关闭通赔通杀显示面板')
            }
            func()
        }, timeSet - 7.5);//麻将的翻牌动画固定7.5s
    }


    //执行请下注动画
    playingXiaZhuAnimation() {
        this.qingxiazhu.play()
        let node = cc.instantiate(this.qingXiaZhu)
        node.parent = this.node.parent
        node.active = true
        this.scheduleOnce(() => {
            try {
                node.active = false
                node.destroy()
                node.parent.getChildByName('QingXiaZhu').destroy()
            } catch (e) { }
        }, 1.5);
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
