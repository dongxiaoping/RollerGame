const { ccclass, property } = cc._decorator;
import User from '../../store/User/User'
import { PromiseParam, PromiseResult } from '../../common/Const'
import { UserInfo } from '../../store/User/UserBase'
import RollControler from '../../common/RollControler'
import RollEmulator from "../../common/RollEmulator"
import { eventBus } from '../../common/EventBus'
import { EventType, GameState } from '../../common/Const'

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    private userIcon: cc.Sprite = null

    @property(cc.Prefab)
    private rollDice: cc.Prefab = null

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
        var node = cc.instantiate(this.rollDice)
        node.parent = this.node
        node.setPosition(0, 0);
        node.active = true
    }

    //结束摇色子
    private endRollDice(): void {
        let rollDice = this.node.getChildByName('RollDice')
        rollDice.destroy()
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
    }

    // update (dt) {}
}
