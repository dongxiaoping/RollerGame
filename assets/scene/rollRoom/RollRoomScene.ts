const { ccclass, property } = cc._decorator;
import UserManage from '../../store/User/UserManage'
import { UserInfo } from '../../store/User/UserBase'
import RollEmulator from "../../common/RollEmulator"
import { eventBus } from '../../common/EventBus'
import { EventType, GameState, TableLocationType, PushEventType } from '../../common/Const'
import Room from '../../store/Room/RoomManage'
import {roomState} from '../../store/Room/RoomBase'
import RoomItem from '../../store/Room/RoomItem'
import RaceItem from '../../store/Races/RaceItem'
import { randEventId } from '../../common/Util'
import RaceManage from '../../store/Races/RaceManage'
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


    onEnable() {
        this.showUserIcon()
        this.addEventListener()
        this.addPushEventListener()
    }

    private addPushEventListener(){
        eventBus.on(EventType.PUSH_EVENT, randEventId(), (info: any): void => {
            let event = info.eventType
            switch (event) {
                case PushEventType.LANDLOAD_WELCOME:
                    cc.log('控制器收到邀请地主通知')
                    if(UserManage.userInfo.id === info.userId){
                        cc.log('当前用户收到邀请，弹出是否当地主提示框')
                        this.choiceLandLord()
                    }
                    break
            }
        })
    }

    private addEventListener() {
        eventBus.on(EventType.GAME_STATE_CHANGE, randEventId(), (info: any): void => {
            let to = info.to
            switch (to) {
                case GameState.ROLL_DICE:
                    cc.log('控制器收到摇色子指令，开始摇色子流程')
                    this.beginRollDice()
                    break
                case GameState.CHOICE_LANDLORD:
                    cc.log('控制器收到选地主指令，开始选地主流程')
                    this.choiceLandLord()
                    break
                case GameState.DEAL:
                    cc.log('控制器收到发牌指令，开始发牌流程')
                    this.beginDeal()
                    break
            }
        })
    }

    //开始发牌流程
    private beginDeal() {
        this.endRollDice()
        let node = cc.instantiate(this.dealMachine)
        node.parent = this.node
        node.setPosition(189.261, -236.576);
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
        this.initXiaZhuFunc()
      //  GameStateInfo.requestMjResult('2')

    }

    //初始化下注功能
    initXiaZhuFunc(){
        var node = cc.instantiate(this.xiaZhu)
        node.parent = this.node
        node.setPosition(189.261, -236.576);
        node.active = false
        cc.log('初始化下注功能')
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
