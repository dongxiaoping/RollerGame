import { Coordinate } from "../../common/Const";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    chip_1_1: cc.Sprite = null
    @property(cc.Sprite)
    chip_1_2: cc.Sprite = null
    @property(cc.Sprite)
    chip_2_1: cc.Sprite = null
    @property(cc.Sprite)
    chip_2_2: cc.Sprite = null
    distanceSet:number = 60

    start() {
        this.animation()
    }

    animation() {
        let location = this.node.getPosition()
        this.move(this.chip_1_1.node, { x: location.x - this.distanceSet, y: location.y + this.distanceSet })
        this.move(this.chip_1_2.node, { x: location.x + this.distanceSet, y: location.y + this.distanceSet })
        this.move(this.chip_2_1.node, { x: location.x - this.distanceSet, y: location.y - this.distanceSet })
        this.move(this.chip_2_2.node, { x: location.x + this.distanceSet, y: location.y - this.distanceSet })
    }

    move(theNode: cc.Node, toLocation: Coordinate) {
        let action = cc.moveTo(0.4, toLocation.x, toLocation.y)
        let b = cc.sequence(action, cc.callFunc(() => {
            theNode.active = false
            theNode.destroy()
        }, this))
        theNode.runAction(b)
    }

}
