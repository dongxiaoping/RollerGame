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

    localEventId: string
    start() {

    }

    open(tableLocationType: TableLocationType) {
        let oneValue: number
        let twoValue: number
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        let majongResult = RaceManage.raceList[oningRaceNum].majongResult
        oneValue = majongResult[tableLocationType].one
        twoValue = majongResult[tableLocationType].two
        this.openAnimation(this.one, oneValue, () => {
            setTimeout(() => {
                this.openAnimation(this.two, twoValue, () => { })
            }, 250)
        })
    }

    openAnimation(ob: cc.Sprite, val: number, callBack: any) {
        let count = 1
        let setIn = setInterval(() => {
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
        }, 100)
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
