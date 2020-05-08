import { EventType, ResponseStatus } from "../../common/Const";
import voiceManage from "../../store/Voice/VoiceManage"
import ConfigManage from "../../store/Config/ConfigManage";
const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    private rec
    @property(cc.Button)
    private startButton: cc.Button = null //
    @property(cc.Button)
    private stopButton: cc.Button = null //
    @property(cc.Sprite)
    private but: cc.Sprite = null //
    start() {

        // voiceManage.recOpen(()=>{})
        this.but.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.but.node.width = 120
            this.but.node.height = 120
        })
        this.but.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.but.node.width = 40
            this.but.node.height = 40
        })
    }

    onEnable() {
        //cc.log('onEnable')
    }

    onLoad() {
        //cc.log('onLoad')
    }
}

