import { memberState, BetRecord } from "../../common/Const";
import Betitem from "../../store/Bets/BetItem";
import BetManage from "../../store/Bets/BetManage";

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    touchStart: any
    //  @property(cc.AudioSource)
    //qinQiangZhuangVoice: cc.AudioSource = null;

    @property(cc.Prefab)
    playUserIcon: cc.Prefab = null;
    start() {
        // let item = {
        //     userId: 'e',
        //     raceNum: 1,
        //     sky: 0,
        //     land: 0,
        //     middle: 0,
        //     bridg: 0,
        //     skyCorner: 0,
        //     landCorner: 0,
        // } as BetRecord

        // BetManage.setBetList([item])
        // BetManage.betList.forEach((item: Betitem[], index) => {
        //     //console.log(item)
        //     //console.log(index)
        // })
        // //console.log(BetManage.betList)
        //userIconNode.getComponent('PlayUserIcon').setShow(memberInChairData)
        // this.qinQiangZhuangVoice.play()

        let userIconNode = cc.instantiate(this.playUserIcon)
        userIconNode.name = "PlayerIcon"
        userIconNode.setPosition(0, 0)
        userIconNode.parent = this.node
       // userIconNode.getComponent('PlayUserIcon').setShow(memberInChairData)
    }

    onEnable() {
        //cc.log('onEnable')
    }

    onLoad() {
        //cc.log('onLoad')
    }
}

