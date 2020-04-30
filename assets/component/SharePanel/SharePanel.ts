import RoomManage from "../../store/Room/RoomManage";
import ConfigManage from "../../store/Config/ConfigManage";
import UserManage from "../../store/User/UserManage";
import { webCookie } from "../../common/Util";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.WebView)
    webViewPart: cc.WebView = null;
    @property(cc.Sprite)
    closeButton: cc.Sprite = null;

    start () {
        this.closeButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy()
        })
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy()
        })
        try{
            let roomNum = RoomManage.roomItem.id
            let playCount = RoomManage.roomItem.playCount
            let costLimit = RoomManage.roomItem.costLimit
            let memberLimit = RoomManage.roomItem.memberLimit
            let gameUrl = ConfigManage.getGameUrl()
            let contentInfo = UserManage.userInfo.nick+"邀请您一起玩，代开房间【"+roomNum+"】,人数上限"+memberLimit+
            "，局数"+playCount+"，最高下"+costLimit+
            ",点击URL地址进入游戏："+gameUrl+"?roomId="+roomNum
            webCookie.setItem("share", contentInfo, null)
           this.webViewPart.url = "https://www.toplaygame.cn/login/copyPage"
        }catch(e){}

    }

    // update (dt) {}
}
