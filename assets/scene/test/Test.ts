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
    start() {
        voiceManage.recOpen(()=>{})
        this.stopButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            voiceManage.recStop()
        })
        this.startButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            voiceManage.recStart()
        })
    }

    onEnable() {
        //cc.log('onEnable')
    }

    onLoad() {
        //cc.log('onLoad')
    }
}

