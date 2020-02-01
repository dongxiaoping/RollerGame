import { TipDialogParam, Coordinate, TipDialogButtonAction, EventType, LocalNoticeEventType, LocalNoticeEventPara } from "../../common/Const";
import webSocketManage from '../../common/WebSocketManage'
import { eventBus } from "../../common/EventBus";
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
    @property(cc.Prefab)
    rechargePanel: cc.Prefab = null

    sureButton: cc.Node = null

    middleButtonLocation: Coordinate = { x: 0, y: -98 }
    leftButtonLocation: Coordinate = { x: 120, y: -98 }
    rightButtonLocation: Coordinate = { x: 120, y: -98 }
    tipDialogParam: TipDialogParam = null

    start() {
        this.sureButton.on(cc.Node.EventType.TOUCH_END, () => {
            this.execButtonAction(this.tipDialogParam.sureButtonAction)
        })
        this.cancelButton.on(cc.Node.EventType.TOUCH_END, () => {
            this.execButtonAction(this.tipDialogParam.cancelButtonAction)
        })
    }

    execButtonAction(action: TipDialogButtonAction) {
        switch (action) {
            case TipDialogButtonAction.SOCKET_CONNECT:
                webSocketManage.openWs(() => {
                    cc.log('socket连接成功，发送连接成功本地通知')
                    eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                        type: LocalNoticeEventType.SOCKET_CONNECT_NOTICE,
                        info: true
                    } as LocalNoticeEventPara)
                }, () => {
                    cc.log('socket连接失败，发送连接失败本地通知')
                    eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                        type: LocalNoticeEventType.SOCKET_CONNECT_NOTICE,
                        info: false
                    } as LocalNoticeEventPara)
                })
                break
            case TipDialogButtonAction.OUT_ROOM:
                cc.director.loadScene("LobbyScene");
                break
            case TipDialogButtonAction.RECHARGE:
                let node = cc.instantiate(this.rechargePanel)
                node.parent = this.node.parent
                break
        }
        this.node.active = false
        this.node.destroy()
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
