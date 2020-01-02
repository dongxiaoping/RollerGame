const { ccclass, property } = cc._decorator;
import UserManage from '../../store/User/UserManage'
import { eventBus } from '../../common/EventBus'
import { NoticeType, NoticeData, RaceState, EventType, TableLocationType, roomState, RaceStateChangeParam, EnterRoomModel, LocalNoticeEventPara, LocalNoticeEventType, BetChipChangeInfo, ResponseStatus, EnterRoomFail } from '../../common/Const'
import Room from '../../store/Room/RoomManage'
import { randEventId, getFaPaiLocation, touchMoveEvent } from '../../common/Util'
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage'
import RollEmulator from "../../common/RollEmulator"
import RollControler from '../../common/RollControler'
import ConfigManage from '../../store/Config/ConfigManage'
import webSocketManage from '../../common/WebSocketManage'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    private userIcon: cc.Sprite = null //用户图标

    @property(cc.Prefab)
    private rollDicePrefab: cc.Prefab = null  //摇色子

    @property(cc.Prefab)
    private desk: cc.Prefab = null  //桌子

    @property(cc.Sprite)
    private exit: cc.Sprite = null  //退出

    @property(cc.Prefab)
    private playButtonPrefab: cc.Prefab = null //播放按钮

    @property(cc.Prefab)
    private dealMachine: cc.Prefab = null //发牌预制件

    @property(cc.Prefab)
    private xiaZhu: cc.Prefab = null //下注功能预制件

    @property(cc.Prefab)
    private raceResultPanel: cc.Prefab = null //公布单场竞赛结果面板

    @property(cc.Prefab)
    private roomResultPanel: cc.Prefab = null //房间比赛结束分数显示面板

    @property(cc.Prefab)
    private middleTopTimePanel: cc.Prefab = null //下注倒计时面板

    @property(cc.Prefab)
    private middleTopScorePanel: cc.Prefab = null // 顶部下注分数显示面板

    @property(cc.Prefab)
    private rapLandlordButton: cc.Prefab = null // 抢地主按钮

    @property(cc.Prefab)
    private kaiShipTip: cc.Prefab = null // 开始文字

    @property(cc.Prefab)
    SetPanel: cc.Prefab = null; //设置面板

    @property(cc.Prefab)
    private tipDialog: cc.Prefab = null  //提示框

    @property(cc.Label)
    showRoomNum: cc.Label = null; //房间号显示  
    @property(cc.Label)
    showBetLimit: cc.Label = null; //下注限制数显示
    @property(cc.Label)
    showPlayCountLimit: cc.Label = null; //牌局进行信息显示
    @property(cc.Label)
    showPlayMode: cc.Label = null; //上庄模式显示
    @property(cc.Sprite)
    roleSprite: cc.Sprite = null; //当前用户角色类型图标容器
    @property(cc.SpriteFrame)
    zhuangIcon: cc.SpriteFrame = null //庄家类型图标
    @property(cc.SpriteFrame)
    xianIcon: cc.SpriteFrame = null //闲家类型图标

    @property(cc.Label)
    userScoreLabel: cc.Label = null; //当前用户左下方分数值
    @property(cc.Label)
    userNameLabel: cc.Label = null; //当前用户左下方名称

    controller: any = null //游戏控制器

    @property(cc.Sprite)
    setButton: cc.Sprite = null;

    @property(cc.AudioSource)
    backMusic: cc.AudioSource = null; //背景音乐  this.backMusic.play() this.backMusic.pause();

    @property(cc.AudioSource)
    qinQiangZhuangVoice: cc.AudioSource = null;

    @property(cc.AudioSource)
    woQiangVoice: cc.AudioSource = null;

    @property(cc.AudioSource)
    beginVoice: cc.AudioSource = null;

    userWinScore: number = 0
    userXiaZhuScore: number = 0

    start() {
        RoomManage.reSet() //清楚上次房间的数据记录
        if (ConfigManage.isBackMusicOpen()) {
            this.backMusic.play()
        }
        let enterRoomParam = RoomManage.getEnterRoomParam()
        if (enterRoomParam.model === EnterRoomModel.EMULATOR_ROOM) {
            cc.log('进入了模拟房间')
            this.enterEmulatorRoom()
            cc.director.preloadScene('LobbyScene');//预加载
            return
        }
        webSocketManage.closeWs()
        webSocketManage.openWs(() => {
            this.enterWebGame()
        }, () => { })
        cc.director.preloadScene('LobbyScene');//预加载
    }

    onEnable() {
        this.addClickEvent()
    }

    playWoQiangVoice() {
        if (ConfigManage.isTxMusicOpen()) {
            this.woQiangVoice.play()
        }
    }

    async enterWebGame() {
        let enterRoomParam = RoomManage.getEnterRoomParam()
        let userId = enterRoomParam.userId
        let roomId = enterRoomParam.roomId
        if (enterRoomParam.model === EnterRoomModel.SHARE) {
            cc.log('进入了分享房间')
            await UserManage.requestUserInfo()
        }
        let result = await RoomManage.loginRoom(userId, roomId)
        if (result.result === ResponseStatus.FAIL) {
            cc.log('房间不存在或已开始')
            this.showEnterRoomFailTip(result.extObject)
            return
        }
        this.initRoom()
        this.controller = new RollControler()
        this.controller.start()
        //  this.node.getChildByName('WechatShare').active = true
    }

    showEnterRoomFailTip(info: any) {
        let message = info.message as EnterRoomFail
        let node = cc.instantiate(this.tipDialog)
        let scriptOb = node.getComponent('TipDialog')
        node.parent = this.node
        node.active = true
        try {
            scriptOb.showContent(EnterRoomFail[message])
        } catch (e) {
            scriptOb.showContent('进入异常')
        }
    }

    showTopLeftRaceInfo() {
        let roomInfo = RoomManage.roomItem
        this.showRoomNum.string = '房间号：' + roomInfo.id
        this.showPlayMode.string = '上庄模式：抢庄'
        this.showBetLimit.string = '下注上限：' + roomInfo.costLimit
        this.showPlayCountLimit.string = '当前牌局：1/' + roomInfo.playCount
    }

    enterEmulatorRoom() {
        this.controller = new RollEmulator()
        this.controller.start()
        this.initRoom()
        this.changeStartButtonState()
        let landlordId = RaceManage.raceList[0].landlordId
        this.scheduleOnce(() => {
            RaceManage.changeRaceLandlord(landlordId, 8, 0)
        }, 1);
    }

    initRoom() {
        this.showUserPanel()
        this.initXiaZhuPanel()
        this.initMahjongPanel()
        this.initDesk()
        this.showTopLeftRaceInfo()
        this.addListener()
    }

    private initDesk() {
        let node = cc.instantiate(this.desk)
        node.parent = this.node
        node.active = true
    }

    //添加面板上组件的一些响应事件
    private addClickEvent() {
        this.exit.node.on(cc.Node.EventType.TOUCH_END, () => {
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                type: LocalNoticeEventType.TO_LOBBY_EVENT,
                info: null
            } as LocalNoticeEventPara)
        })

        this.node.on(cc.Node.EventType.TOUCH_END, (event: any) => {
            let isTouchMove = touchMoveEvent(event)
            if (isTouchMove) {
                cc.log('滑动事件')
            }
        })
    }

    private addListener() {
        this.setButton.node.on(cc.Node.EventType.TOUCH_START, () => {
            cc.log('设置按钮被点击')
            var node = cc.instantiate(this.SetPanel)
            node.parent = this.node
            node.setPosition(0, 0);
            node.active = true
        })

        eventBus.on(EventType.BET_CHIP_CHANGE_EVENT, randEventId(), (betInfo: BetChipChangeInfo): void => {
            if (betInfo.userId == UserManage.userInfo.id) {
                let costVal = betInfo.toValue - betInfo.fromVal
                this.userXiaZhuScore += costVal
                this.userScoreLabel.string = (this.userWinScore - this.userXiaZhuScore) + ''
            }
        })

        eventBus.on(EventType.BET_CANCE_NOTICE, randEventId(), (info: BetChipChangeInfo): void => {
            if (UserManage.userInfo.id === info.userId) {
                this.userXiaZhuScore -= info.fromVal
                this.userScoreLabel.string = (this.userWinScore - this.userXiaZhuScore) + ''
            }
        })

        eventBus.on(EventType.SOCKET_CREAT_ROOM_SUCCESS, randEventId(), (info: any): void => {
            cc.log('start_game_test:房间收到socket创建虚拟房成功通知，显示开发游戏按钮')
            this.changeStartButtonState()
        })

        eventBus.on(EventType.LOCAL_NOTICE_EVENT, randEventId(), (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.ROLL_DICE_FINISHED_NOTICE: //摇色子结束
                    this.cleanRollDice()
                    break
                case LocalNoticeEventType.TO_LOBBY_EVENT:
                    cc.log('退出到主页')
                    this.controller.close()
                    this.controller = null
                    cc.director.loadScene("LobbyScene");
                    this.destroy()
                    break
                // case LocalNoticeEventType.LOCAL_BE_LANDLORD_RESULT:
                //     cc.log('本地抢地主')
                //     if (ConfigManage.isTxMusicOpen()) {
                //         this.woQiangVoice.play()
                //     }
                //     break
                case LocalNoticeEventType.BACK_MUSIC_STATE_CHANGE_NOTICE:
                    let isOpen = info.info
                    if (isOpen) {
                        this.backMusic.play()
                    } else {
                        this.backMusic.stop()
                    }
                    break
            }
        })
        eventBus.on(EventType.ROOM_STATE_CHANGE_EVENT, randEventId(), (state: roomState): void => {
            switch (state) {
                case roomState.ALL_RACE_FINISHED:
                    cc.log('我是房间面板，我收到所有比赛结束通知，我准备显示房间比赛分数统计面板')
                    var node = cc.instantiate(this.roomResultPanel)
                    node.parent = this.node
                    node.setPosition(0, -70);
                    node.active = true
                    break
            }
        })

        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, randEventId(), (info: RaceStateChangeParam): void => {
            let to = info.toState
            let raceNum = info.raceNum
            switch (to) {
                case RaceState.ROLL_DICE:
                    cc.log('房间收到摇色子指令，开始摇色子流程')
                    let kaiShi = cc.instantiate(this.kaiShipTip)
                    kaiShi.parent = this.node
                    kaiShi.setPosition(0, 0);
                    kaiShi.active = true
                    this.beginVoice.play()
                    this.scheduleOnce(() => {
                        kaiShi.destroy()
                        let landlordId = RaceManage.raceList[raceNum].landlordId
                        this.beginRollDice()
                        if (UserManage.userInfo.id !== landlordId) {
                            cc.log('不是地主,显示下注面板')
                            this.showXiaZhuPanel()
                        } else {
                            cc.log('是地主,不显示下注面板')
                        }
                    }, 2);
                    break
                case RaceState.CHOICE_LANDLORD:
                    cc.log('start_game_test:房间收到选地主指令，开始选地主流程,玩家显示抢地主按钮，到此按钮出现')
                    this.showChoiceLandLordPanel()
                    break
                case RaceState.DEAL:
                    cc.log('房间收到发牌指令，开始发牌流程')
                    this.beginDeal()
                    break
                case RaceState.BET:
                    cc.log('房间收到下注指令，显示下注倒计时面板')
                    var node = cc.instantiate(this.middleTopTimePanel)
                    node.parent = this.node
                    node.setPosition(-215, 218);
                    node.active = true

                    var node = cc.instantiate(this.middleTopScorePanel)
                    node.parent = this.node
                    node.setPosition(15, 258);
                    node.active = true
                    break
                case RaceState.SHOW_DOWN: //这个由控制器来响应
                    let theNode = this.node.getChildByName('MiddleTopTimePanel')
                    if (theNode) {
                        theNode.destroy()
                    }
                    // cc.log('房间收到比大小指令，开始比大小流程')
                    break
                case RaceState.SHOW_RESULT:
                    node = this.node.getChildByName('MiddleTopScorePanel')
                    node.active = false
                    node.destroy()
                    cc.log('控制器公布结果')
                    this.toShowRaceResultPanel()
                    this.closeXiaZhuPanel()
                    break
                case RaceState.FINISHED:
                    cc.log('房间收到比赛结束通知，清空页面上次比赛信息')
                    cc.log('房间收到比赛结束通知，修改当前用户分数显示')
                    let winVal = RaceManage.raceList[RoomManage.roomItem.oningRaceNum].getUserRaceScore(UserManage.userInfo.id)
                    this.userWinScore = this.userWinScore + winVal
                    this.userScoreLabel.string = this.userWinScore + ''
                    this.userXiaZhuScore = 0
                    this.cleanShowResult()
                    this.cleanDeal()
                    this.cleanBet()
                    break
            }
        })

        eventBus.on(EventType.RACING_NUM_CHANGE_EVENT, randEventId(), (num: number): void => {
            let roomInfo = RoomManage.roomItem
            let count = RoomManage.roomItem.oningRaceNum
            this.showPlayCountLimit.string = '当前牌局：' + (count + 1) + '/' + roomInfo.playCount
        })

        eventBus.on(EventType.LANDLORD_CAHNGE_EVENT, randEventId(), (landlordId: string): void => {
            cc.log('接收到地主改变通知')
            let oningRaceNum = RoomManage.roomItem.oningRaceNum //地主改变通知
            if (RaceManage.raceList[oningRaceNum].state !== RaceState.CHOICE_LANDLORD &&
                RaceManage.raceList[oningRaceNum].state !== RaceState.NOT_BEGIN) {
                cc.log('错误！接收到了地主改变通知，但当前房间状态不是选地主')
                return
            }
            if (landlordId === UserManage.userInfo.id) {
                this.roleSprite.spriteFrame = this.zhuangIcon
            } else {
                this.roleSprite.spriteFrame = this.xianIcon
            }
            this.closeChoiceLandLordPanel()
        })
    }

    //清空摇色子相关动画
    cleanRollDice() {
        this.destroyChild('RollDice')
    }

    //清空发牌相关动画
    cleanDeal() {
        this.destroyChildNodeByName('MjDouble' + TableLocationType.LAND)
        this.destroyChildNodeByName('MjDouble' + TableLocationType.LANDLORD)
        this.destroyChildNodeByName('MjDouble' + TableLocationType.MIDDLE)
        this.destroyChildNodeByName('MjDouble' + TableLocationType.SKY)
    }

    //清空下注相关动画
    cleanBet() {
        this.destroyChild('BetChipItem')
    }

    //清空比大小相关动画
    cleanShowDown() {

    }

    //清空结果显示相关动画
    cleanShowResult() {
        this.destroyChild('RaceResultPanel')
    }

    destroyChildNodeByName(nameString: string) {
        let node = this.node.getChildByName(nameString)
        if (node) {
            node.active = false
            node.destroy()
        }
    }

    destroyChild(nameString: string) {
        let nodes = this.node.children
        let i = 0;
        for (; i < nodes.length; i++) {
            if (nodes[i].name === nameString) {
                nodes[i].destroy()
            }
        }
    }

    toShowRaceResultPanel(): void {
        let node = cc.instantiate(this.raceResultPanel)
        node.name = 'RaceResultPanel'
        node.parent = this.node
        node.active = true
    }

    //开始发牌流程
    private beginDeal() {
        let node = this.node.getChildByName('DealMachine')
        let scriptOb = node.getComponent('DealMachine')
        let oningNum = RoomManage.roomItem.oningRaceNum
        let loaction = getFaPaiLocation(RaceManage.raceList[oningNum].points)
        scriptOb.deal(loaction)
    }

    initMahjongPanel() {
        let node = this.node.getChildByName('DealMachine')
        if (!node) {
            node = cc.instantiate(this.dealMachine)
            node.parent = this.node
            node.setPosition(300, 207);
            node.active = true
        }
    }

    //摇色子
    private beginRollDice(): void {
        var node = cc.instantiate(this.rollDicePrefab)
        node.name = 'RollDice'
        node.parent = this.node
        node.setPosition(0, 0);
        node.active = true
    }

    //选地主
    private showChoiceLandLordPanel() {
        let node = this.node.getChildByName('RapLandlordButton')
        if (node) {
            node.active = true
        } else {
            node = cc.instantiate(this.rapLandlordButton)
            node.parent = this.node
            node.setPosition(308, -220);
            node.active = true
        }
        if (ConfigManage.isTxMusicOpen()) {
            this.qinQiangZhuangVoice.play()
        }
    }

    private closeChoiceLandLordPanel() {
        if (this.node.getChildByName('RapLandlordButton')) {
            this.node.getChildByName('RapLandlordButton').destroy()
        }
    }

    //左下方用户面板显示
    showUserPanel() {
        let userInfo = UserManage.userInfo
        let enterRoomParam = RoomManage.getEnterRoomParam()
        this.userNameLabel.string = userInfo.nick
        if (enterRoomParam.model === EnterRoomModel.EMULATOR_ROOM) {
            cc.loader.loadRes(userInfo.icon, (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                this.userIcon.spriteFrame = myIcon;
            })
        } else {
            cc.loader.load({ url: userInfo.icon, type: 'png' }, (err, img: any) => {
                let myIcon = new cc.SpriteFrame(img);
                this.userIcon.spriteFrame = myIcon;
            });
        }
    }

    onLoad() {

    }

    //只有初始化了下注面板，才能有投注动画
    initXiaZhuPanel() {
        var node = cc.instantiate(this.xiaZhu)
        node.parent = this.node
        node.getChildByName('Layout').active = false
        node.active = true
        cc.log('初始化下注功能')
    }
    //显示下注面板
    showXiaZhuPanel() {
        let node = this.node.getChildByName('XiaZhu')
        node.setPosition(250, -260);
        node.getChildByName('Layout').active = true
        cc.log('显示下注面板')
    }

    //关闭下注面板
    closeXiaZhuPanel() {
        let node = this.node.getChildByName('XiaZhu')
        node.getChildByName('Layout').active = false
    }

    changeStartButtonState() {
        cc.log('初始化开始按钮')
        let roomInfo = Room.roomItem
        let userInfo = UserManage.userInfo
        if (userInfo.id === roomInfo.creatUserId && roomInfo.roomState === roomState.OPEN) {
            var node = cc.instantiate(this.playButtonPrefab)
            node.parent = this.node
            node.setPosition(-124.514, -268.949);
            node.active = true
            cc.log('start_game_test:是房主，并且房间游戏没有开始，显示开始游戏按钮')
        } else {
            cc.log('不是房主，或者房间游戏已开始，不显示开始游戏按钮')
        }
    }

    closeStartButton(): void {
        let ob = this.node.getChildByName('PlayButton')
        ob.destroy()
    }
    onDisable() {
        let enterRoomParam = RoomManage.getEnterRoomParam()
        if (enterRoomParam.model !== EnterRoomModel.EMULATOR_ROOM) {
            let notice = {
                type: NoticeType.outRoom, info: {
                    roomId: RoomManage.roomItem.id,
                    userId: UserManage.userInfo.id
                }
            } as NoticeData
            webSocketManage.send(JSON.stringify(notice))
            webSocketManage.closeWs()
            cc.log('我是玩家，我向服务器发起退出房间通知')
        }
    }

    // update (dt) {}
}
