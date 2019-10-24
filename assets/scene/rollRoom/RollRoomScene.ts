const { ccclass, property } = cc._decorator;
import User from '../../store/User/User'
import { PromiseParam, PromiseResult } from '../../common/Const'
import { UserInfo } from '../../store/User/UserBase'
import RollControler from '../../common/RollControler'
import RollEmulator from '../../common/RollEmulator'
import { eventBus } from '../../common/EventBus'
import { EventType } from '../../common/Const'

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    private userIcon: cc.Sprite = null

    @property
    text: string = 'hello'

    onEnable() {
        this.showUserIcon()
    }

   async showUserIcon() {
    let info = await User.requestUserInfo()
    let userInfo = info.extObject as UserInfo
    cc.loader.load({ url: userInfo.icon, type: 'png' }, (err, img: any) => {
                    let myIcon = new cc.SpriteFrame(img);
                    this.userIcon.spriteFrame = myIcon;
                });
    }

    testCode(){
        // User.requestUserInfo().then((result: PromiseParam): void => {
        //     if (result.result === PromiseResult.SUCCESS) {
        //         let userInfo = result.extObject as UserInfo
        //         cc.loader.load({ url: userInfo.userIcon, type: 'png' }, (err, img: any) => {
        //             let myIcon = new cc.SpriteFrame(img);
        //             this.userIcon.spriteFrame = myIcon;
        //         });
        //     } else {

        //     }
        // })
    }

    onLoad(){

    }

    start() {
        RollEmulator.isRuning = true
        RollControler.test()
        this.node.on('say-hello', function (msg) {
            cc.log(msg);
            cc.log('我接受到了')
        });
        let eventId = `mst_app_${new Date().getTime()}_${Math.ceil(
            Math.random() * 10
          )}`
        eventBus.on(EventType.WAIT_BEGIN, eventId, (info:any): void => {
            cc.log(info)
          })
    }

    // update (dt) {}
}
