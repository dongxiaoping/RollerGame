import { DiceCountInfo } from "../../common/Const";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    private mahjongReultWenZi: cc.Sprite = null //麻将结果文字
    majongValueLabelHalf: string[] = [
        'ziMajongZhi/zi_half_0_5', //对子
        'ziMajongZhi/zi_half_1_5',
        'ziMajongZhi/zi_half_2_5',
        'ziMajongZhi/zi_half_3_5',
        'ziMajongZhi/zi_half_4_5',
        'ziMajongZhi/zi_half_5_5',
        'ziMajongZhi/zi_half_6_5',
        'ziMajongZhi/zi_half_7_5',
        'ziMajongZhi/zi_half_8_5',
        'ziMajongZhi/zi_half_9_5'
    ]
    majongValueLabelZhen: string[] = [
        'ziMajongZhi/zi_0',  //鄙十
        'ziMajongZhi/zi_1',
        'ziMajongZhi/zi_2',
        'ziMajongZhi/zi_3',
        'ziMajongZhi/zi_4',
        'ziMajongZhi/zi_5',
        'ziMajongZhi/zi_6',
        'ziMajongZhi/zi_7',
        'ziMajongZhi/zi_8',
        'ziMajongZhi/zi_9'
    ]
    erbagang: string = 'ziMajongZhi/erbagang'
    start() {

    }

    showResultWenZi(majongScore: DiceCountInfo) {
        let wenZiUrl = this.getLabelUrlByDiceCountInfo(majongScore)
        cc.loader.loadRes(wenZiUrl, (error, img) => {
            let myIcon = new cc.SpriteFrame(img);
            this.mahjongReultWenZi.spriteFrame = myIcon;
        })
    }

    getLabelUrlByDiceCountInfo(majongScore: DiceCountInfo): string {
        let val: number = 0
        if ((majongScore.one === 2 && majongScore.two === 8) || (majongScore.one === 8 && majongScore.two === 2)) {
            return this.erbagang
        }
        if (majongScore.one === majongScore.two) {
            return this.majongValueLabelHalf[0]
        }
        if (majongScore.one === 0.5 && majongScore.two === 0.5) {
            return this.majongValueLabelZhen[1]
        }
        if (majongScore.one === 0.5 || majongScore.two === 0.5) { //半点
            val = majongScore.one === 0.5 ? majongScore.two : majongScore.one
            return this.majongValueLabelHalf[val]
        }
        val = majongScore.two + majongScore.one
        if (val >= 10) {
            val -= 10
        }
        return this.majongValueLabelZhen[val]
    }
}
