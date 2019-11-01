/* 对下注的显示以及相关功能进行管理
 *
 */
const { ccclass, property } = cc._decorator;
import { randEventId, randFloatNum } from '../../common/Util'
import { EventType, PushEventPara, PushEventType, PushEventParaInfo, Coordinate, SeatLocaionList, betLocaion } from '../../common/Const'
import { eventBus } from '../../common/EventBus'
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
        //this.flyAnimation({ x: 0, y: 0 }, { x: 200, y: 200 }, 10)
        //  this.flyAnimation({ x: 0, y: 0 }, { x: 200, y: 200 }, 10)
        //this.destroyDeskChip()
        //cc.log(this.node.parent)
        // this.hideLineChip()
        // setTimeout(()=>{
        //     this.showLineChip({ x: 200, y: 200 })
        // },2000)

        eventBus.on(EventType.PUSH_EVENT, randEventId(), (info: PushEventPara): void => {
            if (info.eventType === PushEventType.BET_CHIP_CHANGE) {
                cc.log('收到下注动画通知')
                cc.log(info)
                let betInfo = info.info as PushEventParaInfo
                let betValue = betInfo.toValue - betInfo.fromVal
                let userId = betInfo.userId
                let betLocationType = betInfo.betLocation
                let toLocaiton = this.getBetPointbyLocationType(betLocationType)
                let fromLocation = this.getUserDeskLocation(userId)
                this.flyAnimation(fromLocation, toLocaiton, betValue)
            }
        })
    }

    getUserDeskLocation(userId: string): Coordinate {
        let node = this.node.parent
        let scriptOb = node.getChildByName('Desk').getComponent('Desk')
        return scriptOb.deskSitList[userId]
    }

    getBetPointbyLocationType(betLocationType: betLocaion): Coordinate {
        cc.log('获取下注点的坐标')
        let node = this.node.parent
        let scriptOb = node.getChildByName('Desk').getComponent('Desk')
        let location: Coordinate = null
        if (scriptOb.userIsLandlord) {
            location = SeatLocaionList.landlord.chipPoint[betLocationType]
            location.x = location.x + randFloatNum(1, 10)
            location.y = location.y + randFloatNum(1, 10)
            return location
        } else {
            location = SeatLocaionList.member.chipPoint[betLocationType]
            location.x = location.x + randFloatNum(1, 10)
            location.y = location.y + randFloatNum(1, 10)
            return location
        }
    }

    flyAnimation(fromLocation: Coordinate, toLocaiton: Coordinate, val: number) {
        let node = this.createChip(val)
        node.setPosition(fromLocation.x, fromLocation.y);
        node.active = true
        let action = cc.moveTo(0.7, toLocaiton.x, toLocaiton.y)
        let b = cc.sequence(action, cc.callFunc(() => { }, this))
        node.runAction(b)
    }

    createChip(val: number): any {
        let node = cc.instantiate(this.chip_10)
        let label = node.getChildByName('ValLabel').getComponent(cc.Label)
        label.fontSize = 10
        node.width = 20
        node.height = 20
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
        this.node.setPosition(locaton.x, locaton.y)
        cc.log(this.node)
    }

    reSetLineChip(): void {

    }

    // update (dt) {}
}
