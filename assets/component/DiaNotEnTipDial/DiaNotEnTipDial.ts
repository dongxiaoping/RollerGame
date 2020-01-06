const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    start() {
        let sureButton = this.node.getChildByName('Sure')
        let cancelButton = this.node.getChildByName('Cancel')
        sureButton.on(cc.Node.EventType.TOUCH_END, () => {
            cc.log('确认被点击')
        })
        cancelButton.on(cc.Node.EventType.TOUCH_END, () => {
            cc.log('取消被点击')
        })
    }
}
