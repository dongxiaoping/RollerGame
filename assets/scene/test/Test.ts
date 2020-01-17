import { memberState } from "../../common/Const";

const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    touchStart:any
  //  @property(cc.AudioSource)
    //qinQiangZhuangVoice: cc.AudioSource = null;

    @property(cc.Prefab)
    playUserIcon: cc.Prefab = null;
    start(){
        let userIconNode = cc.instantiate(this.playUserIcon)
        userIconNode.name = "PlayerIcon"
        userIconNode.setPosition(0, 0)
        userIconNode.parent = this.node
        userIconNode.getComponent('PlayUserIcon').changeByUserState(memberState.OffLine)
        //userIconNode.getComponent('PlayUserIcon').setShow(memberInChairData)
       // this.qinQiangZhuangVoice.play()
    //    let userIconNode = cc.instantiate(this.playUserIcon)
    //    userIconNode.name = "PlayerIcon"
    //    userIconNode.setPosition(0, 0)
    //    userIconNode.parent = chairNode
    //    userIconNode.getComponent('PlayUserIcon').setShow(memberInChairData)
    }

    onEnable(){
        cc.log('onEnable')
    }

    onLoad(){
        cc.log('onLoad')
    }
}
      
