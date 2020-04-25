import RoomManage from "../../store/Room/RoomManage";
import { EnterRoomModel } from "../../common/Const";
import UserManage from "../../store/User/UserManage";
import ConfigManage from "../../store/Config/ConfigManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    userName: cc.Label = null;
    @property(cc.Sprite)
    userIcon: cc.Sprite = null;
    @property(cc.Label)
    userScore: cc.Label = null;

    start() {

    }

    initData(id: string, iconUrl: string, userName: string, userScore: number): void {
        if (userScore > 0) {
            this.userScore.node.color = cc.Color.YELLOW
        }
        this.userScore.string = userScore + ''
        this.userName.string = userName
        let enterRoomParam = RoomManage.getEnterRoomParam()
        if (enterRoomParam.model === EnterRoomModel.EMULATOR_ROOM && id !== UserManage.userInfo.id) {
            cc.loader.loadRes(iconUrl, (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                this.userIcon.spriteFrame = myIcon
            })
        } else {

            cc.loader.load({ url: ConfigManage.getUserIconUrl() + iconUrl, type: 'png' }, (err, img: any) => {
                let myIcon = new cc.SpriteFrame(img);
                this.userIcon.spriteFrame = myIcon
            });
        }
    }

    // update (dt) {}
}
