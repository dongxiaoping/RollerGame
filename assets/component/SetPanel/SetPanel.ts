const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    cancel: cc.Sprite = null;

    start () {
        this.cancel.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.active = false
            this.node.destroy()
        })
    }
}
