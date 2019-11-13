import UserManage from "../../store/User/UserManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LobbyScene extends cc.Component {

    @property(cc.Prefab)
    EntryBox: cc.Prefab = null;

    @property(cc.Sprite)
    JoinPart: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
    }

    onEnable() {
        this.JoinPart.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.showEntryBox()
        })
        this.initUserInfo()
    }

    async initUserInfo(){
        let info = await UserManage.requestUserInfo();
    }

    showEntryBox(): void{
        var node = cc.instantiate(this.EntryBox)
        node.parent = this.node
        node.setPosition(3.687, 1.474);
        node.active = true
    }

    onDisable(){
        this.JoinPart.node.off(cc.Node.EventType.TOUCH_END, ()=>{})
    }

    start() {
        console.log('应用启动')
    }

    // update (dt) {}
}
