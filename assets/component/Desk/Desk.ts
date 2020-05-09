/* 牌桌
 * 功能：1、提供桌面显示 2、提供桌位的坐标 3、提供天、地、中等位置放置chip的中心点坐标
 * 3、提供出结果后，桌面的提示动画  4、提供用户图标显示管理
 */
const { ccclass, property } = cc._decorator;
import GameMemberManage from '../../store/GameMember/GameMemberManage'
import GameMemberItem from '../../store/GameMember/GameMemberItem'
import { EventType, LocalNoticeEventType, LocalNoticeEventPara, CompareDxRe, MemberInChairData, GameMember, BetChipChangeInfo, betLocaion, DiceCountInfo, TableLocationType, roomState, WordMessage, Coordinate, MajhongValueType } from '../../common/Const'
import { eventBus } from '../../common/EventBus'
import { randEventId, getMajhongValueType } from '../../common/Util'
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage';
import ChairManage from './ChairManage';
import { getLocationByLocaitonType } from '../DealMachine/DealMachineBase';
import ConfigManage from '../../store/Config/ConfigManage';

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

    @property(cc.AudioSource)
    chipBetVoice: cc.AudioSource = null //硬币声音语音

    @property(cc.Prefab)
    private majongResultLabel: cc.Prefab = null  //麻将分数文字标签

    @property(cc.AudioSource)
    qingxiazhuVoice: cc.AudioSource = null //请下注语音

    mahjongResulNodes: any[] = [] //麻将结果文字标签节点，需要在结束后销毁，所以保存实例化node

    @property(cc.Sprite)
    skyLineSprite: cc.Sprite = null

    @property(cc.Sprite)
    skyRacecLineSprite: cc.Sprite = null

    @property(cc.Sprite)
    middleLineSprite: cc.Sprite = null
    @property(cc.Sprite)
    middleRacecLineSprite: cc.Sprite = null

    @property(cc.Sprite)
    landLineSprite: cc.Sprite = null
    @property(cc.Sprite)
    landRacecLineSprite: cc.Sprite = null

    private chairManage: ChairManage

    @property(cc.Prefab)
    private erBaGangAnimation: cc.Prefab = null //二八杠动画特效
    @property(cc.Prefab)
    private biShiAnimation: cc.Prefab = null //鄙十动画特效
    @property(cc.Prefab)
    private duiZiAnimation: cc.Prefab = null //对子动画特效

    private scheduleOnceTip = null //桌子中间显示提示计时器
    start() {
        this.chairManage = new ChairManage(cc, this.playUserIcon)
        this.showMembers()
        this.addEventListener()
    }

    updateTrendLine() {
        let onRaceNum = RoomManage.roomItem.oningRaceNum === null ? 0 : RoomManage.roomItem.oningRaceNum
        let i = 0
        let skyWinCount = 0
        let middleWinCount = 0
        let landWinCount = 0
        for (; i <= onRaceNum; i++) {
            let result = this.getRaceResult(i)
            if (result[0]) {
                skyWinCount = skyWinCount + 1
            }
            if (result[1]) {
                middleWinCount = middleWinCount + 1
            }
            if (result[2]) {
                landWinCount = landWinCount + 1
            }
        }
        let raceLineLen = 200 * (RoomManage.roomItem.oningRaceNum + 1) / RoomManage.roomItem.playCount
        this.skyRacecLineSprite.node.width = raceLineLen
        this.middleRacecLineSprite.node.width = raceLineLen
        this.landRacecLineSprite.node.width = raceLineLen
        this.skyLineSprite.node.width = 200 * skyWinCount / RoomManage.roomItem.playCount
        this.middleLineSprite.node.width = 200 * middleWinCount / RoomManage.roomItem.playCount
        this.landLineSprite.node.width = 200 * landWinCount / RoomManage.roomItem.playCount
    }

    getRaceResult(raceNum: number) {
        let race = RaceManage.raceList[raceNum]
        let skyWin = race.getLocationResult(betLocaion.SKY) === CompareDxRe.BIG ? true : false
        let middleWin = race.getLocationResult(betLocaion.MIDDLE) === CompareDxRe.BIG ? true : false
        let landWin = race.getLocationResult(betLocaion.LAND) === CompareDxRe.BIG ? true : false
        return [skyWin, middleWin, landWin]


    }

    cleanMahjongResulNodes() {
        this.mahjongResulNodes.forEach((item: any) => {
            item.active = false
            item.destroy()
        })
        this.mahjongResulNodes = []
    }
    onLoad() {
        //cc.dynamicAtlasManager.insertSpriteFrame(spriteFrame); //动态合图
    }

    //请下注之桌子闪动动画
    deskShanDong() {
        let node = this.node.getChildByName('DeskShanDong')
        this.schedule(() => {
            node.active = node.active ? false : true
        }, 0.3, 3, 0.1); //间隔时间s，重复次数，延迟时间s //执行次数=重复次数+1
    }

    showDeskMiddleTip(wordString: string) {
        let theNode = this.node.getChildByName('OverBetLimitTip')
        theNode.getComponents(cc.Label)[0].string = wordString
        if (!theNode.active) {
            theNode.active = true
        }
        if (this.scheduleOnceTip != null) {
            this.unschedule(this.scheduleOnceTip)
            this.scheduleOnceTip = null
        }
        this.scheduleOnceTip = this.scheduleOnce(() => {
            this.node.getChildByName('OverBetLimitTip').active = false
            this.scheduleOnceTip = null
        }, 3);
    }

    addEventListener() {
        eventBus.on(EventType.LANDLORD_CAHNGE_EVENT, randEventId(), (landlordId: string): void => {
            //cc.log('桌子接收当前比赛有庄设置,将该用户挪动到地主椅子')
            this.chairManage.moveToLandlordChair(landlordId)
        })

        eventBus.on(EventType.BET_CANCE_NOTICE, randEventId(), (info: BetChipChangeInfo): void => {
            this.node.getChildByName('SkyPart').getComponent('DeskPart').betCancel(info)
            this.node.getChildByName('MiddlePart').getComponent('DeskPart').betCancel(info)
            this.node.getChildByName('LandPart').getComponent('DeskPart').betCancel(info)
            this.node.getChildByName('SkyCornerPart').getComponent('DeskPart').betCancel(info)
            this.node.getChildByName('BridgPart').getComponent('DeskPart').betCancel(info)
            this.node.getChildByName('LandCornerPart').getComponent('DeskPart').betCancel(info)
        })

        eventBus.on(EventType.NEW_MEMBER_IN_ROOM, randEventId(), (newMember: GameMember): void => { //TODO 这个位置要优化
            //cc.log('我是桌子，我收到新玩家加入的本地通知,我将玩家入座')
            if (this.chairManage.getChairByUserId(newMember.userId) == null) {
                let member = {
                    userId: newMember.userId, userName: newMember.nick, state: newMember.state, xiaZhuVal: 0,
                    userIcon: newMember.icon
                } as MemberInChairData
                this.chairManage.inChair(member)
            }
        })

        eventBus.on(EventType.MEMBER_DELETE_FROM_ROOM, randEventId(), (userId: string): void => {
            //cc.log('我是桌子，我收到玩家退出房间通知')
            if (RoomManage.roomItem.roomState === roomState.OPEN) {
                cc.log('游戏没开，将玩家从座位上踢出，用户:' + userId)
                this.chairManage.outChair(userId)
            }
        })

        eventBus.on(EventType.LOCAL_NOTICE_EVENT, randEventId(), (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.OPEN_CARD_FINISHED_NOTICE:
                    this.updateTrendLine()
                    this.winFocusAmination()
                    this.scheduleOnce(() => {
                        this.playingBiDaXiaAnimation((): void => { })
                    }, 0.3);
                    let isSuccess = this.node.parent.getChildByName('XiaZhu').getComponent('XiaZhu').backAllChipe()
                    if (ConfigManage.isTxMusicOpen() && isSuccess) {
                        this.chipBetVoice.play()
                    }
                    this.scheduleOnce(() => {
                        //cc.log('我是桌子，比大小动画执行完毕，我发出比大小动画结束通知')
                        this.node.parent.getChildByName('XiaZhu').getComponent('XiaZhu').destroyDeskChip()
                        eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.SHOW_DOWN_ANIMATION_FINISHED_NOTICE } as LocalNoticeEventPara)
                    }, ConfigManage.showResultKeepTime());
                    break
                case LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE:
                    let tableLocationType = info.info as TableLocationType
                    let majongScore = RaceManage.raceList[RoomManage.roomItem.oningRaceNum].getMahjongScore(tableLocationType)
                    this.toMahjongValueLabelShow(tableLocationType, majongScore) //麻将值文字 显示
                    this.toPlayResultAnimation(tableLocationType, majongScore)
                    break
                case LocalNoticeEventType.PLAY_AUDIO_NOT_SUPPORT:
                    this.showDeskMiddleTip(WordMessage.audio_not_support)
                    break
            }
        })

        eventBus.on(EventType.BET_CHIP_CHANGE_EVENT, randEventId(), (betInfo: BetChipChangeInfo): void => {
            this.deskPartToBet(betInfo)
        })
    }

    //桌子赢模块闪动提示
    winFocusAmination() {
        this.node.getChildByName('SkyPart').getComponent('DeskPart').winFocusAmination()
        this.node.getChildByName('MiddlePart').getComponent('DeskPart').winFocusAmination()
        this.node.getChildByName('LandPart').getComponent('DeskPart').winFocusAmination()
        this.node.getChildByName('SkyCornerPart').getComponent('DeskPart').winFocusAmination()
        this.node.getChildByName('BridgPart').getComponent('DeskPart').winFocusAmination()
        this.node.getChildByName('LandCornerPart').getComponent('DeskPart').winFocusAmination()
    }

    //对应文字麻将点数文字显示
    toMahjongValueLabelShow(tableLocationType: TableLocationType, majongScore: DiceCountInfo) {
        let location = getLocationByLocaitonType(tableLocationType)
        let node = cc.instantiate(this.majongResultLabel)
        node.parent = cc.find('Canvas/Desk')
        node.setPosition(location.x, location.y - 20);
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
            //cc.log('下注异常，没有找到位置')
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
            //cc.log('显示通赔或者通杀')
            middleResultAmimation = cc.instantiate(this.middleResultWenZi)
            middleResultAmimation.parent = this.node
            middleResultAmimation.active = true
        }
        this.scheduleOnce(() => {
            if (middleResultAmimation !== null) {
                middleResultAmimation.destroy()
                //cc.log('关闭通赔通杀显示面板')
            }
            func()
        }, 1.5);
    }

    //显示麻将结果动画
    toPlayResultAnimation(tableLocation: TableLocationType, majongScore: DiceCountInfo) {
        let actionAnimation = null
        if (getMajhongValueType(majongScore) == MajhongValueType.ER_BA_GANG) {
            actionAnimation = this.erBaGangAnimation
        }
        if (getMajhongValueType(majongScore) == MajhongValueType.BI_SHI) {
            actionAnimation = this.biShiAnimation
        }
        if (getMajhongValueType(majongScore) == MajhongValueType.DUI_ZI) {
            actionAnimation = this.duiZiAnimation
        }
        if(actionAnimation == null){
            return
        }
        let roomOb = cc.find('Canvas').getComponent('RollRoomScene')
        let node = cc.instantiate(actionAnimation)
        node.parent = roomOb.node
        let locationSet = { x: 0, y: 0 } as Coordinate
        if (tableLocation == TableLocationType.LAND) {
            locationSet.x = 213
            locationSet.y = 78
        } else if (tableLocation == TableLocationType.LANDLORD) {
            locationSet.x = 11
            locationSet.y = 85
        } else if (tableLocation == TableLocationType.MIDDLE) {
            locationSet.x = 5
            locationSet.y = -72
        } else {
            locationSet.x = -213
            locationSet.y = 78
        }
        node.x = locationSet.x
        node.y = locationSet.y
        node.active = true
        node.getComponents(cc.Animation)[0].play()
        this.scheduleOnce(() => {
            node.getComponents(cc.Animation)[0].stop()
            node.active = false
            node.destroy()
        }, 3.5);
    }

    //执行请下注动画
    playingXiaZhuAnimation() {
        if (ConfigManage.isTxMusicOpen()) {
            this.qingxiazhuVoice.play()
        }
        let node = cc.instantiate(this.qingXiaZhu)
        node.parent = this.node
        this.scheduleOnce(() => {
            try {
                node.destroy()
            } catch (e) { }
        }, 1.5);
    }

    //初始显示所有用户
    showMembers() {
        try {
            this.chairManage.clearAllChair()
            let memberList = GameMemberManage.gameMenmberList === null ? [] : GameMemberManage.gameMenmberList
            let landlordId = RaceManage.raceList[RoomManage.roomItem.oningRaceNum].landlordId
            if (landlordId != null && landlordId != '') {
                let landlordInfo = GameMemberManage.getGameMemberByUserId(landlordId)
                if (landlordInfo != null) {
                    this.chairManage.inChair({
                        userId: landlordInfo.userId, userName: landlordInfo.nick,
                        userIcon: landlordInfo.icon,
                        state: landlordInfo.state,
                        xiaZhuVal: 0
                    } as MemberInChairData)
                } else {
                    //cc.log('庄家数据异常')
                }
            }
            memberList.forEach((item: GameMemberItem) => {
                if (item.userId != landlordId) {
                    let member = {
                        userId: item.userId, userName: item.nick,
                        userIcon: item.icon,
                        state: item.state,
                        xiaZhuVal: 0
                    } as MemberInChairData
                    this.chairManage.inChair(member)
                }
            })
        } catch (e) { //cc.log(e) }
        }
    }
