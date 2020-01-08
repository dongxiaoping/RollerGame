const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.SpriteFrame)
    winSpriteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    failSpriteFrame: cc.SpriteFrame = null;

    @property(cc.Sprite)
    skySprite: cc.Sprite = null;
    @property(cc.Sprite)
    middleSprite: cc.Sprite = null;
    @property(cc.Sprite)
    landSprite: cc.Sprite = null;

    start() {

    }

    setShow(skyWin: boolean, middleWin: boolean, landWin: boolean) {
        this.skySprite.spriteFrame = skyWin ? this.winSpriteFrame : this.failSpriteFrame
        this.middleSprite.spriteFrame = middleWin ? this.winSpriteFrame : this.failSpriteFrame
        this.landSprite.spriteFrame = landWin ? this.winSpriteFrame : this.failSpriteFrame
    }

}
