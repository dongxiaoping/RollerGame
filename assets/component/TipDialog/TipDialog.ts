import {
    TipDialogParam,
    Coordinate,
    TipDialogButtonAction,
    EventType,
    LocalNoticeEventType,
    LocalNoticeEventPara,
    roomState,
    NoticeType,
    NoticeData,
    turnLandlordNotice
} from "../../common/Const";
import webSocketManage from '../../common/WebSocketManage'
import { eventBus } from "../../common/EventBus";
import { config } from "../../common/Config";
import RoomManage from "../../store/Room/RoomManage";
const { ccclass, property } = cc._decorator;
import log from 'loglevel'
import {randomRange} from "../../common/Util";
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
        try {
            switch (action) {
                case TipDialogButtonAction.SOCKET_CONNECT:
                    webSocketManage.socketConnectAction()
                    break
                case TipDialogButtonAction.OUT_ROOM:
                    cc.director.loadScene("LobbyScene");
                    break
                case TipDialogButtonAction.OUT_TO_REGISTER:
                    window.location.replace(config.registerPageAddress + "?rand=" + randomRange(1, 3000))
                    break
                case TipDialogButtonAction.OUT_APP:
                    try{
                        if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {
                            window.location.href="about:blank";
                            window.close();
                        } else {
                            window.opener = null;
                            window.open("", "_self");
                            window.close();
                        }
                    }catch(e){
                        window.location.replace(config.loginPageAddress + "?rand=" + randomRange(1, 3000))
                    }
                    break
                case TipDialogButtonAction.OUT_TO_LOGIN:
                     window.location.replace(config.loginPageAddress + "?rand=" + randomRange(1, 3000))
                    break
                case TipDialogButtonAction.RE_IN_GAME:
                    window.location.reload()
                    break
                case TipDialogButtonAction.OUT_TO_LOBBY:
                    eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                        type: LocalNoticeEventType.TO_LOBBY_EVENT,
                        info: false
                    } as LocalNoticeEventPara)
                    break
                case TipDialogButtonAction.RECHARGE:
                    let node = cc.instantiate(this.rechargePanel)
                    node.parent = this.node.parent
                    break
                case TipDialogButtonAction.KICKOUT_MEMBER:
                    let userId = this.tipDialogParam.otherInfo.userId
                    if (RoomManage.roomItem.roomState == roomState.OPEN) {
                        let notice = {
                            type: NoticeType.kickOutMemberFromRoom, info: {
                                roomId: RoomManage.roomItem.id,
                                kickUserId: userId,
                            }
                        } as NoticeData
                        webSocketManage.send(JSON.stringify(notice));
                    }
                    break
            }
            this.node.active = false
            this.node.destroy()
        } catch (error) {

        }
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
