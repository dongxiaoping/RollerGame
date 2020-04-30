const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.RichText)
    label: cc.RichText = null
    @property(cc.Sprite)
    closeButton: cc.Sprite = null;
    start () {
        this.closeButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy()
        })
        
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            //cc.log('关闭按钮')
            this.node.active =false
        })
    }
}
