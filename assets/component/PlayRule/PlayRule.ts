const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.RichText)
    label: cc.RichText = null;

    @property(cc.Sprite)
    close: cc.Sprite = null;

    start () {
        this.close.node.on(cc.Node.EventType.TOUCH_START, () => {
            cc.log('关闭按钮')
            this.node.active =false
        })
    }
}
