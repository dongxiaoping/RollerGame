const { ccclass, property } = cc._decorator;
import User from '../../store/User/User'

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        console.log(User.userInfo)
    }

    // update (dt) {}
}
