/* 发出去的一组麻将对象
 * 对一组麻将的结果显示以及翻牌动画进行管理
 *
 */
import { TableLocationType } from '../../common/Const'
const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, GameState, ChildGameParam, ChildGameState, OpenCardEventValue, IconValueList } from '../../common/Const'
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
                let val = info.val as OpenCardEventValue
                if (this.node.name === 'MjDouble' + val.tableLocationType) {
                    cc.log('接收到翻牌通知')
                    cc.log(info)
                    this.open(val.oneValue, val.twoValue)
                }
            }
        })
    }

    open(oneValue: number, twoNumber: number) {
        let time = 200
        let count = 1
        let setIn = setInterval(() => {
            switch (count) {
                case 1:
                    this.one.spriteFrame = this.oneThirdIcon
                    break;
                case 2:
                    this.one.spriteFrame = this.halfIcon
                    break;
                case 3:
                    this.one.spriteFrame = this.allIcon
                    this.drawResult(this.one, oneValue)
                    time = 500
                    break;
                case 4:
                    this.two.spriteFrame = this.oneThirdIcon
                    time = 200
                    break;
                case 5:
                    this.two.spriteFrame = this.halfIcon
                    break;
                case 6:
                    this.two.spriteFrame = this.allIcon
                    this.drawResult(this.two, twoNumber)
                    break
                case 7:
                    clearInterval(setIn)
            }
            count++
            cc.log('循环执行翻牌动画')
        }, time)
    }

    drawResult(ob: cc.Sprite, val: number) {
        let list = IconValueList[val]
        for (let i = 0; i < list.length; i++) {
            ob.node.getChildByName(list[i]).active = true
        }

    }

    randNum(n: number, m: number) {
        let c = m - n + 1;
        return Math.floor(Math.random() * c + n);
    }

    // update (dt) {}
}
