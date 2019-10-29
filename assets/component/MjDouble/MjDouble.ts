import { TableLocationType } from '../../common/Const'
const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, GameState, ChildGameParam, ChildGameState } from '../../common/Const'
import { randEventId } from '../../common/Util'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    one: cc.Sprite = null;

    @property(cc.Sprite)
    two: cc.Sprite = null;

    oneThirdIcon: cc.SpriteFrame = null
    halfIcon: cc.SpriteFrame = null
    allIcon: cc.SpriteFrame = null

    start() {
        cc.loader.loadRes('mahjong/mahjong_62fa7d43_02', (error, img) => {
            this.oneThirdIcon = new cc.SpriteFrame(img);
        })
        cc.loader.loadRes('mahjong/mahjong_62fa7d43_03', (error, img) => {
            this.halfIcon = new cc.SpriteFrame(img);
        })
        cc.loader.loadRes('mahjong/mahjong_62fa7d43_04', (error, img) => {
            this.allIcon = new cc.SpriteFrame(img);
        })

        eventBus.on(EventType.CHILD_GAME_STATE_CHANGE, randEventId(), (info: ChildGameParam) => {
            if (info.parentState === GameState.SHOW_DOWN && info.childState === ChildGameState.SHOW_DOWN.OPEN_CARD_NOTICE) {
                if (this.node.name === 'MjDouble' + info.val) {
                    cc.log('接收到翻牌通知')
                    cc.log(info)
                    this.open(3, 5)
                }
            }
        })
    }

    open(oneValue: number, twoNumber: number) {
        this.one.spriteFrame = this.halfIcon
        setTimeout(()=>{
            this.one.spriteFrame = this.allIcon
            setTimeout(()=>{
                this.two.spriteFrame = this.halfIcon
                setTimeout(()=>{
                    this.two.spriteFrame = this.allIcon
                },200)
            },500)
        },200)
    }

    // update (dt) {}
}
