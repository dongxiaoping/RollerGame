import UserManage from "../../store/User/UserManage";
import { ResponseStatus } from "../../common/Const";
import ConfigManage from "../../store/Config/ConfigManage";
const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    oneRechargePart: cc.Node = null;
    @property(cc.Node)
    twoRechargePart: cc.Node = null;
    @property(cc.Node)
    threeRechargePart: cc.Node = null;
    @property(cc.Node)
    fourRechargePart: cc.Node = null;
    @property(cc.Sprite)
    closeButton: cc.Sprite = null;

    @property(cc.Label)
    cutomerWechat: cc.Label = null
    start() {
        this.cutomerWechat.string = "请联系客服购买，客服微信号" + ConfigManage.getCustomerWechatNum()
    }

    onEnable() {
        this.closeButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy()
        })
        this.oneRechargePart.on(cc.Node.EventType.TOUCH_END, () => {
            this.buyDiamond(2000)
            //cc.log('购买1')
        })
        this.twoRechargePart.on(cc.Node.EventType.TOUCH_END, () => {
            this.buyDiamond(1000)
            //cc.log('购买2')
        })
        this.threeRechargePart.on(cc.Node.EventType.TOUCH_END, () => {
            this.buyDiamond(500)
            //cc.log('购买3')
        })
        this.fourRechargePart.on(cc.Node.EventType.TOUCH_END, () => {
            this.buyDiamond(100)
            //cc.log('购买4')
        })
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            //cc.log('关闭')
            this.node.destroy()
        })
    }

    async buyDiamond(count: number) {
        // let result = await UserManage.rechargeDiamond(UserManage.userInfo.id, count)
        // if (result.result === ResponseStatus.FAIL) {
        //     return
        // }
        // UserManage.userInfo.diamond = result.extObject
        this.node.destroy()
    }
}
