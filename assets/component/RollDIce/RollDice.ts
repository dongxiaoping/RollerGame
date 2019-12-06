/* 对摇色子进行管理
 *
 */
const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, LocalNoticeEventPara, LocalNoticeEventType } from '../../common/Const'
import RoomManage from '../../store/Room/RoomManage';
import RaceManage from '../../store/Races/RaceManage';

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
    private firstKeepStopTime: number //单位s 显示盒子，保持不动
    private rollKeepTime: number //单位s 晃动持续时间
    private secondKeepStopTime: number //晃动停止后，保持不动持续时间
    private diceShowTime: number //点数结果显示持续时间

    @property(cc.AudioSource)
    yaosaiziVoice: cc.AudioSource = null //摇色子声音语音
    

    private dicePicList: string[] = [
        'dice/dice_03205fea_02',
        'dice/dice_03205fea_03',
        'dice/dice_03205fea_04',
        'dice/dice_03205fea_05',
        'dice/dice_03205fea_06',
        'dice/dice_03205fea_07',
    ]
    start() {
        let timeConfig = RoomManage.getRollDiceTime()
        this.firstKeepStopTime = Math.floor((timeConfig / 9 * 2) * 100) / 100
        this.rollKeepTime = Math.floor((timeConfig / 9 * 3) * 100) / 100
        this.secondKeepStopTime = Math.floor((timeConfig / 9) * 100) / 100
        this.diceShowTime = Math.floor((timeConfig / 9 * 3) * 100) / 100
        this.scheduleOnce(() => {
            this.oning = true
            this.yaosaiziVoice.play()
            this.scheduleOnce(() => {
                this.oning = false
                this.scheduleOnce(() => {
                    this.isFlying = true
                    this.yaosaiziVoice.pause()
                    this.showDice()
                }, this.secondKeepStopTime);
            }, this.rollKeepTime);
        }, this.firstKeepStopTime);
    }

    //显示色子并返回点数
    showDice(): any {
        let oningNum = RoomManage.roomItem.oningRaceNum
        let points = RaceManage.raceList[oningNum].points
        cc.loader.loadRes(this.dicePicList[points.one - 1], (error, img) => {
            let myIcon = new cc.SpriteFrame(img);
            this.diceOne.spriteFrame = myIcon
        })
        cc.loader.loadRes(this.dicePicList[points.two - 1], (error, img) => {
            let myIcon = new cc.SpriteFrame(img);
            this.diceTwo.spriteFrame = myIcon
        })
        this.scheduleOnce(() => {
            cc.log('发出摇色子动画结束通知')
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, { //请除动作在房间里面处理
                type: LocalNoticeEventType.ROLL_DICE_FINISHED_NOTICE
            } as LocalNoticeEventPara)
        }, this.diceShowTime);
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
        if (this.node.angle === 10) {
            this.isAdd = false
        }
        if (this.node.angle === -10) {
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
