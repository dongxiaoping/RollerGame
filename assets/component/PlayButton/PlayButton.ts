const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            console.log('开始游戏')
        })
    }

    onDisable(){
        this.node.off(cc.Node.EventType.TOUCH_END, ()=>{})
    }

    start () {

    }

    // update (dt) {}
}
