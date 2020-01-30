const { ccclass, property } = cc._decorator;
import UserManage from '../../store/User/UserManage'
import { eventBus } from '../../common/EventBus'
import { NoticeType, NoticeData, RaceState, EventType, roomState, EnterRoomModel, LocalNoticeEventPara, LocalNoticeEventType, ResponseStatus, EnterRoomFail, ResponseData, TipDialogParam, TipDialogButtonAction, raceResultData } from '../../common/Const'
import { getFaPaiLocation } from '../../common/Util'
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage'
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


    @property(cc.Sprite)
    showTrendButton: cc.Sprite = null;

    start() {
        RoomManage.reSet() //清楚上次房间的数据记录
        if (ConfigManage.isBackMusicOpen()) {
            this.backMusic.play()
        }
        let enterRoomParam = RoomManage.getEnterRoomParam()
        let isEmulatorRoom = enterRoomParam.model === EnterRoomModel.EMULATOR_ROOM ? true : false
        this.controller = new RollControler(cc, isEmulatorRoom, this)
        if (isEmulatorRoom) {
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
        this.controller.start()
        this.initShowAction()
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

    //初始进入房间执行的显示行为
    async initShowAction() {
        if (RoomManage.roomItem.roomState == roomState.CLOSE) {
            let roomResult = await RoomManage.getRoomResult(RoomManage.roomItem.id, RoomManage.roomItem.playCount - 1)
            let list = roomResult.extObject.data as raceResultData[]
            RaceManage.setGameOverResultList(list)
            RoomManage.roomItem.roomState = roomState.CLOSE
            return
        }
        if (RoomManage.roomItem.roomState == roomState.PLAYING) {
            this.showRaceSncyTimePanel()
        }
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
        let dialogParam = {
            sureButtonShow: true, cancelButtonShow: false, content: '', cancelButtonAction: null,
            sureButtonAction: TipDialogButtonAction.OUT_ROOM
        } as TipDialogParam
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

        this.setButton.node.on(cc.Node.EventType.TOUCH_START, () => {
            cc.log('设置按钮被点击')
            var node = cc.instantiate(this.SetPanel)
            node.parent = this.node
            node.setPosition(0, 0);
            node.active = true
        })
    }

    scoketFailTip() {
        let node = cc.instantiate(this.tipDialog)
        let scriptOb = node.getComponent('TipDialog')
        node.parent = this.node
        let dialogParam = {
            sureButtonShow: true, cancelButtonShow: true, content: '房间连接失败，是否重新连接？',
            cancelButtonAction: TipDialogButtonAction.OUT_ROOM, sureButtonAction: TipDialogButtonAction.SOCKET_CONNECT
        } as TipDialogParam
        scriptOb.tipDialogShow(dialogParam)
    }

    //返回大厅行为
    execBackLobby() {
        cc.log('退出到主页')
        this.controller.close()
        this.controller = null
        cc.director.loadScene("LobbyScene");
        this.destroy()
    }

    showRoomResultPanel() {
        cc.log('我是房间面板，我收到所有比赛结束通知，我准备显示房间比赛分数统计面板')
        this.adjustBeforeRaceStateChange(RaceState.FINISHED)
        var node = cc.instantiate(this.roomResultPanel)
        node.parent = this.node
        node.setPosition(0, -70);
        node.active = true
    }

    //状态改变前，清理刷新显示
    adjustBeforeRaceStateChange(stateVal: RaceState) {
        try {
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
        } catch (e) {
            cc.log(e)
        }
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

    showRaceSncyTimePanel() {
        var node = cc.instantiate(this.middleTopTimePanel)
        node.name = 'MiddleTopTimePanel'
        node.parent = this.node
        node.setPosition(-215, 218);
        node.getComponent('MiddleTopTimePanel').waitRaceSync()
    }

    showMiddleTopTimePanel() {
        var node = cc.instantiate(this.middleTopTimePanel)
        node.name = 'MiddleTopTimePanel'
        node.parent = this.node
        node.setPosition(-215, 218);
        node.getComponent('MiddleTopTimePanel').betTimeShow()
    }

    showMiddleTopScorePanel() {
        let node = cc.instantiate(this.middleTopScorePanel)
        node.name = 'MiddleTopScorePanel'
        node.parent = this.node
        node.setPosition(15, 258);
        node.active = true
    }

    destroyMiddleTopScorePanel() {
        let node = this.node.getChildByName('MiddleTopScorePanel')
        if (node != null) {
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
        try {
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
        } catch (e) { }
    }

    // update (dt) {}
}
