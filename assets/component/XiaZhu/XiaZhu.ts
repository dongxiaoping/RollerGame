/* 对下注的显示以及相关功能进行管理
 * 下注动画在这里实现  下注按钮事件在桌子上实现
 */
const { ccclass, property } = cc._decorator;
import { randEventId, randFloatNum } from '../../common/Util'
import { BetChipChangeInfo, EventType, Coordinate, chipPoint, RaceStateChangeParam, RaceState, chipObData, LocalNoticeEventPara, LocalNoticeEventType } from '../../common/Const'
import { eventBus } from '../../common/EventBus'
import UserManage from '../../store/User/UserManage'
import ConfigManage from '../../store/Config/ConfigManage';
@ccclass
export default class NewClass extends cc.Component {

    //币预制件
    @property(cc.Prefab)
    chip_1: cc.Prefab = null
    @property(cc.Prefab)
    chip_2: cc.Prefab = null
    @property(cc.Prefab)
    chip_3: cc.Prefab = null
    @property(cc.Prefab)
    chip_4: cc.Prefab = null
    pushEventId: string = ''
    deskChipList: string[] = [] //桌子上的chip名称集合

    //落焦圈对象
    @property(cc.Sprite)
    focus_1: cc.Sprite = null
    @property(cc.Sprite)
    focus_2: cc.Sprite = null
    @property(cc.Sprite)
    focus_3: cc.Sprite = null
    @property(cc.Sprite)
    focus_4: cc.Sprite = null

    //下注按钮
    @property(cc.Sprite)
    button_1: cc.Sprite = null
    @property(cc.Sprite)
    button_2: cc.Sprite = null
    @property(cc.Sprite)
    button_3: cc.Sprite = null
    @property(cc.Sprite)
    button_4: cc.Sprite = null
    chipValueList: number[] = [] //下注值集合
    flyTime: number = 0.35  //下注硬币飞行时间
    ownChipSize: number = 40 //自己下注硬币的大（
    otherMemberChipSize: number = 25 //其它成员下注硬币的大
    @property(cc.AudioSource)
    chipBetVoice: cc.AudioSource = null //硬币声音语音
    @property(cc.AudioSource)
    ownChipBetVoice: cc.AudioSource = null //自己下注附加的声音
    betCancelEventId: string
    start() {

    }

    getUserChairPosition(userId: string): Coordinate {
        let node = this.node.parent
        let deskOb = node.getChildByName('Desk').getComponent('Desk')
        return deskOb.chairManage.getChairPositionByUserId(userId)
    }

    closeAllFocus() {
        this.focus_1.node.active = false
        this.focus_2.node.active = false
        this.focus_3.node.active = false
        this.focus_4.node.active = false
    }

    flyAnimation(isOwn: Boolean, fromLocation: Coordinate, toLocaiton: Coordinate, val: number, chipInfo: chipObData) {
        let node = this.createChip(isOwn, val, chipInfo)
        node.setPosition(fromLocation.x, fromLocation.y);
        node.active = true
        let action = cc.moveTo(this.flyTime, toLocaiton.x, toLocaiton.y)
        let b = cc.sequence(action, cc.callFunc(() => {
            if (ConfigManage.isTxMusicOpen()) {
                this.chipBetVoice.play()
            }
        }, this))
        if (isOwn && ConfigManage.isTxMusicOpen()) {
            this.ownChipBetVoice.play()
        }
        node.runAction(b)
    }

    createChip(isOwn: Boolean, val: number, chipInfo: chipObData): any {
        let chip: cc.Prefab
        if (val === this.chipValueList[0]) {
            chip = this.chip_1
        } else if (val === this.chipValueList[1]) {
            chip = this.chip_2
        } else if (val === this.chipValueList[2]) {
            chip = this.chip_3
        } else {
            chip = this.chip_4
        }
        let node = cc.instantiate(chip)
        node.name = randEventId()
        let label = node.getChildByName('ValLabel').getComponent(cc.Label)
        label.string = val + ''
        //设置chip信息
        node.getComponent('Chip').initData(chipInfo)
        if (isOwn) {
            label.fontSize = 14
            node.width = this.ownChipSize
            node.height = this.ownChipSize
        } else {
            label.fontSize = 10
            node.width = this.otherMemberChipSize
            node.height = this.otherMemberChipSize
        }
        node.parent = this.node.parent.getChildByName('Desk')
        this.deskChipList.push(node.name)
        return node
    }

    //清除发出去的chip
    destroyDeskChip(): void {
        this.deskChipList.forEach(element => {
            let ob = this.node.parent.getChildByName('Desk').getChildByName(element)
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

    backAllChipe() {
        let isSuccess = false
        this.deskChipList.forEach(element => {
            let desk = this.node.parent.getChildByName('Desk')
            let ob = this.node.parent.getChildByName('Desk').getChildByName(element)
            if (ob) {
                isSuccess = true
                let jsOb = ob.getComponent('Chip')
                jsOb.backChip()
            }
        });
        return isSuccess
    }

    onEnable() {
        this.chipValueList = ConfigManage.getChipValList()
        this.button_1.node.getChildByName('Label').getComponent(cc.Label).string = this.chipValueList[0] + ''
        this.button_2.node.getChildByName('Label').getComponent(cc.Label).string = this.chipValueList[1] + ''
        this.button_3.node.getChildByName('Label').getComponent(cc.Label).string = this.chipValueList[2] + ''
        this.button_4.node.getChildByName('Label').getComponent(cc.Label).string = this.chipValueList[3] + ''
        this.initFocus()
        this.pushEventId = randEventId()
        eventBus.on(EventType.BET_CHIP_CHANGE_EVENT, this.pushEventId, (betInfo: BetChipChangeInfo): void => {
            cc.log('收到下注值改变通知')
            this.toXiaZhu(betInfo)
        })
        this.betCancelEventId = randEventId()
        eventBus.on(EventType.BET_CANCE_NOTICE, this.betCancelEventId, (info: BetChipChangeInfo): void => {
            this.deskChipList.forEach(element => {
                let ob = this.node.parent.getChildByName(element)
                if (ob) {
                    let jsOb = ob.getComponent('Chip')
                    jsOb.cancelChip(info)
                }
            });
        })

        ////////////////////按钮事件  这个只负责设置选中下注值，发出下注是点击桌面位置来实现的
        this.button_1.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (ConfigManage.isTxMusicOpen()) {
                this.ownChipBetVoice.play()
            }
            this.closeAllFocus()
            this.focus_1.node.active = true
            UserManage.setSelectChipValue(this.chipValueList[0])
            cc.log('1硬币被点击')
        })
        this.button_2.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (ConfigManage.isTxMusicOpen()) {
                this.ownChipBetVoice.play()
            }
            this.closeAllFocus()
            this.focus_2.node.active = true
            UserManage.setSelectChipValue(this.chipValueList[1])
            cc.log('2硬币被点击')
        })
        this.button_3.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (ConfigManage.isTxMusicOpen()) {
                this.ownChipBetVoice.play()
            }
            this.closeAllFocus()
            this.focus_3.node.active = true
            UserManage.setSelectChipValue(this.chipValueList[2])
            cc.log('3硬币被点击')
        })
        this.button_4.node.on(cc.Node.EventType.TOUCH_END, () => {
            if (ConfigManage.isTxMusicOpen()) {
                this.ownChipBetVoice.play()
            }
            this.closeAllFocus()
            this.focus_4.node.active = true
            UserManage.setSelectChipValue(this.chipValueList[3])
            cc.log('4硬币被点击')
        })
    }

    toXiaZhu(betInfo: BetChipChangeInfo): void {
        let betValue = betInfo.toValue - betInfo.fromVal
        let userId = betInfo.userId
        let betLocationType = betInfo.betLocation
        let points = chipPoint[betLocationType]
        let fromLocation: Coordinate
        fromLocation = this.getUserChairPosition(userId)
        if (fromLocation === null) {
            cc.log('没找到用户所在椅子的位置')
            return
        }
        let isOwn: Boolean = false //是否是当前用户下的注
        if (userId === UserManage.userInfo.id) {
            cc.log('是自己投的注')
            isOwn = true
        }
        let chipList = this.splitChipList(betValue)
        chipList.forEach((val: number) => {
            if (isOwn) {
                fromLocation = this.getChipLocationByChipValue(val)
            }
            let chipInfo = { userId: userId, chipVal: val, betLocation: betLocationType } as chipObData
            this.flyAnimation(isOwn, fromLocation, this.getXiaZhuLocation(points), val, chipInfo)
        })
    }

    // userId: string,
    // val: number,
    // betLocation: betLocaion,
    // fromLocation: Coordinate,
    // toLocaiton: Coordinate

    splitChipList(theVal: number) {
        let theList = []
        for (let i = (this.chipValueList.length - 1); i >= 0; i--) {
            let targeVal = this.chipValueList[i]
            while (theVal >= targeVal) {
                theList.push(targeVal)
                theVal = theVal - targeVal
            }
            if (theVal <= 0) {
                break
            }
        }
        return theList
    }


    getChipLocationByChipValue(val: number): Coordinate {
        let location: Coordinate = { x: 127, y: -245 }
        switch (val) {
            case this.chipValueList[0]:
                location = { x: 127, y: -245 }
                break
            case this.chipValueList[1]:
                location = { x: 223, y: -245 }
                break
            case this.chipValueList[2]:
                location = { x: 318, y: -245 }
                break
            case this.chipValueList[3]:
                location = { x: 414, y: -245 }
                break
            default:
                cc.log('下注值异常：' + val)
        }
        return location
    }

    initFocus() {
        this.closeAllFocus()
        let selectedValue = UserManage.getSelectChipValue()
        switch (selectedValue) {
            case this.chipValueList[0]:
                this.focus_1.node.active = true
                break
            case this.chipValueList[1]:
                this.focus_2.node.active = true
                break
            case this.chipValueList[2]:
                this.focus_3.node.active = true
                break
            case this.chipValueList[3]:
                this.focus_4.node.active = true
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
        eventBus.off(EventType.BET_CHIP_CHANGE_EVENT, this.pushEventId)
        eventBus.off(EventType.BET_CANCE_NOTICE, this.betCancelEventId)
    }

    update(dt) {
        this.focus_1.node.angle = this.focus_1.node.angle + 0.2
        this.focus_2.node.angle = this.focus_2.node.angle + 0.2
        this.focus_3.node.angle = this.focus_3.node.angle + 0.2
        this.focus_4.node.angle = this.focus_4.node.angle + 0.2
    }
}
