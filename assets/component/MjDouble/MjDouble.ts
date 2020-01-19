/* 发出去的一组麻将对象
 * 对一组麻将的结果显示以及翻牌动画进行管理
 *
 */
import { TableLocationType, DiceCountInfo } from '../../common/Const'
const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, LocalNoticeEventPara, LocalNoticeEventType } from '../../common/Const'
import { randEventId } from '../../common/Util'
import RoomManage from '../../store/Room/RoomManage'
import RaceManage from '../../store/Races/RaceManage'
import ConfigManage from '../../store/Config/ConfigManage';
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    one: cc.Sprite = null;

    @property(cc.Sprite)
    two: cc.Sprite = null;

    @property(cc.SpriteFrame)
    oneThirdIcon: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    halfIcon: cc.SpriteFrame = null
    @property(cc.SpriteFrame)
    allIcon: cc.SpriteFrame = null
    @property([cc.SpriteFrame])
    majongIcons: cc.SpriteFrame[] = [] //结果图

    singleIntervalTime = 0.2 //翻牌 (开一张牌的时间)
    twoIntervalTime = 0.1  //两张牌之间的停顿时间 s  
    twoLocationIntervalTime = 0.5 //两个位置之间的翻牌间隔时间 s 
    localEventId: string

    @property([cc.AudioSource])
    majongVoiceZhenDian: cc.AudioSource[] = [] //整点的报音 0 为鄙十
    @property([cc.AudioSource])
    majongVoiceHalf: cc.AudioSource[] = [] //半点的报音 0 为对子

    @property(cc.AudioSource)
    kaipaiVoice: cc.AudioSource = null //开牌
    @property(cc.AudioSource)
    erbagangVoice: cc.AudioSource = null //二八杠

    openHeight: number = 23 //开牌跳起高度

    start() {
        this.initTime()
    }


    initTime() {
        let weights = Math.floor((ConfigManage.getShowDownTime() / 4 / (this.singleIntervalTime * 2 + this.twoIntervalTime + this.twoLocationIntervalTime)) * 100) / 100
        this.twoIntervalTime = weights * this.twoIntervalTime
        this.singleIntervalTime = weights * this.singleIntervalTime
        this.twoLocationIntervalTime = weights * this.twoLocationIntervalTime
    }

    open(tableLocationType: TableLocationType) {
        let oningRaceNum = RoomManage.roomItem.oningRaceNum
        let majongScore = RaceManage.raceList[oningRaceNum].getMahjongScore(tableLocationType)
        cc.log('当前翻牌位置：' + tableLocationType)
        cc.log(majongScore)
        this.openAnimation(this.one, majongScore.one, () => {
            this.scheduleOnce(() => {
                this.toVoiceNotice(majongScore)
                this.openAnimation(this.two, majongScore.two, () => {
                    let nextLocation = this.getNextTableLocation(tableLocationType)
                    if (nextLocation) {  //下个位置的翻牌
                        this.scheduleOnce(() => {
                            cc.log('发出下个位置的翻牌请求,下个位置为' + nextLocation + ',当前位置为：' + tableLocationType)
                            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_REQUEST_NOTICE, info: nextLocation } as LocalNoticeEventPara)
                        }, this.twoLocationIntervalTime);
                    } else {
                        cc.log('全部的翻牌动作执行完毕，发出翻牌动画结束通知')
                        eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { type: LocalNoticeEventType.OPEN_CARD_FINISHED_NOTICE } as LocalNoticeEventPara)
                    }
                })
            }, this.twoIntervalTime);
        })
    }

    //报点数
    toVoiceNotice(majongScore: DiceCountInfo) {
        let val: number = 0
        if (majongScore.one === majongScore.two) {
            if (ConfigManage.isTxMusicOpen()) {
                this.majongVoiceHalf[0].play() //对子
            }
            return
        }

        if ((majongScore.one === 2 && majongScore.two === 8) || (majongScore.one === 8 && majongScore.two === 2)) {
            if (ConfigManage.isTxMusicOpen()) {
                this.erbagangVoice.play()
            }
            return
        }
        if (majongScore.one === 0.5 && majongScore.two === 0.5) {
            if (ConfigManage.isTxMusicOpen()) {
                this.majongVoiceZhenDian[1].play()
            }
            return
        }
        if (majongScore.one === 0.5 || majongScore.two === 0.5) { //半点
            val = majongScore.one === 0.5 ? majongScore.two : majongScore.one
            if (ConfigManage.isTxMusicOpen()) {
                this.majongVoiceHalf[val].play()
            }
            return
        }
        val = majongScore.two + majongScore.one
        if (val >= 10) {
            val -= 10
        }
        if (ConfigManage.isTxMusicOpen()) {
            this.majongVoiceZhenDian[val].play()
        }
    }

    getNextTableLocation(tableLocationType: TableLocationType): TableLocationType {
        switch (tableLocationType) {
            case TableLocationType.LANDLORD:
                return TableLocationType.SKY
            case TableLocationType.SKY:
                return TableLocationType.MIDDLE
            case TableLocationType.MIDDLE:
                return TableLocationType.LAND
            case TableLocationType.SKY:
                return null
        }
        return null
    }

    openAnimation(ob: cc.Sprite, val: number, callBack: any) {
        let location = ob.node.getPosition()
        let timeOne = this.singleIntervalTime / 3 * 2
        let timeTwo = this.singleIntervalTime / 3
        ob.spriteFrame = this.oneThirdIcon
        this.scheduleOnce(() => {
            if (ConfigManage.isTxMusicOpen()) {
                this.kaipaiVoice.play()
            }
            ob.spriteFrame = this.halfIcon
            ob.node.setPosition(location.x, location.y + this.openHeight)
            this.scheduleOnce(() => {
                this.drawResult(ob, val)
                ob.spriteFrame = this.allIcon
                ob.node.setPosition(location.x, location.y)
                callBack()
            }, timeTwo);
        }, timeOne);
    }

    drawResult(ob: cc.Sprite, val: number) {
        val = val === 0.5 ? 0 : val
        ob.node.getChildByName('MajongSprite').getComponent(cc.Sprite).spriteFrame = this.majongIcons[val]
    }

    randNum(n: number, m: number) {
        let c = m - n + 1;
        return Math.floor(Math.random() * c + n);
    }

    onEnable() {
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
