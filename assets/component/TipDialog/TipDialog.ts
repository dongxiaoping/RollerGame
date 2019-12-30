const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    content: cc.Label = null;

    start() {
        let sureButton = this.node.getChildByName('Sure')
        sureButton.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.active = false
            this.node.destroy()
        })
    }

    showContent(content: string) {
        this.content.string = content
    }


}
