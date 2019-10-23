const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Sprite)
    boxBody: cc.Sprite = null
    private isAdd: boolean = true
    private oning: boolean = false
    private isFlying: boolean = false
    private beginTime: number = 0.5 //单位s 开始晃动的时间
    private endTime: number = 2.5  //单位s 晃动结束的时间
    start() {
        setTimeout(() => {
            this.oning = true
        }, this.beginTime * 1000)
        setTimeout(() => {
            this.oning = false
            setTimeout(() => {
                this.isFlying = true
            }, 500) //晃动结束开盒子的时间
        }, this.endTime * 1000)
    }

    update(dt) {
        this.waggle()
        this.BoxFlying()
    }

    BoxFlying(): void {
        if (!this.isFlying) {
            return
        }
        let setY = this.boxBody.node.getPosition().y
        if (setY > 600) {
            return
        }
        let setX = this.boxBody.node.getPosition().x
        this.boxBody.node.setPosition(setX + 4, setY + 20)
        if (this.boxBody.node.angle > -10) {
            this.boxBody.node.angle = this.boxBody.node.angle - 1
        }
    }
    waggle(): void {
        if (this.node.angle === 10) {
            this.isAdd = false
        }
        if (this.node.angle === -10) {
            this.isAdd = true
        }
        if (!this.oning && this.node.angle === 0) {
            return
        }
        if (this.isAdd) {
            this.node.angle = this.node.angle + 2
        } else {
            this.node.angle = this.node.angle - 2
        }
    }
}
