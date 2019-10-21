const { ccclass, property } = cc._decorator;
import User from '../../store/User/User'

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

    showUserIcon(): void {
        cc.loader.load({url:  User.userInfo.userIcon, type: 'png'}, (err,img:any)=>{
            let myIcon  = new cc.SpriteFrame(img); 
            this.userIcon.spriteFrame = myIcon;
        });
    }

    start() {
        console.log(User.userInfo)
    }

    // update (dt) {}
}
