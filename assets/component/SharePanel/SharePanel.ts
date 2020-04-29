import RoomManage from "../../store/Room/RoomManage";
import ConfigManage from "../../store/Config/ConfigManage";
import UserManage from "../../store/User/UserManage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.WebView)
    webViewPart: cc.WebView = null;


    start () {
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
            ",点击URL地址进入："+gameUrl+"?roomId="+roomNum
            this.webViewPart.url = "https://www.toplaygame.cn/login/copyPage?copy="+contentInfo
        }catch(e){}

    }

    // update (dt) {}
}
