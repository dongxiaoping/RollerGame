import UserManage from "../../store/User/UserManage";
import RollEmulator from "../../common/RollEmulator";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyScene extends cc.Component {

    @property(cc.Prefab)
    EntryBox: cc.Prefab = null; //输入房间号进入房间面板

    @property(cc.Prefab)
    CreateRoomPanel: cc.Prefab = null; //创建房间面板

    @property(cc.Sprite)
    JoinPart: cc.Sprite = null; //加入房间图标区

    @property(cc.Sprite)
    CreateRoomPart: cc.Sprite = null; //创建房间图标区

    @property(cc.Sprite)
    LianXiChang: cc.Sprite = null;

    @property(cc.Label)
    userName: cc.Label = null;
    @property(cc.Label)
    userId: cc.Label = null;
    @property(cc.Label)
    diamond: cc.Label = null;
    @property(cc.Label)
    chipCount: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    }

    onEnable() {
        this.JoinPart.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.showEntryBox()
        })
        this.LianXiChang.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.log('练习场被点击了')
            RollEmulator.start()
            cc.director.loadScene("RollRoomScene")
        })
        this.CreateRoomPart.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.log('创建房间被点击了')
            var node = cc.instantiate(this.CreateRoomPanel)
            node.parent = this.node
            node.active = true
        })
        this.initUserInfo()
    }

    async initUserInfo() {
        let info = await UserManage.requestUserInfo();
        this.userName.string = UserManage.userInfo.nick
        this.userId.string = 'ID:' + UserManage.userInfo.id
        this.diamond.string = UserManage.userInfo.diamond + ''
        this.chipCount.string = UserManage.userInfo.score + ''
    }

    showEntryBox(): void {
        var node = cc.instantiate(this.EntryBox)
        node.parent = this.node
        node.setPosition(3.687, 1.474);
        node.active = true
    }

    onDisable() {
        this.JoinPart.node.off(cc.Node.EventType.TOUCH_END, () => { })
    }

    start() {
        cc.director.preloadScene('RollRoomScene');//预加载房间，提高进入房间的速度
        console.log('应用启动')
    }

    // update (dt) {}
}
