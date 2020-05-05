const { ccclass, property } = cc._decorator;
import UserManage from '../../store/User/UserManage'
import { eventBus } from '../../common/EventBus'
import { ConsoleType, RaceState, EventType, roomState, EnterRoomModel, LocalNoticeEventPara, LocalNoticeEventType, ResponseStatus, EnterRoomFail, ResponseData, TipDialogParam, TipDialogButtonAction, raceResultData, CreateRoomPayModel, EnterRoomParam, WordMessage, voiceNotice } from '../../common/Const'
import { getFaPaiLocation, randEventId, isUrlToGameRoom, getUrlParam, webCookie } from '../../common/Util'
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage'
import RollControler from '../../common/RollControler'
import ConfigManage from '../../store/Config/ConfigManage'
import webSocketManage from '../../common/WebSocketManage'
import GameMemberManage from '../../store/GameMember/GameMemberManage';
import BetManage from '../../store/Bets/BetManage';
import Log from "../../common/Log";
import voiceManage from '../../store/Voice/VoiceManage';

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    private startButton: cc.Button = null //
    @property(cc.Button)
    private stopButton: cc.Button = null //

    @property(cc.Sprite)
    private userIcon: cc.Sprite = null //用户图标

    @property(cc.Prefab)
    private rollDicePrefab: cc.Prefab = null  //摇色子

    @property(cc.Prefab)
    private desk: cc.Prefab = null  //桌子

    @property(cc.Sprite)
    private exit: cc.Sprite = null  //退出

    @property(cc.Sprite)
    private shareButton: cc.Sprite = null  //分享按钮

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

    @property(cc.Prefab)
    private SharePanel: cc.Prefab = null  //分享面板

    @property(cc.Prefab)
    private chatCartonPanel: cc.Prefab = null  //动画消息发送面板
    @property(cc.Sprite)
    chatCartonButton: cc.Sprite = null;//显示动画消息发送面板按钮

    @property(cc.Prefab)
    private trendPanel: cc.Prefab = null  //趋势图面板
    @property(cc.Sprite)
    trendButton: cc.Sprite = null;//趋势图按钮

    @property(cc.Label)
    showRoomNum: cc.Label = null; //房间号显示  
    @property(cc.Label)
    showBetLimit: cc.Label = null; //下注限制数显示
    @property(cc.Label)
    memberLimit: cc.Label = null; //人数
    @property(cc.Label)
    showPlayCountLimit: cc.Label = null; //牌局进行信息显示
    @property(cc.Label)
    showPlayMode: cc.Label = null; //上庄模式显示
    @property(cc.SpriteFrame)
    zhuangIcon: cc.SpriteFrame = null //庄家类型图标
    @property(cc.SpriteFrame)
    xianIcon: cc.SpriteFrame = null //闲家类型图标

    @property(cc.Label)
    userScoreLabel: cc.Label = null; //当前用户左下方分数值
    @property(cc.Label)
    diamondScoreLable: cc.Label = null; //当前用户钻数量

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
    eventIdOne: string = null
    eventIdTwo: string = null

    start() {
        /////////
        voiceManage.recOpen(()=>{})
        this.stopButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            voiceManage.recStop()
        })
        this.startButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            voiceManage.recStart()
        })
        ///////////
        this.clear()
        let enterRoomParam = this.getEnterRoomParam()
        if (enterRoomParam) {
            if(enterRoomParam.model == EnterRoomModel.SHARE && enterRoomParam.userId == null){
                webCookie.setItem('roomId', enterRoomParam.roomId, 0.1)
                let dialogParam = {
                    sureButtonShow: true, cancelButtonShow: false, content: "请注册登录！", cancelButtonAction: null,
                    sureButtonAction: TipDialogButtonAction.OUT_TO_REGISTER
                } as TipDialogParam
                this.dialogShow(dialogParam)
                return
            }
            this.startByEnterMode(enterRoomParam)
        } else {
            let dialogParam = {
                sureButtonShow: true, cancelButtonShow: false, content: "房间不存在或已关闭！", cancelButtonAction: null,
                sureButtonAction: TipDialogButtonAction.OUT_ROOM
            } as TipDialogParam
            this.dialogShow(dialogParam)
        }

    }

    dialogShow(dialogParam: TipDialogParam) {
        let node = cc.instantiate(this.tipDialog)
        let scriptOb = node.getComponent('TipDialog')
        node.parent = this.node
        scriptOb.tipDialogShow(dialogParam)
    }

    getEnterRoomParam(): EnterRoomParam {
        let enterRoomParam = RoomManage.getEnterRoomParam()
        if (enterRoomParam == null && isUrlToGameRoom()) {
            RoomManage.setEnterRoomParam({
                model: EnterRoomModel.SHARE,
                userId: UserManage.getLoginUserId(),
                roomId: parseInt(getUrlParam('roomId'))
            } as EnterRoomParam)
        }
        return RoomManage.getEnterRoomParam()
    }

    //将游戏房间重置为初始进入的状态
    clear(): void {
        RoomManage.clear()
        RaceManage.clear()
        GameMemberManage.clear()
        BetManage.clear()
    }

    startByEnterMode(enterRoomParam: EnterRoomParam) {
        let isEmulatorRoom = enterRoomParam.model === EnterRoomModel.EMULATOR_ROOM ? true : false
        this.controller = new RollControler(cc, isEmulatorRoom, this)
        if (isEmulatorRoom) {
            this.startEmulatorGame()
        } else {
            this.startWebGame(enterRoomParam)
        }
        this.scheduleOnce(() => { //定时器
            if (ConfigManage.isBackMusicOpen()) {
                this.backMusic.play()
            }
        }, 0.5);
        this.scheduleOnce(() => { //定时器
            if (ConfigManage.isBackMusicOpen() && (!this.backMusic.isPlaying)) {
                this.backMusic.play()
            }
        }, 4);
        cc.director.preloadScene('LobbyScene');//预加载
    }

    onEnable() {
        this.configManageGet()
        this.addClickEvent()
        this.localNoticeEvent()
    }

    async configManageGet(){
        if (!ConfigManage.isConfigHasLoad()) {
            let info = await ConfigManage.loadConfigInfo()
            if(info.result == ResponseStatus.FAIL){
                let dialogParam = {
                    sureButtonShow: true, cancelButtonShow: false, content: EnterRoomFail.net_fail_reload, cancelButtonAction: null,
                    sureButtonAction:  TipDialogButtonAction.RE_IN_GAME
                } as TipDialogParam
                this.dialogShow(dialogParam)
            }
        }
    }

    localNoticeEvent() {
        this.eventIdOne = randEventId()
        eventBus.on(EventType.LOCAL_NOTICE_EVENT, this.eventIdOne, (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.DIAMOND_COUNT_CHANGE:
                    this.diamondScoreLable.string = info.info + ''
                    break
                    case LocalNoticeEventType.PLAY_AUDIO_LOCAL_NOTICE:
                        debugger
                        let infoItem = info.info as voiceNotice
                        voiceManage.getAndPlayAudio(cc,infoItem.userId, infoItem.voiceName )
                        break
            }
        })


        this.eventIdTwo = randEventId()
        eventBus.on(EventType.MEMBER_DELETE_FROM_ROOM, this.eventIdTwo, (userId: string): void => {
            if (UserManage.userInfo.id == userId) {
                cc.log('我被踢出房间:' + userId)
                this.execBackLobby()
            }
        })
    }

    playWoQiangVoice() {
        if (ConfigManage.isTxMusicOpen()) {
            this.woQiangVoice.play()
        }
    }

    async startWebGame(enterRoomParam: EnterRoomParam) {
        let userId = enterRoomParam.userId
        let roomId = enterRoomParam.roomId
        if (enterRoomParam.model == EnterRoomModel.SHARE) {
            let reInfo = await UserManage.requestUserInfo(userId);
            if(reInfo.result == ResponseStatus.FAIL){
                let messageSet = EnterRoomFail.account_error
                let actionSet = TipDialogButtonAction.OUT_TO_LOGIN
                if(reInfo.extObject.message == 'net_error'){
                    let messageSet = EnterRoomFail.net_fail_reload
                    let actionSet = TipDialogButtonAction.RE_IN_GAME
                }else{
                    webCookie.removeItem('userId')
                }
                let dialogParam = {
                    sureButtonShow: true, cancelButtonShow: false, content: messageSet, cancelButtonAction: null,
                    sureButtonAction: actionSet
                } as TipDialogParam
                this.dialogShow(dialogParam)
                return
            }
        }
        let result = await RoomManage.loginRoom(userId, roomId)
        if (result.result === ResponseStatus.FAIL) {
            //cc.log('进入房间失败')
            cc.log(result)
            this.showEnterRoomFailTip(result.extObject)
            return
        }
        this.controller.start()
        this.showUserPanel()
        this.initXiaZhuPanel()
        this.initMahjongPanel()
        this.initDesk()
        this.showTopLeftRaceInfo()
        this.initShowAction()
        webSocketManage.openWs(() => {
            //cc.log('socket连接成功，发送连接成功本地通知')
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                type: LocalNoticeEventType.SOCKET_CONNECT_NOTICE,
                info: true
            } as LocalNoticeEventPara)
        }, () => {
            //cc.log('socket连接失败，发送连接失败本地通知')
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                type: LocalNoticeEventType.SOCKET_CONNECT_NOTICE,
                info: false
            } as LocalNoticeEventPara)
        })
        if (RoomManage.roomItem.roomState == roomState.PLAYING) {
            UserManage.updateUserDiamond()
        }
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
        let contenShow = EnterRoomFail[info.message]
        let node = cc.instantiate(this.tipDialog)
        let scriptOb = node.getComponent('TipDialog')
        node.parent = this.node
        let dialogParam = {
            sureButtonShow: true, cancelButtonShow: false, content: contenShow, cancelButtonAction: null,
            sureButtonAction: TipDialogButtonAction.OUT_ROOM
        } as TipDialogParam
        if (info.message === 'diamond_not_enough') {
            dialogParam.cancelButtonShow = true
            //dialogParam.content = '钻余额' + info.data.has + ',进入房间需要钻' + info.data.need + ',请点击确认购买！'
            dialogParam.content = '钻余额不足，请点击购买！'
            dialogParam.sureButtonAction = TipDialogButtonAction.RECHARGE
            dialogParam.cancelButtonAction = TipDialogButtonAction.OUT_ROOM
        }
        scriptOb.tipDialogShow(dialogParam)
    }

    showTopLeftRaceInfo() {
        let roomInfo = RoomManage.roomItem
        if (roomInfo.roomPay == CreateRoomPayModel.AA) {
            this.showPlayMode.string = 'AA房间：' + roomInfo.roomFee
        } else {
            this.showPlayMode.string = '代开房间：' + roomInfo.roomFee
        }
        this.showRoomNum.string = '房间号：' + roomInfo.id
        this.showBetLimit.string = '下注上限：' + roomInfo.costLimit
        this.showPlayCountLimit.string = '当前牌局：' + (roomInfo.oningRaceNum + 1) + '/' + roomInfo.playCount
        this.memberLimit.string = '玩家上限：' + roomInfo.memberLimit
    }

    startEmulatorGame() {
        this.controller.start()
        this.showUserPanel()
        this.initXiaZhuPanel()
        this.initMahjongPanel()
        this.initDesk()
        this.showTopLeftRaceInfo()
        this.showStartButton()
        let landlordId = RaceManage.raceList[0].landlordId
        this.scheduleOnce(() => {
            RaceManage.changeRaceLandlord(landlordId, 8, 0)
        }, 1);
    }

    private initDesk() {
        let node = cc.instantiate(this.desk)
        node.parent = this.node
        node.active = true
    }

    //添加面板上组件的一些响应事件
    private addClickEvent() {
        this.exit.node.on(cc.Node.EventType.TOUCH_END, () => {
            let dialogParam = {
                sureButtonShow: true, cancelButtonShow: true, content: WordMessage.back_to_lobby, cancelButtonAction: null,
                sureButtonAction: TipDialogButtonAction.OUT_TO_LOBBY
            } as TipDialogParam
             this.dialogShow(dialogParam)
        })

        this.shareButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.showSharePanel()
        })

        this.setButton.node.on(cc.Node.EventType.TOUCH_START, () => {
            //cc.log('设置按钮被点击')
            var node = cc.instantiate(this.SetPanel)
            node.parent = this.node
            node.setPosition(0, 0);
            node.active = true
        })

        this.chatCartonButton.node.on(cc.Node.EventType.TOUCH_START, () => {
            var node = cc.instantiate(this.chatCartonPanel)
            node.parent = this.node
            node.setPosition(0, 0);
            node.active = true
        })

        this.trendButton.node.on(cc.Node.EventType.TOUCH_START, () => {
            var node = cc.instantiate(this.trendPanel)
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
        if (this.controller) {
            this.controller.close()
            this.controller = null
        }
        cc.director.loadScene("LobbyScene");
        this.destroy()
    }

    //显示分享面板
    showSharePanel(){
        if (this.node.getChildByName('SharePanel') !== null) {
            return
        }
        var node = cc.instantiate(this.SharePanel)
        node.parent = this.node
        node.active = true
    }

    showRoomResultPanel() {
        //cc.log('我是房间面板，我收到所有比赛结束通知，我准备显示房间比赛分数统计面板')
        this.adjustBeforeRaceStateChange(RaceState.FINISHED)
        var node = cc.instantiate(this.roomResultPanel)
        node.parent = cc.find('Canvas/Desk')
        node.setPosition(0, -70);
        node.active = true
    }

    //状态改变前，清理刷新显示
    adjustBeforeRaceStateChange(stateVal: RaceState) {
        try {
            this.closeChoiceLandLordPanel() // 删除抢庄按钮
            if (stateVal != RaceState.SHOW_DOWN) {
                cc.find('Canvas/Desk').getComponent('Desk').deskPartsToClean() //删除桌子上各方位上的下注信息、focus显示
                cc.find('Canvas/Desk').getComponent('Desk').cleanMahjongResulNodes() //删除麻将结果文字标签
            }
            this.destroyRaceResultPanel() //删除指定场次结果面板
            this.closeStartButton() //删除关闭按钮
            this.cleanRollDice() //删除锺以及色子
            if (stateVal != RaceState.BET && stateVal != RaceState.SHOW_DOWN) {
                cc.find('Canvas/DealMachine').getComponent('DealMachine').cleanMajong() //删除下发的麻将
            }
            if (stateVal != RaceState.SHOW_DOWN) {
                // this.destroyChild('BetChipItem')  //不知道是什么
                this.destroyChild('MiddleTopScorePanel') //删除总下注信息面板
                this.node.getChildByName('XiaZhu').getComponent('XiaZhu').destroyDeskChip() //删除桌上的下注币
            }
            this.destroyTimePanel()
        } catch (e) {
            //cc.log(e)
        }
    }

    destroyChildNodeByName(nameString: string) {
        let node = this.node.getChildByName(nameString)
        if (node) {
            node.active = false
            node.destroy()
        }
    }

    destroyTimePanel() {//删除倒计时时间面板
        let node = cc.find('Canvas/Desk').getChildByName('MiddleTopTimePanel')
        if (node != null) {
            node.destroy()
        }
    }

    showRaceSncyTimePanel() {
        var node = cc.instantiate(this.middleTopTimePanel)
        node.name = 'MiddleTopTimePanel'
        node.parent = cc.find('Canvas/Desk')
        node.setPosition(-215, 218);
        node.getComponent('MiddleTopTimePanel').waitRaceSync()
    }

    showLandlordSncyTimePanel() {
        var node = cc.instantiate(this.middleTopTimePanel)
        node.name = 'MiddleTopTimePanel'
        node.parent = cc.find('Canvas/Desk')
        node.setPosition(-215, 218);
        node.getComponent('MiddleTopTimePanel').waitLandlordSync()
    }

    showMiddleTopTimePanel() {
        var node = cc.instantiate(this.middleTopTimePanel)
        node.name = 'MiddleTopTimePanel'
        node.parent = cc.find('Canvas/Desk')
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
        node.parent = cc.find('Canvas/Desk')
        node.active = true
    }

    destroyRaceResultPanel(): void {
        let nodes = cc.find('Canvas/Desk').children
        let i = 0;
        for (; i < nodes.length; i++) {
            if (nodes[i].name === 'RaceResultPanel') {
                nodes[i].destroy()
            }
        }
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
        node.parent = cc.find('Canvas/Desk')
        node.setPosition(0, 0);
        node.active = true
    }

    //清空摇色子相关动画
    cleanRollDice() {
        let nodes = cc.find('Canvas/Desk').children
        let i = 0;
        for (; i < nodes.length; i++) {
            if (nodes[i].name === 'RollDice') {
                nodes[i].destroy()
            }
        }
    }

    //显示抢庄按钮
    private showChoiceLandLordPanel() {
        let node = cc.find('Canvas/Desk').getChildByName('RapLandlordButton')
        if (node) {
            node.active = true
        } else {
            node = cc.instantiate(this.rapLandlordButton)
            node.parent = cc.find('Canvas/Desk')
            node.setPosition(308, -220);
            node.active = true
        }
        if (ConfigManage.isTxMusicOpen()) {
            this.qinQiangZhuangVoice.play()
        }
    }

    //删除抢庄按钮
    private closeChoiceLandLordPanel() {
        if (cc.find('Canvas/Desk').getChildByName('RapLandlordButton')) {
            cc.find('Canvas/Desk').getChildByName('RapLandlordButton').destroy()
        }
    }

    //左下方用户面板显示
    showUserPanel() {
        let userInfo = UserManage.userInfo
        this.userScoreLabel.string = RaceManage.getUserScore(userInfo.id) + ''
        this.diamondScoreLable.string = userInfo.diamond + ''
        cc.loader.load({ url: UserManage.getUserIconUrl(), type: 'png' }, (err, img: any) => {//loadRes
            let myIcon = new cc.SpriteFrame(img);
            this.userIcon.spriteFrame = myIcon;
        });
        // cc.loader.loadRes('renwu/1_1', (error, img) => {
        //     let myIcon = new cc.SpriteFrame(img);
        //     this.userIcon.spriteFrame = myIcon;
        // })
    }

    onLoad() {

    }

    //只有初始化了下注面板，才能有投注动画
    initXiaZhuPanel() {
        var node = cc.instantiate(this.xiaZhu)
        node.parent = this.node
        node.getChildByName('Layout').active = false
        node.active = true
        //cc.log('初始化下注功能')
    }
    //显示下注面板
    showXiaZhuPanel() {
        let landlordId = RaceManage.raceList[RoomManage.roomItem.oningRaceNum].landlordId
        if (UserManage.userInfo.id !== landlordId) {
            let node = this.node.getChildByName('XiaZhu')
            node.setPosition(250, -260);
            node.getChildByName('Layout').active = true
            //cc.log('显示下注面板')
        }
    }

    //关闭下注面板
    closeXiaZhuPanel() {
        let node = this.node.getChildByName('XiaZhu')
        node.getChildByName('Layout').active = false
    }

    showStartButton() {
        //cc.log('显示开始按钮')
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
        eventBus.off(EventType.LOCAL_NOTICE_EVENT, this.eventIdOne)
        eventBus.off(EventType.MEMBER_DELETE_FROM_ROOM, this.eventIdTwo)

        try {
            let enterRoomParam = RoomManage.getEnterRoomParam()
            if (enterRoomParam.model !== EnterRoomModel.EMULATOR_ROOM) {
                webSocketManage.closeWs()
                Log.d([ConsoleType.SOCKET], 'RollRoomScene/onDisable', ['房间页面被销毁，关闭socket连接'])
            }
        } catch (e) { }
    }

    // update (dt) {}
}
