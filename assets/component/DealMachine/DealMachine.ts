/* 对麻将牌进行管理
 */
const { ccclass, property } = cc._decorator;
import { TableLocationType } from '../../common/Const'
import { getLocationByLocaitonType, getCircleListByLocationType } from './DealMachineBase'
import { eventBus } from '../../common/EventBus'
import { EventType, LocalNoticeEventType, LocalNoticeEventPara } from '../../common/Const'
import RoomManage from '../../store/Room/RoomManage';
@ccclass
export default class DealMachine extends cc.Component {

    @property(cc.Prefab)
    mahjongs: cc.Prefab = null

    @property(cc.Prefab)
    mjDouble: cc.Prefab = null
    mahjongList: any[] = []  //一行显示的
    mjIndex: number = -1 //牌队列当前消耗位置，起牌
    mahongLong: number = 20 //麻将队列的长度
    mahjongFlyTime: number //单位s  一张牌的发牌动画持续时间
    mahjongShowKeepTime: number //单位s 发牌结束后停顿显示持续时间
    @property(cc.AudioSource)
    fapaiVoice: cc.AudioSource = null //发牌语音
    onEnable() {
        this.initMaj()
    }

    //初始麻将列表的显示
    initMaj(): void {
        this.mjIndex = -1
        let layout = this.node.getChildByName('Layout')
        for (let i = 0; i < this.mahongLong; i++) {
            let node = cc.instantiate(this.mahjongs)
            node.parent = layout
            node.setPosition(0, 0);
            node.active = true
            this.mahjongList.push(node)
        }
    }


    //从指定桌位开始，向4个排位进行发牌
    deal(tableLocationType: TableLocationType): void {
        let timeConfig = RoomManage.getDealTime()
        this.mahjongShowKeepTime = Math.floor((timeConfig / 3) * 100) / 100
        this.mahjongFlyTime = Math.floor((timeConfig / 6) * 100) / 100
        let count = 0
        let circleList = getCircleListByLocationType(tableLocationType)
        function backFun() {
            ++count
            if (count >= 4) {
                cc.log('全部动画执行完毕')
                this.scheduleOnce(() => {
                    cc.log('发牌动画执行完毕通知')
                    eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                        type: LocalNoticeEventType.DELIVERY_CARD_FINISHED_NOTICE
                    } as LocalNoticeEventPara)
                }, this.mahjongShowKeepTime);
            } else {
                cc.log('当前动画执行完毕')
                ++this.mjIndex
                this.flyAnimation(this.mjIndex, circleList[count], backFun)
            }
        }
        ++this.mjIndex
        this.flyAnimation(this.mjIndex, circleList[count], backFun)
    }

    reSetMahjong() {
        for (let i = 0; i < this.mahongLong; i++) {
            let t = this.mahjongList[i]
            t.getChildByName('One').active = true
            t.getChildByName('Two').active = true
        }
        this.mjIndex = 0
    }

    /*未发牌行的指定位置到桌位的发牌动画
     *@mjIndex 未发牌行的指定位置
     *@tableLocation 桌子的位置
     *@backFunc 执行完毕回调函数
     */
    flyAnimation(mjIndex: number, tableLocationType: TableLocationType, func: any) {
        if (this.mahjongList.length <= 0) {
            cc.log('没有麻将队列')
            return
        }
        if (this.mjIndex >= this.mahjongList.length) {
            this.reSetMahjong()
            this.flyAnimation(this.mjIndex, tableLocationType, func)
            return
        }
        let t = this.mahjongList[this.mjIndex]
        t.getChildByName('One').active = false
        t.getChildByName('Two').active = false

        let node = cc.instantiate(this.mjDouble)
        node.name = node.name + tableLocationType
        let rootOb = this.node.parent
        node.parent = rootOb
        node.setPosition(320, 207);
        node.active = true

        let location = getLocationByLocaitonType(tableLocationType)
        let flyTime: number
        switch (tableLocationType) {
            case TableLocationType.LAND:
                flyTime = this.mahjongFlyTime * 0.5
                break
            case TableLocationType.LANDLORD:
                flyTime = this.mahjongFlyTime * 0.6
                break
            case TableLocationType.MIDDLE:
                flyTime = this.mahjongFlyTime * 0.7
                break
            case TableLocationType.SKY:
                flyTime = this.mahjongFlyTime * 0.7
                break
        }
        let action = cc.moveTo(flyTime, location.x, location.y)
        let b = cc.sequence(action, cc.callFunc(func, this))
        this.fapaiVoice.play()
        node.runAction(b)
    }

    start() {

    }

    // update (dt) {}
}
