import { TipDialogParam, Coordinate } from "../../common/Const";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    content: cc.Label = null
    @property(cc.Node)
    leftSureButton: cc.Node = null
    @property(cc.Node)
    middleSureButton: cc.Node = null
    @property(cc.Node)
    cancelButton: cc.Node = null

    sureButton: cc.Node = null

    middleButtonLocation: Coordinate = { x: 0, y: -98 }
    leftButtonLocation: Coordinate = { x: 120, y: -98 }
    rightButtonLocation: Coordinate = { x: 120, y: -98 }
    tipDialogParam: TipDialogParam = null

    start() {
        this.sureButton.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.active = false
            this.node.destroy()
        })
        this.cancelButton.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.active = false
            this.node.destroy()
        })
    }

    tipDialogShow(info: TipDialogParam) {
        this.tipDialogParam = info
        if (info.sureButtonShow && info.cancelButtonShow) {
            this.sureButton = this.leftSureButton
            this.sureButton.active = true
            this.cancelButton.active = true
        } else if (info.sureButtonShow) {
            this.sureButton = this.middleSureButton
            this.sureButton.active = true
        }
        this.content.string = info.content
    }
}
