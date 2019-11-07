/* 对摇色子进行管理
 *
 */
const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, LocalNoticeEventPara, LocalNoticeEventType} from '../../common/Const'

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Sprite)
    boxBody: cc.Sprite = null

    @property(cc.Sprite)
    diceOne: cc.Sprite = null
    @property(cc.Sprite)
    diceTwo: cc.Sprite = null

    private isAdd: boolean = true
    private oning: boolean = false
    private isFlying: boolean = false
    private beginTime: number = 0.5 //单位s 开始晃动的时间
    private endTime: number = 2.5  //单位s 晃动结束的时间
    private dicePicList: string[] = [
        'dice/dice_03205fea_02',
        'dice/dice_03205fea_03',
        'dice/dice_03205fea_04',
        'dice/dice_03205fea_05',
        'dice/dice_03205fea_06',
        'dice/dice_03205fea_07',
    ]
    start() {
        setTimeout((): void => {
            this.oning = true
        }, this.beginTime * 1000)
        setTimeout((): void => {
            this.oning = false
            setTimeout((): void => {
                this.isFlying = true
                this.showDice()
            }, 500) //晃动结束开盒子的时间
        }, this.endTime * 1000)
    }

    //显示色子并返回点数
    showDice(): any {
        let a = this.randNum(1, 6)
        cc.loader.loadRes(this.dicePicList[a - 1], (error, img) => {
            let myIcon = new cc.SpriteFrame(img);
            this.diceOne.spriteFrame = myIcon
        })
        let b = this.randNum(1, 6)
        cc.loader.loadRes(this.dicePicList[b - 1], (error, img) => {
            let myIcon = new cc.SpriteFrame(img);
            this.diceTwo.spriteFrame = myIcon
        })
        setTimeout(() => {
            cc.log('发出摇色子动画结束通知')
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
               type: LocalNoticeEventType.ROLL_DICE_FINISHED_NOTICE
            } as LocalNoticeEventPara)
        }, 1000)
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
