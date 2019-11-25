const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    userCount: cc.Label = null;

    @property(cc.Sprite)
    userIcon: cc.Sprite = null;

    start() {

    }

    setShow(iconUrl: string, userName: string) {
        this.userCount.string = '0'
        this.userName.string = userName
        cc.loader.loadRes(iconUrl, (error, img) => {
            let myIcon = new cc.SpriteFrame(img);
            this.userIcon.spriteFrame = myIcon
        })
    }
}
