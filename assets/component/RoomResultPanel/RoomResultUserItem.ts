const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    userName: cc.Label = null;
    @property(cc.Sprite)
    userIcon: cc.Sprite = null;
    @property(cc.Label)
    userScore: cc.Label = null;

    start() {

    }

    initData(iconUrl: string, userName: string, userScore: string): void {
        this.userScore.string = userScore
        this.userName.string = userName
    }

    // update (dt) {}
}
