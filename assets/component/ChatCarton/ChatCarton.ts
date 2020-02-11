import { NoticeType, ChatMessageType, NoticeData, CartonMessage, EnterRoomModel, EventType } from "../../common/Const";
import webSocketManage from '../../common/WebSocketManage'
import RoomManage from "../../store/Room/RoomManage";
import UserManage from "../../store/User/UserManage";
import { eventBus } from "../../common/EventBus";
import { wenZiList } from "../../common/WenZiList";
import { faceList } from "../../common/FaceList";
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    ziItem: cc.Prefab = null //字列表条目
    @property(cc.Prefab)
    faceItem: cc.Prefab = null //表情条目

    @property(cc.Node)
    ziButton: cc.Node = null //字列表按钮
    @property(cc.Node)
    faceButton: cc.Node = null //表情列表按钮

    @property(cc.Node)
    ziPart: cc.Node = null //字区域
    @property(cc.Node)
    ziContent: cc.Node = null //字列表
    @property(cc.Node)
    facePart: cc.Node = null //表情区域
    @property(cc.Node)
    faceContent: cc.Node = null //表情列表
    start() {
        this.addFaceIconEvent()
    }

    addFaceIconEvent() {
        try {
            this.node.on(cc.Node.EventType.TOUCH_END, (event: any) => {
                this.node.destroy()
            })

            this.ziButton.on(cc.Node.EventType.TOUCH_END, (event: any) => {
                this.ziPart.active = true
                this.facePart.active = false
            })
            this.faceButton.on(cc.Node.EventType.TOUCH_END, (event: any) => {
                this.ziPart.active = false
                this.facePart.active = true
            })

            let i = 0
            for (; i < faceList.length; i++) {
                let itemNode = cc.instantiate(this.faceItem)
                itemNode.name = i + ''
                this.faceContent.addChild(itemNode)
                if (faceList[i].name.indexOf('ES') != -1) {//
                    itemNode.width = 70
                    itemNode.height = 70
                }
                cc.loader.loadRes('ChatCarton/' + faceList[i].name, (error, img) => {
                    let myIcon = new cc.SpriteFrame(img);
                    itemNode.getChildByName('Pic').getComponent(cc.Sprite).spriteFrame = myIcon
                })
                this.addNotice(itemNode, ChatMessageType.PIC)
            }

            i = 0
            for (; i < wenZiList.length; i++) {
                let itemNode = cc.instantiate(this.ziItem)
                itemNode.getComponent(cc.Label).string = wenZiList[i]['content']
                itemNode.name = i + ''
                this.ziContent.addChild(itemNode)
                this.addNotice(itemNode, ChatMessageType.WEN_ZI)
            }
        } catch (e) {
            console.log(e)
        }
    }

    addNotice(nodeItem: any, typeSet: ChatMessageType) {
        nodeItem.on(cc.Node.EventType.TOUCH_END, (targe: any) => {
            let index = targe.currentTarget._name
            let enterRoomParam = RoomManage.getEnterRoomParam()
            if (enterRoomParam.model == EnterRoomModel.EMULATOR_ROOM) {
                let setInfo = { userId: UserManage.userInfo.id, type: typeSet, message: index } as CartonMessage
                eventBus.emit(EventType.CARTON_MESSAGE_NOTICE, setInfo)
                this.node.destroy()
                return
            }
            let notice = {
                type: NoticeType.chatCartonMessage, info: {
                    roomId: RoomManage.roomItem.id,
                    info: { userId: UserManage.userInfo.id, type: typeSet, message: index } as CartonMessage
                }
            } as NoticeData
            webSocketManage.send(JSON.stringify(notice))
            this.node.destroy()
        })
    }

    // update (dt) {}
}
