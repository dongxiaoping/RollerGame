const { ccclass } = cc._decorator;

@ccclass
class RollControler extends cc.Component {
    test(): void {
        console.log('roll 控制器')
    }
}

export default new RollControler()
