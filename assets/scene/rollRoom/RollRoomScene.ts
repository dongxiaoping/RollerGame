const { ccclass, property } = cc._decorator;
import UserManage from '../../store/User/UserManage'
import { eventBus } from '../../common/EventBus'
import { RaceState, EventType, TableLocationType, roomState, RaceStateChangeParam, EnterRoomModel } from '../../common/Const'
import Room from '../../store/Room/RoomManage'
import { randEventId, getFaPaiLocation, isUrlToGameRoom, getUrlParam } from '../../common/Util'
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage'
import RollEmulator from "../../common/RollEmulator";
import RollControler from '../../common/RollControler';
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
    private choiceLandlordPanel: cc.Prefab = null //选地主面板

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
    private middleTopXiaZhuPanel: cc.Prefab = null // 顶部下注分数显示面板

    @property(cc.Prefab)
    private rapLandlordButton: cc.Prefab = null // 抢地主按钮

    @property(cc.Label)
    showRoomNum: cc.Label = null; //房间号显示  
    @property(cc.Label)
    showBetLimit: cc.Label = null; //下注限制数显示
    @property(cc.Label)
    showPlayCountLimit: cc.Label = null; //牌局进行信息显示
    @property(cc.Label)
    showPlayMode: cc.Label = null; //上庄模式显示

    onEnable() {
        if (RollEmulator.isRuning && RollControler.isRuning) {
            cc.log('错误！游戏模拟器和游戏控制器只能开一个')
            return
        }
        if (RollEmulator.isRuning) {
            this.startAfterDataInit()
            this.showTopLeftRaceInfo()
            cc.log('进入模拟房间')
        } else {
            cc.log('进入游戏房间')
            this.startGame()
        }
    }

    async startGame() {

        let enterRoomParam = RoomManage.getEnterRoomParam()
        let userId = enterRoomParam.userId
        let roomId = enterRoomParam.roomId
        if(enterRoomParam.model === EnterRoomModel.SHARE){
            let userInfo = await UserManage.requestUserInfo(userId)
        }
        let info = await RoomManage.loginRoom(userId, roomId)
        this.startAfterDataInit()
        RollControler.start()
        this.showTopLeftRaceInfo()
    }

    showTopLeftRaceInfo() {
        let roomInfo = RoomManage.roomItem
        this.showRoomNum.string = '房间号：' + roomInfo.id
        this.showPlayMode.string = '上庄模式：抢庄'
        this.showBetLimit.string = '下注上限：' + roomInfo.costLimit
        this.showPlayCountLimit.string = '当前牌局：1/' + roomInfo.playCount
    }

    startAfterDataInit() {
        this.showUserIcon()
        this.changeStartButtonState()
        this.initXiaZhuPanel()
        this.initMahjongPanel()
        this.initDesk()
        this.addListener()
        this.addClickEvent()
    }

    private initDesk() {
        let node = cc.instantiate(this.desk)
        node.parent = this.node
        node.active = true
    }

    //添加面板上组件的一些响应事件
    private addClickEvent() {
        this.exit.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.log('退出到主页')
            cc.director.loadScene("LobbyScene");
        })
    }

    private addListener() {
        eventBus.on(EventType.ROOM_STATE_CHANGE_EVENT, randEventId(), (state: roomState): void => {
            switch (state) {
                case roomState.ALL_RACE_FINISHED:
                    cc.log('我是房间面板，我收到所有比赛结束通知，我准备显示房间比赛分数统计面板')
                    var node = cc.instantiate(this.roomResultPanel)
                    node.parent = this.node
                    node.setPosition(0, 0);
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
                    let landlordId = RaceManage.raceList[raceNum].landlordId
                    this.beginRollDice()
                    if (UserManage.userInfo.id !== landlordId) {
                        cc.log('不是地主,显示下注面板')
                        this.showXiaZhuPanel()
                    } else {
                        cc.log('是地主,不显示下注面板')
                    }
                    break
                case RaceState.CHOICE_LANDLORD:
                    cc.log('房间收到选地主指令，开始选地主流程,玩家显示抢地主按钮')
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
                    node.setPosition(-168, 251);
                    node.active = true

                    // if (RoomManage.roomItem.oningRaceNum === 0) {
                    //     var node = cc.instantiate(this.middleTopXiaZhuPanel)
                    //     node.parent = this.node
                    //     node.setPosition(-7.5, 258);
                    //     node.active = true
                    // }
                    break
                case RaceState.SHOW_DOWN: //这个由控制器来响应
                    // cc.log('房间收到比大小指令，开始比大小流程')
                    break
                case RaceState.SHOW_RESULT:
                    cc.log('控制器公布结果')
                    this.toShowRaceResultPanel()
                    break
                case RaceState.FINISHED:
                    cc.log('房间收到比赛结束通知，清空页面上次比赛信息')
                    this.toCloseRaceResultPanel()
                    this.cleanMhjongOnDesk()
                    this.cleanChipOnDesk()
                    break
            }
        })

        eventBus.on(EventType.RACING_NUM_CHANGE_EVENT, randEventId(), (num: number): void => {
            let roomInfo = RoomManage.roomItem
            let count = RoomManage.roomItem.oningRaceNum
            this.showPlayCountLimit.string = '当前牌局：' + (count + 1) + '/' + roomInfo.playCount
        })

        eventBus.on(EventType.LANDLORD_CAHNGE_EVENT, randEventId(), (landlordId: string): void => {
            let oningRaceNum = RoomManage.roomItem.oningRaceNum
            if (RaceManage.raceList[oningRaceNum].state !== RaceState.CHOICE_LANDLORD) {
                cc.log('错误！接收到了地主邀请通知，但当前房间状态不是选地主')
                return
            }
            this.closeChoiceLandLordPanel()
        })
    }

    cleanMhjongOnDesk(): void {
        this.node.getChildByName('MjDouble' + TableLocationType.LAND).destroy()
        this.node.getChildByName('MjDouble' + TableLocationType.LANDLORD).destroy()
        this.node.getChildByName('MjDouble' + TableLocationType.MIDDLE).destroy()
        this.node.getChildByName('MjDouble' + TableLocationType.SKY).destroy()
    }

    //清空座子上的筹码
    cleanChipOnDesk() {

    }

    toShowRaceResultPanel(): void {
        let node = cc.instantiate(this.raceResultPanel)
        node.name = 'RaceResultPanel'
        node.parent = this.node
        node.active = true
    }

    toCloseRaceResultPanel(): void {
        let node = this.node.getChildByName('RaceResultPanel')
        node.active = false
        node.destroy()
    }

    //开始发牌流程
    private beginDeal() {
        this.endRollDice()
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
        node.parent = this.node
        node.setPosition(0, 0);
        node.active = true
    }

    //结束摇色子
    private endRollDice(): void {
        let ob = this.node.getChildByName('RollDice')
        if (ob) {
            ob.destroy()
        }
    }

    //选地主
    private showChoiceLandLordPanel() {
        // var node = cc.instantiate(this.choiceLandlordPanel)
        // node.parent = this.node
        // node.setPosition(0, 0);
        // node.active = true
        var node = cc.instantiate(this.rapLandlordButton)
        node.parent = this.node
        node.setPosition(358, -198);
        node.active = true
    }

    private closeChoiceLandLordPanel() {
        if (this.node.getChildByName('RapLandlordButton')) {
            this.node.getChildByName('RapLandlordButton').destroy()
        }
    }

    showUserIcon() {
        let userInfo = UserManage.userInfo
        // cc.loader.load({ url: userInfo.icon, type: 'png' }, (err, img: any) => {
        //                 let myIcon = new cc.SpriteFrame(img);
        //                 this.userIcon.spriteFrame = myIcon;
        //             });
        cc.loader.loadRes(userInfo.icon, (error, img) => {
            let myIcon = new cc.SpriteFrame(img);
            this.userIcon.spriteFrame = myIcon;
        })
    }

    onLoad() {

    }

    start() {

    }

    //只有初始化了下注面板，才能有投注动画
    initXiaZhuPanel() {
        var node = cc.instantiate(this.xiaZhu)
        node.parent = this.node
        node.setPosition(189.261, -236.576);
        node.getChildByName('Layout').active = false
        node.active = true
        cc.log('初始化下注功能')
    }
    //初始化下注功能
    showXiaZhuPanel() {
        let node = this.node.getChildByName('XiaZhu')
        node.getChildByName('Layout').active = true
        cc.log('显示下注面板')
        // let scriptOb = node.getComponent('DealMachine')
        //scriptOb.deal(TableLocationType.LAND)
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
            cc.log('是房主，并且房间游戏没有开始，显示开始游戏按钮')
        } else {
            cc.log('不是房主，或者房间游戏已开始，不显示开始游戏按钮')
        }
    }

    closeStartButton(): void {
        let ob = this.node.getChildByName('PlayButton')
        ob.destroy()
    }

    // update (dt) {}
}
