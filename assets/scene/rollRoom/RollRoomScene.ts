const { ccclass, property } = cc._decorator;
import UserManage from '../../store/User/UserManage'
import { eventBus } from '../../common/EventBus'
import { NoticeType, NoticeData, RaceState, EventType, TableLocationType, roomState, RaceStateChangeParam, EnterRoomModel, LocalNoticeEventPara, LocalNoticeEventType, ResponseStatus, EnterRoomFail, ResponseData, TipDialogParam, TipDialogButtonAction } from '../../common/Const'
import { randEventId, getFaPaiLocation, touchMoveEvent } from '../../common/Util'
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage'
import RollEmulator from "../../common/RollEmulator"
import RollControler from '../../common/RollControler'
import ConfigManage from '../../store/Config/ConfigManage'
import { roomGameConfig } from '../../common/RoomGameConfig';

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


    @property(cc.Sprite)
    showTrendButton: cc.Sprite = null;

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
        this.enterWebGame()
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
        webSocketManage.openWs(() => {
            cc.log('socket连接成功，发送连接成功本地通知')
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                type: LocalNoticeEventType.SOCKET_CONNECT_NOTICE,
                info: true
            } as LocalNoticeEventPara)
        }, () => {
            cc.log('socket连接失败，发送连接失败本地通知')
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                type: LocalNoticeEventType.SOCKET_CONNECT_NOTICE,
                info: false
            } as LocalNoticeEventPara)
        })
    }

    showEnterRoomFailTip(info: ResponseData) {
        if (info.message === EnterRoomFail.diamond_not_enough) {
            cc.log('钻不够')
            return
        }
        let message = info.message as EnterRoomFail
        let node = cc.instantiate(this.tipDialog)
        let scriptOb = node.getComponent('TipDialog')
        node.parent = this.node
        node.active = true
        let dialogParam = { sureButtonShow: true, cancelButtonShow: false, content: '', cancelButtonAction: null, sureButtonAction: null } as TipDialogParam
        try {
            dialogParam.content = EnterRoomFail[message]
        } catch (e) {
            dialogParam.content = '进入异常'
        }
        scriptOb.tipDialogShow(dialogParam)
    }

    showTopLeftRaceInfo() {
        let roomInfo = RoomManage.roomItem
        this.showRoomNum.string = '房间号：' + roomInfo.id
        this.showPlayMode.string = '上庄模式：抢庄'
        this.showBetLimit.string = '下注上限：' + roomInfo.costLimit
        this.showPlayCountLimit.string = '当前牌局：' + (roomInfo.oningRaceNum + 1) + '/' + roomInfo.playCount
    }

    enterEmulatorRoom() {
        this.controller = new RollEmulator()
        this.controller.start()
        this.initRoom()
        this.showStartButton()
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

        this.showTrendButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.showTrendButton.node.active = false
            let trendMap = this.node.getChildByName('TrendMap')
            trendMap.active = true
            trendMap.getComponent('TrendMap').show()
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

        eventBus.on(EventType.LOCAL_NOTICE_EVENT, randEventId(), (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.ROLL_DICE_FINISHED_NOTICE: //摇色子结束
                    this.cleanRollDice()
                    this.beginDeal()
                    break
                case LocalNoticeEventType.TO_LOBBY_EVENT:
                    cc.log('退出到主页')
                    this.controller.close()
                    this.controller = null
                    cc.director.loadScene("LobbyScene");
                    this.destroy()
                    break
                case LocalNoticeEventType.SHOW_DOWN_ANIMATION_FINISHED_NOTICE: //比大小动画结束通知
                    this.userScoreLabel.string = RaceManage.getUserScore(UserManage.userInfo.id) + ''
                    let enterRoomParam = RoomManage.getEnterRoomParam()
                    if (enterRoomParam.model === EnterRoomModel.EMULATOR_ROOM) {
                        let raceResultListOne = this.controller.getRaceResultList(RoomManage.roomItem.oningRaceNum)
                        RaceManage.raceList[RoomManage.roomItem.oningRaceNum].setRaceResultList(raceResultListOne)
                        this.scheduleOnce(() => {
                            cc.log('显示单局比赛结果显示完毕，我将单场比赛状态改为结束')
                            RaceManage.changeRaceState(RaceState.FINISHED)
                        }, ConfigManage.getShowResultTime());
                    }
                    let node = this.node.getChildByName('MiddleTopScorePanel')
                    if (node != null) {
                        node.active = false
                        node.destroy()
                    }
                    cc.log('控制器公布结果')
                    this.toShowRaceResultPanel()
                    this.closeXiaZhuPanel()
                    break
                case LocalNoticeEventType.BACK_MUSIC_STATE_CHANGE_NOTICE:
                    let isOpen = info.info
                    if (isOpen) {
                        this.backMusic.play()
                    } else {
                        this.backMusic.stop()
                    }
                    break
                case LocalNoticeEventType.TO_SHOW_START_BUTTON:
                    this.showStartButton()
                    break
                case LocalNoticeEventType.SOCKET_CONNECT_NOTICE:
                    if (info.info) { //连接成功通知
                        cc.log('接到socket连接通知，进入socket房间')
                        this.controller.enterSocketRoom()
                    } else {
                        cc.log('接到socket连接失败通知，弹出提示框')
                        let node = cc.instantiate(this.tipDialog)
                        let scriptOb = node.getComponent('TipDialog')
                        node.parent = this.node
                        let dialogParam = {
                            sureButtonShow: true, cancelButtonShow: true, content: '房间连接失败，是否重新连接？',
                            cancelButtonAction: TipDialogButtonAction.OUT_ROOM, sureButtonAction: TipDialogButtonAction.SOCKET_CONNECT
                        } as TipDialogParam
                        scriptOb.tipDialogShow(dialogParam)
                    }
                    break

            }
        })
        eventBus.on(EventType.ROOM_STATE_CHANGE_EVENT, randEventId(), (state: roomState): void => {
            switch (state) {
                case roomState.CLOSE:
                    cc.log('我是房间面板，我收到所有比赛结束通知，我准备显示房间比赛分数统计面板')
                    this.adjustBeforeRaceStateChange(RaceState.FINISHED)
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
                case RaceState.CHOICE_LANDLORD:
                    this.adjustBeforeRaceStateChange(RaceState.CHOICE_LANDLORD)
                    this.showChoiceLandLordPanel()
                    break
                case RaceState.DEAL:
                    this.adjustBeforeRaceStateChange(RaceState.DEAL)
                    let kaiShi = cc.instantiate(this.kaiShipTip)
                    this.scheduleOnce(() => {
                        kaiShi.parent = this.node
                        kaiShi.setPosition(0, 0);
                        kaiShi.active = true
                        if (ConfigManage.isTxMusicOpen()) {
                            this.beginVoice.play()
                        }
                        this.scheduleOnce(() => {
                            kaiShi.destroy()
                            this.beginRollDice()
                            this.showXiaZhuPanel()
                        }, roomGameConfig.beginTextShowTime);
                    }, roomGameConfig.timeBeforeBeginText);
                    break
                case RaceState.BET:
                    this.adjustBeforeRaceStateChange(RaceState.BET)
                    this.showXiaZhuPanel()
                    this.node.getChildByName('DealMachine').getComponent('DealMachine').checkAndAddMajong()
                    var node = cc.instantiate(this.middleTopTimePanel)
                    node.name = 'MiddleTopTimePanel'
                    node.parent = this.node
                    node.setPosition(-215, 218);
                    node.active = true

                    var node = cc.instantiate(this.middleTopScorePanel)
                    node.name = 'MiddleTopScorePanel'
                    node.parent = this.node
                    node.setPosition(15, 258);
                    node.active = true
                    break
                case RaceState.SHOW_DOWN:
                    this.adjustBeforeRaceStateChange(RaceState.SHOW_DOWN)
                    this.node.getChildByName('DealMachine').getComponent('DealMachine').checkAndAddMajong()

                    eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: TableLocationType.LANDLORD } as LocalNoticeEventPara)
                    break
                case RaceState.FINISHED:
                    this.adjustBeforeRaceStateChange(RaceState.FINISHED)
                    break
            }
        })

        eventBus.on(EventType.RACING_NUM_CHANGE_EVENT, randEventId(), (num: number): void => {
            let roomInfo = RoomManage.roomItem
            let count = RoomManage.roomItem.oningRaceNum
            this.showPlayCountLimit.string = '当前牌局：' + (count + 1) + '/' + roomInfo.playCount
        })

        eventBus.on(EventType.LANDLORD_CAHNGE_EVENT, randEventId(), (landlordId: string): void => {
            if (landlordId === UserManage.userInfo.id) {
                this.roleSprite.spriteFrame = this.zhuangIcon
            } else {
                this.roleSprite.spriteFrame = this.xianIcon
            }
        })
    }

    //状态改变前，清理刷新显示
    adjustBeforeRaceStateChange(stateVal: RaceState) {
        this.closeChoiceLandLordPanel() // 删除抢庄按钮
        if (stateVal != RaceState.SHOW_DOWN) {
            this.node.getChildByName('Desk').getComponent('Desk').deskPartsToClean() //删除桌子上各方位上的下注信息、focus显示
            this.node.getChildByName('Desk').getComponent('Desk').cleanMahjongResulNodes() //删除麻将结果文字标签
        }
        this.destroyChild('RaceResultPanel') //删除指定场次结果面板
        this.closeStartButton() //删除关闭按钮
        this.cleanRollDice() //删除锺以及色子
        if (stateVal != RaceState.BET && stateVal != RaceState.SHOW_DOWN) {
            this.node.getChildByName('DealMachine').getComponent('DealMachine').cleanMajong() //删除下发的麻将
        }
        if (stateVal != RaceState.SHOW_DOWN) {
            // this.destroyChild('BetChipItem')  //不知道是什么
            this.destroyChild('MiddleTopScorePanel') //删除总下注信息面板
            this.node.getChildByName('XiaZhu').getComponent('XiaZhu').destroyDeskChip() //删除桌上的下注币
        }
        this.destroyChild('MiddleTopTimePanel') //删除倒计时时间面板
    }

    //清空摇色子相关动画
    cleanRollDice() {
        this.destroyChild('RollDice')
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

    //显示抢庄按钮
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

    //删除抢庄按钮
    private closeChoiceLandLordPanel() {
        if (this.node.getChildByName('RapLandlordButton')) {
            this.node.getChildByName('RapLandlordButton').destroy()
        }
    }

    //左下方用户面板显示
    showUserPanel() {
        let userInfo = UserManage.userInfo
        this.userNameLabel.string = userInfo.nick
        this.userScoreLabel.string = RaceManage.getUserScore(userInfo.id) + ''
        cc.loader.load({ url: userInfo.icon, type: 'png' }, (err, img: any) => {//loadRes
            let myIcon = new cc.SpriteFrame(img);
            this.userIcon.spriteFrame = myIcon;
        });
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
        let landlordId = RaceManage.raceList[RoomManage.roomItem.oningRaceNum].landlordId
        if (UserManage.userInfo.id !== landlordId) {
            let node = this.node.getChildByName('XiaZhu')
            node.setPosition(250, -260);
            node.getChildByName('Layout').active = true
            cc.log('显示下注面板')
        }
    }

    //关闭下注面板
    closeXiaZhuPanel() {
        let node = this.node.getChildByName('XiaZhu')
        node.getChildByName('Layout').active = false
    }

    showStartButton() {
        cc.log('显示开始按钮')
        this.closeStartButton()
        var node = cc.instantiate(this.playButtonPrefab)
        node.name = 'PlayButton'
        node.parent = this.node
        node.setPosition(-124.514, -268.949);
        node.active = true
    }

    closeStartButton(): void {
        let ob = this.node.getChildByName('PlayButton')
        if (ob) {
            ob.destroy()
        }
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
