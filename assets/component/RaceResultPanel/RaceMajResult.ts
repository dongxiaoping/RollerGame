const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    majResultIcon: cc.Sprite = null;
    start () {

    }
}
