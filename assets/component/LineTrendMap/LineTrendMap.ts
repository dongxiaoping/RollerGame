import { betLocaion, CompareDxRe } from "../../common/Const";
import RaceManage from "../../store/Races/RaceManage";
import RoomManage from "../../store/Room/RoomManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Node)
    drawPanel: cc.Node = null //画板
    drawPanelWidth: number = 0//画板宽 
    drawPanelHeight: number = 0//画板高 
    @property
    text: string = 'hello';
    skyResult: boolean[] = []
    middleResult: boolean[] = []
    landResult: boolean[] = []
    start() {
        this.drawBase()
        this.initResult()
        this.drawByResult(this.skyResult, betLocaion.SKY)
        this.drawByResult(this.middleResult, betLocaion.MIDDLE)
        this.drawByResult(this.landResult, betLocaion.LAND)
    }

    getRaceResult(raceNum: number) {
        let race = RaceManage.raceList[raceNum]
        let skyWin = race.getLocationResult(betLocaion.SKY) === CompareDxRe.BIG ? true : false
        let middleWin = race.getLocationResult(betLocaion.MIDDLE) === CompareDxRe.BIG ? true : false
        let landWin = race.getLocationResult(betLocaion.LAND) === CompareDxRe.BIG ? true : false
        return [skyWin, middleWin, landWin]
    }

    initResult() {
        let onRaceNum = -1
        try {
            onRaceNum = RoomManage.roomItem.oningRaceNum === null ? 0 : RoomManage.roomItem.oningRaceNum
        } catch (e) { }
        let i = 0
        for (; i < onRaceNum; i++) {
            let result = this.getRaceResult(i)
            this.skyResult.push(result[0])
            this.middleResult.push(result[1])
            this.landResult.push(result[2])
        }
    }

    drawBase() {
        let ctx = this.drawPanel.getComponent(cc.Graphics)
        ctx.lineWidth = 4
        ctx.moveTo(0, 0)
        ctx.lineTo(0, this.drawPanelHeight)
        ctx.strokeColor = cc.Color.GRAY
        ctx.stroke()
        ctx.moveTo(0, 0)
        ctx.lineTo(this.drawPanelWidth, 0)
        ctx.strokeColor = cc.Color.GRAY
        ctx.stroke()


        ctx.moveTo(30, this.drawPanelHeight - 30)
        ctx.lineTo(50, this.drawPanelHeight - 30)
        ctx.strokeColor = cc.Color.RED
        ctx.lineWidth = 3
        ctx.stroke()

        ctx.moveTo(30, this.drawPanelHeight - 60)
        ctx.lineTo(50, this.drawPanelHeight - 60)
        ctx.strokeColor = cc.Color.YELLOW
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.moveTo(30, this.drawPanelHeight - 90)
        ctx.lineTo(50, this.drawPanelHeight - 90)
        ctx.strokeColor = cc.Color.BLUE
        ctx.lineWidth = 1
        ctx.stroke()
    }
    drawByResult(winResult: boolean[], deskLocation: betLocaion) {
        let count = winResult.length
        let xItemLen = this.drawPanelWidth / count
        let yItemLen = this.drawPanelHeight / count
        let ctx = this.drawPanel.getComponent(cc.Graphics)
        if (deskLocation == betLocaion.SKY) {
            ctx.strokeColor = cc.Color.RED
            ctx.lineWidth = 3
        } else if (deskLocation == betLocaion.MIDDLE) {
            ctx.strokeColor = cc.Color.YELLOW
            ctx.lineWidth = 2
        } else {
            ctx.strokeColor = cc.Color.BLUE
            ctx.lineWidth = 1
        }
        ctx.moveTo(0, 0)
        let x = 0
        let y = 0
        for (let i = 0; i < count; i++) {
            x += xItemLen
            if (winResult[i]) {
                y += yItemLen
            }
            ctx.lineTo(x, y)
        }
        ctx.stroke()
    }

    onEnable() {
        this.drawPanelWidth = this.drawPanel.width
        this.drawPanelHeight = this.drawPanel.height
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy()
        })
    }
}
