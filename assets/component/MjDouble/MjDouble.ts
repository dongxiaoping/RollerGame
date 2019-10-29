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

    iconValueList: any = {
        1: ['1_1'],
        2: ['2_1', '2_2'],
        3: ['3_1'],
        4: ['4_1', '4_2', '4_3', '4_4'],
        5: ['5_1', '5_2', '5_3', '5_4', '5_5'],
        6: ['6_1', '6_2'],
        7: ['7_1'],
        8: ['8_1'],
        9: ['9_1', '9_2', '9_3', '9_4', '9_5', '9_6', '9_7', '9_8', '9_9']
    }

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
                    this.drawResult(this.one, this.randNum(1, 9))
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
                    this.drawResult(this.two, this.randNum(1, 9))
                    break
                case 7:
                    clearInterval(setIn)
            }
            count++
            cc.log('循环执行翻牌动画')
        }, time)
    }

    drawResult(ob: cc.Sprite, val: number) {
        let list = this.iconValueList[val]
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
