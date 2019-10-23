const { ccclass, property } = cc._decorator;

@ccclass
class RollEmulator extends cc.Component {
    @property
    _isRuning: boolean = false;

    @property
    get isRuning() {
        return this._isRuning;
    }
    set isRuning(value) {
        cc.log('模拟器开关改变');
        this._isRuning = value;
    }
}

export default new RollEmulator()
