const { ccclass, property } = cc._decorator;
import User from '../../store/User/User'
import { PromiseParam, PromiseResult } from '../../static/Const'
import { UserInfo } from '../../store/User/UserBase'

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    userIcon: cc.Sprite = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    onEnable() {
        this.showUserIcon()
    }

   async showUserIcon() {
    let info = await User.requestUserInfo()
    let userInfo = info.extObject as UserInfo
    cc.loader.load({ url: userInfo.userIcon, type: 'png' }, (err, img: any) => {
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

    start() {

    }

    // update (dt) {}
}
