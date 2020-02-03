import { NoticeType, ChatMessageType, NoticeData, CartonMessage } from "../../common/Const";
import webSocketManage from '../../common/WebSocketManage'
import RoomManage from "../../store/Room/RoomManage";
import UserManage from "../../store/User/UserManage";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property([cc.Sprite])
    faceSpritenList: cc.Sprite[] = []

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.addFaceIconEvent()
    }

    addFaceIconEvent() {
        let i = 0
        for (; i < this.faceSpritenList.length; i++) {
            this.faceSpritenList[i].node.on(cc.Node.EventType.TOUCH_START, (targe: any) => {
                let notice = {
                    type: NoticeType.chatCartonMessage, info: {
                        roomId: RoomManage.roomItem.id,
                        info: { userId: UserManage.userInfo.id, type: ChatMessageType.PIC, message: targe.currentTarget._name } as CartonMessage
                    }
                } as NoticeData
                webSocketManage.send(JSON.stringify(notice))
                cc.log('发送消息动画通知')
                this.node.destroy()
            })
        }
    }

    // update (dt) {}
}
