/* 发出去的一组麻将对象
 * 对一组麻将的结果显示以及翻牌动画进行管理
 *
 */
import { TableLocationType } from '../../common/Const'
const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, IconValueList, LocalNoticeEventPara, LocalNoticeEventType } from '../../common/Const'
import { randEventId } from '../../common/Util'
import RoomManage from '../../store/Room/RoomManage'
import RaceManage from '../../store/Races/RaceManage'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    one: cc.Sprite = null;

    @property(cc.Sprite)
    two: cc.Sprite = null;

    oneThirdIcon: cc.SpriteFrame = null
    halfIcon: cc.SpriteFrame = null
    allIcon: cc.SpriteFrame = null

    singleIntervalTime = 0.1  //单个动作内部小动作的间隔时间 s  0.3*2*4
    twoIntervalTime = 0.25  //两张之间的间隔时间 s    0.25*4
    twoLocationIntervalTime = 1 //两个位置之间的发牌间隔时间 s 1*3
    amStopKeepTime = 1 //牌全部发完后的停顿时间 s  1
    //一共 2.5 + 1+3+1 = 7.5s
    localEventId: string
    start() {

    }

    open(tableLocationType: TableLocationType) {
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        let majongScore = RaceManage.raceList[oningRaceNum].getMahjongScore(tableLocationType)
        cc.log('当前翻牌位置：' + tableLocationType)
        cc.log(majongScore)
        this.openAnimation(this.one, majongScore.one, () => {
            setTimeout(() => {
                this.openAnimation(this.two, majongScore.two, () => {
                    let nextLocation = this.getNextTableLocation(tableLocationType)
                    if (nextLocation) {  //下个位置的翻牌
                        setTimeout(() => {
                            cc.log('发出下个位置的翻牌请求,下个位置为' + nextLocation + ',当前位置为：' + tableLocationType)
                            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: nextLocation } as LocalNoticeEventPara)
                        }, this.twoLocationIntervalTime * 1000);
                    } else {
                        cc.log('全部的翻牌动作执行完毕，发出翻牌动画结束通知')
                        setTimeout(() => {
                            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_FINISHED_NOTICE } as LocalNoticeEventPara)
                        }, this.amStopKeepTime * 1000)
                    }
                })
            }, this.twoIntervalTime * 1000)
        })
    }

    getNextTableLocation(tableLocationType: TableLocationType): TableLocationType {
        switch (tableLocationType) {
            case TableLocationType.LANDLORD:
                return TableLocationType.LAND
            case TableLocationType.LAND:
                return TableLocationType.MIDDLE
            case TableLocationType.MIDDLE:
                return TableLocationType.SKY
            case TableLocationType.SKY:
                return null
        }
        return null
    }

    openAnimation(ob: cc.Sprite, val: number, callBack: any) {
        let count = 1
        let setIn = setInterval(() => {
            try {
                switch (count) {
                    case 1:
                        ob.spriteFrame = this.oneThirdIcon
                        break;
                    case 2:
                        ob.spriteFrame = this.halfIcon
                        break;
                    case 3:
                        ob.spriteFrame = this.allIcon
                        this.drawResult(ob, val)
                        clearInterval(setIn)
                        callBack()
                        break;
                }
                count++
                cc.log('循环执行翻牌动画')
            } catch (e) {
                cc.log('定时器出错')
                clearInterval(setIn)
            }
        }, this.singleIntervalTime * 1000)
    }

    drawResult(ob: cc.Sprite, val: number) {
        let list = IconValueList[val]
        for (let i = 0; i < list.length; i++) {
            ob.node.getChildByName(list[i]).active = true
        }

    }

    randNum(n: number, m: number) {
        let c = m - n + 1;
        return Math.floor(Math.random() * c + n);
    }

    onEnable() {
        cc.loader.loadRes('mahjong/mahjong_62fa7d43_02', (error, img) => {
            this.oneThirdIcon = new cc.SpriteFrame(img);
        })
        cc.loader.loadRes('mahjong/mahjong_62fa7d43_03', (error, img) => {
            this.halfIcon = new cc.SpriteFrame(img);
        })
        cc.loader.loadRes('mahjong/mahjong_62fa7d43_04', (error, img) => {
            this.allIcon = new cc.SpriteFrame(img);
        })

        this.localEventId = randEventId()
        eventBus.on(EventType.LOCAL_NOTICE_EVENT, this.localEventId, (info: LocalNoticeEventPara) => {
            if (info.type === LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE) {
                let tableLocationType = info.info as TableLocationType
                if (this.node.name === 'MjDouble' + tableLocationType) {
                    cc.log('接收到翻牌通知')
                    this.open(tableLocationType)
                    cc.log(info)
                }
            }
        })
    }
    onDisable() {
        eventBus.off(EventType.LOCAL_NOTICE_EVENT, this.localEventId)
    }

    // update (dt) {}
}
