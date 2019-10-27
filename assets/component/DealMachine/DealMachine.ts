const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    mahjongs: cc.Prefab = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable() {
        let layout = this.node.getChildByName('Layout')
        for(let i=0; i<12; i++){
            var node = cc.instantiate(this.mahjongs)
            node.parent = layout
            //node.setPosition(0, 0);
            node.active = true
        }
    }
    start () {
    }

    // update (dt) {}
}
