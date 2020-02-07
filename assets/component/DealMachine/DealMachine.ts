/* 对麻将牌进行管理
 */
const { ccclass, property } = cc._decorator;
import { TableLocationType } from '../../common/Const'
import { getLocationByLocaitonType, getCircleListByLocationType } from './DealMachineBase'
import { eventBus } from '../../common/EventBus'
import { EventType, LocalNoticeEventType, LocalNoticeEventPara } from '../../common/Const'
import RoomManage from '../../store/Room/RoomManage';
import ConfigManage from '../../store/Config/ConfigManage';
@ccclass
export default class DealMachine extends cc.Component {

    @property(cc.Prefab)
    mahjongs: cc.Prefab = null

    @property(cc.Prefab)
    mjDouble: cc.Prefab = null
    mahjongList: any[] = []  //一行显示的
    mjIndex: number = -1 //牌队列当前消耗位置，起牌
    mahongLong: number = 20 //麻将队列的长度

    mahjongShowKeepTime: number = 0.8 //单位s 发牌结束后停顿显示持续时间
    flyTime: any = { sky: 0.6, middle: 0.6, land: 0.4, landlord: 0.5 } //单位s  指定位置发牌动画持续时间

    private mahjongNameList = [] //麻将名称列表
    @property(cc.AudioSource)
    fapaiVoice: cc.AudioSource = null //发牌语音
    onEnable() {
        this.initTime()
        this.initMaj()
    }

    initTime() {
        let weights = Math.floor((ConfigManage.getDealTime() / (this.mahjongShowKeepTime + this.flyTime.sky + this.flyTime.middle
            + this.flyTime.land + this.flyTime.landlord)) * 100) / 100
        this.mahjongShowKeepTime = weights * this.mahjongShowKeepTime
        this.flyTime.sky = weights * this.flyTime.sky
        this.flyTime.middle = weights * this.flyTime.middle
        this.flyTime.land = weights * this.flyTime.land
        this.flyTime.landlord = weights * this.flyTime.landlord
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
        this.mahjongNameList.push({ locationType: TableLocationType.LAND, name: 'MjDouble' + TableLocationType.LAND, location: getLocationByLocaitonType(TableLocationType.LAND) })
        this.mahjongNameList.push({ locationType: TableLocationType.LANDLORD, name: 'MjDouble' + TableLocationType.LANDLORD, location: getLocationByLocaitonType(TableLocationType.LANDLORD) })
        this.mahjongNameList.push({ locationType: TableLocationType.SKY, name: 'MjDouble' + TableLocationType.SKY, location: getLocationByLocaitonType(TableLocationType.SKY) })
        this.mahjongNameList.push({ locationType: TableLocationType.MIDDLE, name: 'MjDouble' + TableLocationType.MIDDLE, location: getLocationByLocaitonType(TableLocationType.MIDDLE) })
    }



    //从指定桌位开始，向4个排位进行发牌
    deal(tableLocationType: TableLocationType): void {
        let count = 0
        let circleList = getCircleListByLocationType(tableLocationType)
        function backFun() {
            ++count
            if (count >= 4) {
                //cc.log('全部动画执行完毕')
                this.scheduleOnce(() => {
                    //cc.log('发牌动画执行完毕通知')
                    eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                        type: LocalNoticeEventType.DELIVERY_CARD_FINISHED_NOTICE
                    } as LocalNoticeEventPara)
                }, this.mahjongShowKeepTime);
            } else {
                //cc.log('当前动画执行完毕')
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

    //在下注以及比大小开始环节，如果出现麻将没有，应该立即补上
    checkAndAddMajong() {
        this.mahjongNameList.forEach((item: any) => {
            let mhjong = this.node.parent.getChildByName('Desk').getChildByName(item.name)
            if (!mhjong) {
                mhjong = cc.instantiate(this.mjDouble)
                mhjong.name = item.name
                mhjong.parent = this.node.parent
                mhjong.setPosition(item.location.x, item.location.y);
            }
        })
    }

    cleanMajong() {
        this.mahjongNameList.forEach((item: any) => {
            let mhjong = this.node.parent.getChildByName('Desk').getChildByName(item.name)
            if (mhjong) {
                mhjong.active = false
                mhjong.destroy()
            }
        })
    }

    /*未发牌行的指定位置到桌位的发牌动画
     *@mjIndex 未发牌行的指定位置
     *@tableLocation 桌子的位置
     *@backFunc 执行完毕回调函数
     */
    flyAnimation(mjIndex: number, tableLocationType: TableLocationType, func: any) {
        if (this.mahjongList.length <= 0) {
            //cc.log('没有麻将队列')
            return
        }
        if (this.mjIndex >= this.mahjongList.length - 1) {
            this.reSetMahjong()
            this.flyAnimation(this.mjIndex, tableLocationType, func)
            return
        }
        let mahjongName = 'MjDouble' + tableLocationType
        let mhjong = this.node.parent.getChildByName('Desk').getChildByName(mahjongName)
        if (mhjong) {
            mhjong.active = false
            mhjong.destroy()
        }
        let t = this.mahjongList[this.mjIndex]
        t.getChildByName('One').active = false
        t.getChildByName('Two').active = false

        let node = cc.instantiate(this.mjDouble)
        node.name = mahjongName
        node.parent = this.node.parent.getChildByName('Desk')
        node.setPosition(320, 207);
        node.active = true

        let location = getLocationByLocaitonType(tableLocationType)
        let flyTime: number = this.flyTime[tableLocationType]
        let action = cc.moveTo(flyTime, location.x, location.y)
        let b = cc.sequence(action, cc.callFunc(func, this))
        if (ConfigManage.isTxMusicOpen()) {
            this.fapaiVoice.play()
        }
        node.runAction(b)
    }

    start() {

    }

    // update (dt) {}
}
