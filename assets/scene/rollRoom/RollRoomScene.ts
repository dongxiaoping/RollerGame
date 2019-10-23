const { ccclass, property } = cc._decorator;
import User from '../../store/User/User'
import { PromiseParam, PromiseResult } from '../../common/Const'
import { UserInfo } from '../../store/User/UserBase'
import RollControler from '../../component/RollControler'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    private userIcon: cc.Sprite = null

    @property
    text: string = 'hello'

    @property
    _width = 100;
    
    @property
    get width () {
        return this._width;
    }
    set width (value) {
        cc.log('width changed');
       this._width = value;
    }

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
        cc.log(55555555555555)  
    }

    start() {
        cc.log(3333333333333)
        this.width = 45
    }

    // update (dt) {}
}
