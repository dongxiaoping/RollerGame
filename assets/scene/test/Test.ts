
const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    touchStart:any
    @property(cc.AudioSource)
    qinQiangZhuangVoice: cc.AudioSource = null;
    start(){
       // this.qinQiangZhuangVoice.play()

    }

    onEnable(){
        cc.log('onEnable')
    }

    onLoad(){
        cc.log('onLoad')
    }
}
      
