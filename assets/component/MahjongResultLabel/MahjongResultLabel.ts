import { DiceCountInfo } from "../../common/Const";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    private mahjongReultWenZi: cc.Sprite = null //麻将结果文字
    @property([cc.SpriteFrame])
    private majValZiHalf: cc.SpriteFrame[] = []
    @property([cc.SpriteFrame])
    private majValZiZhen: cc.SpriteFrame[] = []
    @property(cc.SpriteFrame)
    erbagang: cc.SpriteFrame = null
    start() {

    }

    showResultWenZi(majongScore: DiceCountInfo) {
        let ziSpriteFrame = this.getZiSpriteFrame(majongScore)
        this.mahjongReultWenZi.spriteFrame = ziSpriteFrame
    }

    getZiSpriteFrame(majongScore: DiceCountInfo): cc.SpriteFrame {
        let val: number = 0
        if ((majongScore.one === 2 && majongScore.two === 8) || (majongScore.one === 8 && majongScore.two === 2)) {
            return this.erbagang
        }
        if (majongScore.one === majongScore.two) {
            return this.majValZiHalf[0]
        }
        if (majongScore.one === 0.5 && majongScore.two === 0.5) {
            return this.majValZiZhen[1]
        }
        if (majongScore.one === 0.5 || majongScore.two === 0.5) { //半点
            val = majongScore.one === 0.5 ? majongScore.two : majongScore.one
            return this.majValZiHalf[val]
        }
        val = majongScore.two + majongScore.one
        if (val >= 10) {
            val -= 10
        }
        return this.majValZiZhen[val]
    }
}
