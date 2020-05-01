import ConfigManage from "../../store/Config/ConfigManage";
import { eventBus } from "../../common/EventBus";
import { EventType, LocalNoticeEventType, LocalNoticeEventPara } from "../../common/Const";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    cancel: cc.Node = null;

    @property(cc.Toggle)
    bj: cc.Toggle = null

    @property(cc.Toggle)
    tx: cc.Toggle = null

    @property(cc.Sprite)
    closeButton: cc.Sprite = null;

    @property(cc.Label)
    bjLabel: cc.Label = null;

    @property(cc.Label)
    txLabel: cc.Label = null;
    
    start() {
        this.closeButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy()
        })

        this.cancel.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.active = false
            this.node.destroy()
        })

        this.txLabel.node.on(cc.Node.EventType.TOUCH_END, () => {
            if(this.tx.isChecked){
                this.tx.isChecked = false
            }else{
                this.tx.isChecked = true
            }
        })

        this.bjLabel.node.on(cc.Node.EventType.TOUCH_END, () => {
            if(this.bj.isChecked){
                this.bj.isChecked = false
            }else{
                this.bj.isChecked = true
            }
        })


        this.bj.node.on('toggle', () => {
            ConfigManage.setBackMusic(this.bj.isChecked)
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                type: LocalNoticeEventType.BACK_MUSIC_STATE_CHANGE_NOTICE,
                info: this.bj.isChecked
            } as LocalNoticeEventPara)
        }, this);
        this.tx.node.on('toggle', () => {
            ConfigManage.setTxMusic(this.tx.isChecked)
        }, this);
    }

    onEnable() {
        if (ConfigManage.isBackMusicOpen()) {
            this.bj.isChecked = true
        } else {
            this.bj.isChecked = false
        }
        if (ConfigManage.isTxMusicOpen()) {
            this.tx.isChecked = true
        } else {
            this.tx.isChecked = false
        }
    }
}
