const { ccclass, property } = cc._decorator;
import User from '../../store/User/User'
import { PromiseParam, PromiseResult } from '../../common/Const'
import { UserInfo } from '../../store/User/UserBase'
import RollEmulator from "../../common/RollEmulator"
import { eventBus } from '../../common/EventBus'
import { EventType, GameState } from '../../common/Const'
import Room from '../../store/Room/Room'
import RoomItem from '../../store/Room/RoomItem'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    private userIcon: cc.Sprite = null

    @property(cc.Prefab)
    private rollDicePrefab: cc.Prefab = null

    @property(cc.Prefab)
    private playButtonPrefab: cc.Prefab = null

    onEnable() {
        this.showUserIcon()
        this.addEventListener()
    }

    private addEventListener() {
        let eventId = `mst_app_${new Date().getTime()}_${Math.ceil(
            Math.random() * 10
        )}`
        eventBus.on(EventType.GAME_STATE_CHANGE, eventId, (info: any): void => {
            let to = info.to
            switch (to) {
                case GameState.ROLL_DICE:
                    this.beginRollDice()
                    break
            }

        })
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
        ob.destroy()
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

    async openStartButton(){
        let info = await Room.requestRoomInfo()
        let roomInfo =  info.extObject as RoomItem
        let otherInfo = await User.requestUserInfo()
        let userInfo = otherInfo.extObject as UserInfo
        if(userInfo.id === roomInfo.creatUserId){
            var node = cc.instantiate(this.playButtonPrefab)
            node.parent = this.node
            node.setPosition(-124.514, -268.949);
            node.active = true
            cc.log('是房主，显示开始游戏按钮')
        }else{
            cc.log('不是房主，不显示开始游戏按钮')
        }
    }

    closeStartButton(): void{
        let ob = this.node.getChildByName('PlayButton')
        ob.destroy()
    }

    // update (dt) {}
}
