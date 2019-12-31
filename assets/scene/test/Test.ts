
const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    touchStart:any
    start(){
        window.onresize = function(){
            console.log('mmmmmm:从最小化中恢复了')
        }
    }

    onEnable(){
        cc.log('onEnable')
    }

    onLoad(){
        cc.log('onLoad')
    }
}
      
