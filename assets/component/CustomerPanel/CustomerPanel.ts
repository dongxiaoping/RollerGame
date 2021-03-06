import ConfigManage from "../../store/Config/ConfigManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    cutomerWechat: cc.Label = null

    
    @property(cc.Sprite)
    closeButton: cc.Sprite = null;
    
    start() {
        this.closeButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy()
        })

        this.cutomerWechat.string = "客服微信号：" + ConfigManage.getCustomerWechatNum()
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.node.destroy()
        })
    }

    // update (dt) {}
}
