import RoomManage from "../../store/Room/RoomManage";
import { EnterRoomModel, EnterRoomParam, ResponseStatus, TipDialogParam } from "../../common/Const";
import UserManage from "../../store/User/UserManage";

const { ccclass, property } = cc._decorator;
//输入房间号加入房间面板
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    CloseButton: cc.Sprite = null;

    @property(cc.Button)
    One: cc.Button = null;
    @property(cc.Button)
    Two: cc.Button = null;
    @property(cc.Button)
    Three: cc.Button = null;
    @property(cc.Button)
    Four: cc.Button = null;
    @property(cc.Button)
    Five: cc.Button = null;
    @property(cc.Button)
    Six: cc.Button = null;
    @property(cc.Button)
    Seven: cc.Button = null;
    @property(cc.Button)
    Eight: cc.Button = null;
    @property(cc.Button)
    Nine: cc.Button = null;
    @property(cc.Button)
    Zero: cc.Button = null;
    @property(cc.Button)
    Delete: cc.Button = null;
    @property(cc.Button)
    Enter: cc.Button = null;
    @property(cc.Prefab)
    private tipDialog: cc.Prefab = null  //提示框

    @property(cc.Label)
    Num: cc.Label = null;

    @property(cc.Prefab)
    private diamondNotDialog: cc.Prefab = null  //钻不足提示框

    onEnable() {

    }
    start() {
        this.CloseButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy()
        })
        this.One.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.Num.string += '1'
        })
        this.Two.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.Num.string += '2'
        })
        this.Three.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.Num.string += '3'
        })
        this.Four.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.Num.string += '4'
        })
        this.Five.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.Num.string += '5'
        })
        this.Six.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.Num.string += '6'
        })
        this.Seven.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.Num.string += '7'
        })
        this.Eight.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.Num.string += '8'
        })
        this.Nine.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.Num.string += '9'
        })
        this.Zero.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.Num.string += '0'
        })
        this.Delete.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.Num.string = this.Num.string.substring(0, this.Num.string.length - 1)
        })
        this.Enter.node.on(cc.Node.EventType.TOUCH_END, () => {
            let roomId = parseInt(this.Num.string)
            RoomManage.setEnterRoomParam({
                model: EnterRoomModel.NUMBER_PANEL,
                userId: UserManage.userInfo.id,
                roomId: roomId
            } as EnterRoomParam)
            this.checkRoom(roomId)
            console.log(this.Num.string)
        })
    }

    async checkRoom(roomId: number) {
        let result = await RoomManage.isRoomExist(roomId)
        if (result.result === ResponseStatus.FAIL) {
            cc.log('进入房间失败,房间号：' + roomId)
            this.showEnterRoomFailTip()
        } else {
            cc.director.loadScene("RollRoomScene");
        }
        this.node.destroy()
    }

    showEnterRoomFailTip() {
        let node = cc.instantiate(this.tipDialog)
        let scriptOb = node.getComponent('TipDialog')
        node.parent = this.node.parent
        node.active = true
        let dialogParam = { sureButtonShow: true, cancelButtonShow: false, content: '房间不存在或已关闭', cancelButtonAction: null, sureButtonAction: null } as TipDialogParam
        scriptOb.tipDialogShow(dialogParam)
    }

    onDisable() {
        this.CloseButton.node.off(cc.Node.EventType.TOUCH_END, () => { })
    }
    // update (dt) {}
}
