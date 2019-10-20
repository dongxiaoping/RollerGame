// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Lobby extends cc.Component {

    @property(cc.Prefab)
    EntryBox: cc.Prefab = null;

    @property(cc.Sprite)
    JoinPart: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    }

    onEnable() {
        this.JoinPart.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.showEntryBox()
        })
    }

    showEntryBox(): void{
        var node = cc.instantiate(this.EntryBox)
        node.parent = this.node
        node.setPosition(3.687, 1.474);
        node.active = true
    }

    onDisable(){
        this.JoinPart.node.off(cc.Node.EventType.TOUCH_END, ()=>{})
    }

    start() {
        console.log('应用启动')
    }

    // update (dt) {}
}
