/* 对摇色子进行管理
 *
 */
const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, LocalNoticeEventPara, LocalNoticeEventType } from '../../common/Const'
import RoomManage from '../../store/Room/RoomManage';
import RaceManage from '../../store/Races/RaceManage';
import ConfigManage from '../../store/Config/ConfigManage';

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Sprite)
    boxBody: cc.Sprite = null

    @property(cc.Sprite)
    diceOne: cc.Sprite = null
    @property(cc.Sprite)
    diceTwo: cc.Sprite = null

    private isAdd: boolean = true
    private oning: boolean = false //是否摆动
    private isFlying: boolean = false
    private firstKeepStopTime: number = 0.2 //单位s 显示盒子，保持不动
    private rollKeepTime: number = 0.3 //单位s 晃动持续时间
    private secondKeepStopTime: number = 0.2 //晃动停止后，保持不动持续时间
    private diceShowTime: number = 0.3 //点数结果显示持续时间
    private swingVal = 14 //摆动幅度
    @property(cc.AudioSource)
    yaosaiziVoice: cc.AudioSource = null //摇色子声音语音

    @property([cc.SpriteFrame])
    private dicePicList: cc.SpriteFrame[] = []

    start() {
        this.initTime()
        this.scheduleOnce(() => {
            this.oning = true
            if (ConfigManage.isTxMusicOpen()) {
                this.yaosaiziVoice.play()
            }
            this.scheduleOnce(() => {
                this.oning = false
                this.yaosaiziVoice.pause()
                this.scheduleOnce(() => {
                    this.showDice()
                }, this.secondKeepStopTime)
            }, this.rollKeepTime);
        }, this.firstKeepStopTime);
    }

    initTime() {
        let weights = Math.floor((ConfigManage.getRollDiceTime() / (this.firstKeepStopTime + this.rollKeepTime + this.secondKeepStopTime + this.diceShowTime)) * 100) / 100
        this.firstKeepStopTime = weights * this.firstKeepStopTime
        this.rollKeepTime = weights * this.rollKeepTime
        this.secondKeepStopTime = weights * this.secondKeepStopTime
        this.diceShowTime = weights * this.diceShowTime
    }

    //显示色子并返回点数
    showDice(): any {
        let oningNum = RoomManage.roomItem.oningRaceNum
        let points = RaceManage.raceList[oningNum].points
        this.diceOne.spriteFrame = this.dicePicList[points.one - 1]
        this.isFlying = true
        this.diceTwo.spriteFrame = this.dicePicList[points.two - 1]
        this.scheduleOnce(() => {
            cc.log('发出摇色子动画结束通知')
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { //请除动作在房间里面处理
                type: LocalNoticeEventType.ROLL_DICE_FINISHED_NOTICE
            } as LocalNoticeEventPara)
        }, this.diceShowTime)
    }

    randNum(n: number, m: number): number {
        var c = m - n + 1;
        return Math.floor(Math.random() * c + n);

    }

    update(dt) {
        this.waggle()
        this.BoxFlying()
    }


    BoxFlying(): void {
        if (!this.isFlying) {
            return
        }
        let setY = this.boxBody.node.getPosition().y
        if (setY > 600) {
            return
        }
        let setX = this.boxBody.node.getPosition().x
        this.boxBody.node.setPosition(setX + 4, setY + 20)
        if (this.boxBody.node.angle > -10) {
            this.boxBody.node.angle = this.boxBody.node.angle - 1
        }
    }

    //摆动动画
    waggle(): void {
        if (this.node.angle === this.swingVal) {
            this.isAdd = false
        }
        if (this.node.angle === -this.swingVal) {
            this.isAdd = true
        }
        if (!this.oning && this.node.angle === 0) {
            return
        }
        if (this.isAdd) {
            this.node.angle = this.node.angle + 2
        } else {
            this.node.angle = this.node.angle - 2
        }
    }
}
