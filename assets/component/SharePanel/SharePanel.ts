
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox)
    editBox: cc.EditBox = null;

    
    @property(cc.Button)
    copyButton: cc.Button = null;

    start () {
        this.copyButton.node.on(cc.Node.EventType.TOUCH_END, () => {
           console.log("按钮被点击")
           console.log( this.editBox.string)
        })

        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy()
        })

        this.editBox.string = "滚筒子邀请您一起玩，AA房间【1168】，抢庄，数6，局数10，最高下100,点击URL地址进入：https://www.toplaygame.cn/game/build/web-mobile?roomId="
    }

    // update (dt) {}
}
