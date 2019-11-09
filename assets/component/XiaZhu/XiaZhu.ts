/* 对下注的显示以及相关功能进行管理
 *
 */
const { ccclass, property } = cc._decorator;
import { randEventId, randFloatNum } from '../../common/Util'
import { BetChipChangeInfo, EventType, Coordinate, chipPoint, RaceStateChangeParam, RaceState } from '../../common/Const'
import { eventBus } from '../../common/EventBus'
import UserManage from '../../store/User/UserManage';
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage'
@ccclass
export default class NewClass extends cc.Component {

    //币预制件
    @property(cc.Prefab)
    chip_10: cc.Prefab = null
    @property(cc.Prefab)
    chip_20: cc.Prefab = null
    @property(cc.Prefab)
    chip_50: cc.Prefab = null
    @property(cc.Prefab)
    chip_100: cc.Prefab = null
    pushEventId: string = ''
    raceStateId: string = ''
    deskChipList: string[] = [] //桌子上的chip名称集合

    //落焦圈对象
    @property(cc.Sprite)
    focus_10: cc.Sprite = null
    @property(cc.Sprite)
    focus_20: cc.Sprite = null
    @property(cc.Sprite)
    focus_50: cc.Sprite = null
    @property(cc.Sprite)
    focus_100: cc.Sprite = null

    //下注按钮
    @property(cc.Sprite)
    button_10: cc.Sprite = null
    @property(cc.Sprite)
    button_20: cc.Sprite = null
    @property(cc.Sprite)
    button_50: cc.Sprite = null
    @property(cc.Sprite)
    button_100: cc.Sprite = null
    // onLoad () {}

    start() {

    }

    getUserDeskLocation(userId: string): Coordinate {
        let node = this.node.parent
        let scriptOb = node.getChildByName('Desk').getComponent('Desk')
        let chairName = scriptOb.deskSitList[userId].name
        let chairNode = node.getChildByName(chairName)
        return chairNode.getPosition()
    }

    closeAllFocus() {
        this.focus_10.node.active = false
        this.focus_20.node.active = false
        this.focus_50.node.active = false
        this.focus_100.node.active = false
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

    onEnable() {
        this.initFocus()
        this.pushEventId = randEventId()
        eventBus.on(EventType.BET_CHIP_CHANGE_EVENT, this.pushEventId, (betInfo: BetChipChangeInfo): void => {
            cc.log('收到下注值改变通知')
            let betValue = betInfo.toValue - betInfo.fromVal
            let userId = betInfo.userId
            let betLocationType = betInfo.betLocation
            let points = chipPoint[betLocationType]
            let fromLocation: Coordinate
            fromLocation = this.getUserDeskLocation(userId)
            this.flyAnimation(fromLocation, this.getXiaZhuLocation(points), betValue)
        })
        this.raceStateId = randEventId()
        eventBus.on(EventType.RACE_STATE_CHANGE_EVENT, this.raceStateId, (info: RaceStateChangeParam): void => {
            let to = info.toState
            switch (to) {
                case RaceState.FINISHED:
                    cc.log('下注组件收到单场比赛结束事件，清除桌子上的筹码')
                    this.destroyDeskChip()
                    break
            }
        })

        ////////////////////按钮事件  这个只负责设置选中下注值，发出下注是点击桌面位置来实现的
        this.button_10.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.closeAllFocus()
            this.focus_10.node.active = true
            UserManage.setSelectChipValue(10)
            cc.log('10元按钮被点击')
        })
        this.button_20.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.closeAllFocus()
            this.focus_20.node.active = true
            UserManage.setSelectChipValue(20)
            cc.log('20元按钮被点击')
        })
        this.button_50.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.closeAllFocus()
            this.focus_50.node.active = true
            UserManage.setSelectChipValue(50)
            cc.log('50元按钮被点击')
        })
        this.button_100.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.closeAllFocus()
            this.focus_100.node.active = true
            UserManage.setSelectChipValue(100)
            // let oningRaceNum = RoomManage.roomItem.oningRaceNum
            // RaceManage.raceList[oningRaceNum].betInfo[UserManage.userInfo.id].bridg += 100
            // cc.log('100元按钮被点击')
        })
    }

    initFocus() {
        this.closeAllFocus()
        let selectedValue = UserManage.getSelectChipValue()
        switch (selectedValue) {
            case 10:
                this.focus_10.node.active = true
                break
            case 20:
                this.focus_20.node.active = true
                break
            case 50:
                this.focus_50.node.active = true
                break
            case 100:
                this.focus_100.node.active = true
                break
            default:
                cc.log('错误的初始化下注选择值:' + selectedValue)
        }
    }
    //通过下注区间的2个水平点，获取中间随机的一个点，做为下注点
    getXiaZhuLocation(points: any): Coordinate {
        let leftPoints = points.left
        let rightPoints = points.right
        let randx = randFloatNum(leftPoints.x, rightPoints.x)
        let randy = rightPoints.y + randFloatNum(-10, 10)
        let newPoint = { x: randx, y: randy } as Coordinate
        return newPoint
    }

    onDisable() {
        eventBus.off(EventType.RACE_STATE_CHANGE_EVENT, this.raceStateId)
        eventBus.off(EventType.BET_CHIP_CHANGE_EVENT, this.pushEventId)
    }

    // update (dt) {}
}
