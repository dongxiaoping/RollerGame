import { Coordinate } from '../../common/Const'
const { ccclass, property } = cc._decorator;
import { randEventId } from '../../common/Util'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    chip_10: cc.Prefab = null
    @property(cc.Prefab)
    chip_20: cc.Prefab = null
    @property(cc.Prefab)
    chip_50: cc.Prefab = null
    @property(cc.Prefab)
    chip_100: cc.Prefab = null

    deskChipList: string[] = [] //桌子上的chip名称集合
    // onLoad () {}

    start() {
        this.flyAnimation({ x: 0, y: 0 }, { x: 200, y: 200 }, 10)
        this.flyAnimation({ x: 0, y: 0 }, { x: 200, y: 200 }, 10)
        //this.destroyDeskChip()
        //cc.log(this.node.parent)
        // this.hideLineChip()
        // setTimeout(()=>{
        //     this.showLineChip({ x: 200, y: 200 })
        // },2000)
    }

    flyAnimation(fromLocation: Coordinate, toLocaiton: Coordinate, val: number) {
        let node = this.createChip(val)
        node.setPosition(fromLocation.x, fromLocation.y);
        node.active = true
        let action = cc.moveTo(0.5, toLocaiton.x, toLocaiton.y)
        let b = cc.sequence(action, cc.callFunc(() => { }, this))
        node.runAction(b)
    }

    createChip(val: number): any {
        let node = cc.instantiate(this.chip_10)
        node.name = randEventId()
        this.deskChipList.push(node.name)
        let rootOb = this.node.parent
        node.parent = rootOb
        return node
    }

    //清除发出去的chip
    destroyDeskChip(): void {
        this.deskChipList.forEach(element => {
            let ob = this.node.parent.getChildByName(element)
            if (ob) {
                ob.destroy()
            }
        });
        this.deskChipList = []
    }

    //隐藏发chip的队列显示
    hideLineChip(): void {
        let a = this.node.getChildByName('Layout')
        if (a) {
            a.active = false
        }
    }

    //在指定位置显示chip的队列,不能马上在start中调用
    showLineChip(locaton: Coordinate): void {
        let a = this.node.getChildByName('Layout')
        if (a) {
            a.active = true
        }
        this.node.setPosition(locaton.x,locaton.y)
        cc.log(this.node)
    }

    reSetLineChip(): void {

    }

    // update (dt) {}
}
