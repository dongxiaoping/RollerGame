import RoomManage from "../../store/Room/RoomManage";
import ConfigManage from "../../store/Config/ConfigManage";
import UserManage from "../../store/User/UserManage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    
    @property(cc.Button)
    copyButton: cc.Button = null;

    start () {
        this.copyButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            // new ClipboardJS('.btn', {
            //     text: function(trigger) {
            //         debugger
            //         return "fdsa";
            //     }
            // });
          // console.log("按钮被点击")
           //var clipboard = new Clipboard()
         //  clipboard.writeText(this.editBox.string)
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
            this.editBox.string = UserManage.userInfo.nick+"邀请您一起玩，代开房间【"+roomNum+"】,人数上限"+memberLimit+
            "，局数"+playCount+"，最高下"+costLimit+
            ",点击URL地址进入："+gameUrl+"?roomId="+roomNum
        }catch(e){}

    }

    // update (dt) {}
}
