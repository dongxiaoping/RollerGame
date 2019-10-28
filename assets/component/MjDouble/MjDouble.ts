import { TableLocationType } from '../../common/Const'
const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType } from '../../common/Const'
import { randEventId } from '../../common/Util'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    one: cc.Sprite = null;


    @property(cc.Sprite)
    two: cc.Sprite = null;

    start() {
        eventBus.on(EventType.OPEN_CARD_NOTICE, randEventId(), (info: any): void => {
            if (this.node.name === 'MjDouble' + info) {
                cc.log('接收到翻牌通知')
                cc.log(info)
                cc.loader.loadRes('mahjong/mahjong_62fa7d43_04', (error, img) => {
                    let myIcon = new cc.SpriteFrame(img);
                    this.one.spriteFrame = myIcon
                })
            }
        })
    }

    // update (dt) {}
}
