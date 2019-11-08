const { ccclass, property } = cc._decorator;
import UserManage from '../../store/User/UserManage'
import { UserInfo } from '../../store/User/UserBase'
import RollEmulator from "../../common/RollEmulator"
import { eventBus } from '../../common/EventBus'
import { RaceState, EventType, TableLocationType, roomState, RaceStateChangeParam } from '../../common/Const'
import Room from '../../store/Room/RoomManage'
import RoomItem from '../../store/Room/RoomItem'
import { randEventId } from '../../common/Util'
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    private userIcon: cc.Sprite = null //用户图标

    @property(cc.Prefab)
    private rollDicePrefab: cc.Prefab = null  //摇色子

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

    onEnable() {
        this.showUserIcon()
        this.addListener()
    }

    private addListener() {
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
                    cc.log('房间收到选地主指令，开始选地主流程') //到了这个环境不是一定弹出地主提示框，要看通知是否轮到当前玩家选地主
                    // this.choiceLandLord()
                    break
                case RaceState.DEAL:
                    cc.log('房间收到发牌指令，开始发牌流程')
                    this.beginDeal()
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

        eventBus.on(EventType.LANDLORD_CAHNGE_EVENT, randEventId(), (landlordId: string): void => {
            let oningRaceNum = RoomManage.roomItem.oningRaceNum
            if (RaceManage.raceList[oningRaceNum].state !== RaceState.CHOICE_LANDLORD) {
                cc.log('错误！接收到了地主邀请通知，但当前房间状态不是选地主')
                return
            }
            if (UserManage.userInfo.id !== landlordId) {
                cc.log('接收到了地主邀请通知，但邀请的不是自己')
            } else {
                cc.log('当前用户收到邀请，弹出是否当地主提示框')
                this.choiceLandLord()
            }
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
        let node = cc.instantiate(this.dealMachine)
        node.parent = this.node
        node.setPosition(320, 207);
        node.active = true
        let scriptOb = node.getComponent('DealMachine')
        scriptOb.deal(TableLocationType.LAND)
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
    private choiceLandLord() {
        var node = cc.instantiate(this.choiceLandlordPanel)
        node.parent = this.node
        node.setPosition(0, 0);
        node.active = true
    }

    async showUserIcon() {
        let info = await UserManage.requestUserInfo()
        let userInfo = info.extObject as UserInfo
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
        RollEmulator.isRuning = true
        this.showUserIcon()
        this.changeStartButtonState()
        this.initXiaZhuPanel()
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

    async changeStartButtonState() {
        let infoOne = await Room.requestRoomInfo()
        let roomInfo = infoOne.extObject as RoomItem
        let InfoTwo = await UserManage.requestUserInfo()
        let userInfo = InfoTwo.extObject as UserInfo
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
