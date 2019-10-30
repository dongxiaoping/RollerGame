/* 对麻将牌进行管理
 */
const { ccclass, property } = cc._decorator;
import { TableLocationType } from '../../common/Const'
import { getLocationByLocaitonType, getCircleListByLocationType } from './DealMachineBase'
import { eventBus } from '../../common/EventBus'
import { EventType, GameState, ChildGameState, ChildGameParam } from '../../common/Const'
@ccclass
export default class DealMachine extends cc.Component {

    @property(cc.Prefab)
    mahjongs: cc.Prefab = null

    @property(cc.Prefab)
    mjDouble: cc.Prefab = null
    mahjongList: any[] = []  //一行显示的
    mjIndex: number = -1 //牌队列当前消耗位置，起牌

    onEnable() {
        this.initMaj()
    }

    //初始麻将列表的显示
    initMaj(): void {
        let layout = this.node.getChildByName('Layout')
        for (let i = 0; i < 16; i++) {
            let node = cc.instantiate(this.mahjongs)
            node.parent = layout
            node.setPosition(0, 0);
            node.active = true
            this.mahjongList.push(node)
        }
    }


    //从指定桌位开始，向4个排位进行发牌
    deal(tableLocationType: TableLocationType): void {
        let count = 0
        let circleList = getCircleListByLocationType(tableLocationType)
        function backFun() {
            ++count
            if (count >= 4) {
                cc.log('全部动画执行完毕')
                this.toShowMjResult()
            } else {
                cc.log('当前动画执行完毕')
                ++this.mjIndex
                this.flyAnimation(this.mjIndex, circleList[count], backFun)
            }
        }
        ++this.mjIndex
        this.flyAnimation(this.mjIndex, circleList[count], backFun)
    }

    //显示结果
    toShowMjResult(): void {
        cc.log('发出翻牌通知')
        eventBus.emit(EventType.CHILD_GAME_STATE_CHANGE, { parentState: GameState.SHOW_DOWN, childState: ChildGameState.SHOW_DOWN.OPEN_CARD_NOTICE, val: TableLocationType.LANDLORD } as ChildGameParam)
        setTimeout(()=>{
            eventBus.emit(EventType.CHILD_GAME_STATE_CHANGE, { parentState: GameState.SHOW_DOWN, childState: ChildGameState.SHOW_DOWN.OPEN_CARD_NOTICE, val: TableLocationType.LAND } as ChildGameParam)
        },1000)
        setTimeout(()=>{
            eventBus.emit(EventType.CHILD_GAME_STATE_CHANGE, { parentState: GameState.SHOW_DOWN, childState: ChildGameState.SHOW_DOWN.OPEN_CARD_NOTICE, val: TableLocationType.MIDDLE } as ChildGameParam)
        },2000)
        setTimeout(()=>{
            eventBus.emit(EventType.CHILD_GAME_STATE_CHANGE, { parentState: GameState.SHOW_DOWN, childState: ChildGameState.SHOW_DOWN.OPEN_CARD_NOTICE, val: TableLocationType.SKY } as ChildGameParam)
        },3000)
    }



    /*未发牌行的指定位置到桌位的发牌动画
     *@mjIndex 未发牌行的指定位置
     *@tableLocation 桌子的位置
     *@backFunc 执行完毕回调函数
     */
    flyAnimation(mjIndex: number, tableLocationType: TableLocationType, func: any) {
        if (this.mahjongList.length <= 0) {
            return
            cc.log('没有麻将队列')
        }
        let t = this.mahjongList[this.mjIndex]
        t.getChildByName('One').active = false
        t.getChildByName('Two').active = false

        let node = cc.instantiate(this.mjDouble)
        node.name = node.name + tableLocationType
        let rootOb = this.node.parent
        node.parent = rootOb
        node.setPosition(110.968, -193.548);
        node.active = true

        let location = getLocationByLocaitonType(tableLocationType)
        let action = cc.moveTo(0.5, location.x, location.y)
        let b = cc.sequence(action, cc.callFunc(func, this))
        node.runAction(b)
    }

    start() {

    }

    // update (dt) {}
}
