const { ccclass, property } = cc._decorator;
import User from '../../store/User/User'
import { PromiseParam, PromiseResult } from '../../common/Const'
import { UserInfo } from '../../store/User/UserBase'
import RollEmulator from "../../common/RollEmulator"
import { eventBus } from '../../common/EventBus'
import { EventType, GameState } from '../../common/Const'
import Room from '../../store/Room/Room'
import RoomItem from '../../store/Room/RoomItem'
import { randEventId } from '../../common/Util'
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

    onEnable() {
        this.showUserIcon()
        this.addEventListener()
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
    private beginDeal(){
        this.endRollDice()
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
        if(ob){
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
        let info = await User.requestUserInfo()
        let userInfo = info.extObject as UserInfo
        // cc.loader.load({ url: userInfo.icon, type: 'png' }, (err, img: any) => {
        //                 let myIcon = new cc.SpriteFrame(img);
        //                 this.userIcon.spriteFrame = myIcon;
        //             });
    }

    onLoad() {

    }

    start() {
        RollEmulator.isRuning = true
        this.showUserIcon()
        this.openStartButton()
    }

    async openStartButton() {
        let info = await Room.requestRoomInfo()
        let roomInfo = info.extObject as RoomItem
        let otherInfo = await User.requestUserInfo()
        let userInfo = otherInfo.extObject as UserInfo
        if (userInfo.id === roomInfo.creatUserId) {
            var node = cc.instantiate(this.playButtonPrefab)
            node.parent = this.node
            node.setPosition(-124.514, -268.949);
            node.active = true
            cc.log('是房主，显示开始游戏按钮')
        } else {
            cc.log('不是房主，不显示开始游戏按钮')
        }
    }

    closeStartButton(): void {
        let ob = this.node.getChildByName('PlayButton')
        ob.destroy()
    }

    // update (dt) {}
}
