import { betLocaion, CompareDxRe, EventType, LocalNoticeEventType, LocalNoticeEventPara, RaceState } from "../../common/Const";
import RaceManage from "../../store/Races/RaceManage";
import RoomManage from "../../store/Room/RoomManage";
import { randEventId } from "../../common/Util";
import { eventBus } from "../../common/EventBus";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    drawPanel: cc.Node = null //画板
    drawPanelWidth: number = 0//画板宽 
    drawPanelHeight: number = 0//画板高 
    skyResult: boolean[] = []
    middleResult: boolean[] = []
    landResult: boolean[] = []
    colorSet: any[] = [cc.Color.YELLOW, cc.Color.RED, cc.Color.GREEN]
    lineWith: number = 2
    eventIdOne: any = null

    @property(cc.Label)
    xMiddlelabel: cc.Label = null;
    @property(cc.Label)
    yMiddlelabel: cc.Label = null;
    @property(cc.Label)
    xEndlabel: cc.Label = null;
    @property(cc.Label)
    yEndlabel: cc.Label = null;
    start() {
        this.reDraw()
    }

    reDraw() {
        let ctx = this.drawPanel.getComponent(cc.Graphics)
        ctx.clear()
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
        this.skyResult = []
        this.middleResult = []
        this.landResult = []
        let onRaceNum = 0
        let showRaceNum = 0
        try {
            onRaceNum = RoomManage.roomItem.oningRaceNum === null ? 0 : RoomManage.roomItem.oningRaceNum
            if (RaceManage.raceList[onRaceNum].state == RaceState.FINISHED || RaceManage.raceList[onRaceNum].state == RaceState.SHOW_DOWN) {
                showRaceNum = onRaceNum
            } else {
                showRaceNum = onRaceNum - 1
            }
        } catch (e) { }
        for (let i = 0; i <= showRaceNum; i++) {
            let result = this.getRaceResult(i)
            this.skyResult.push(result[0])
            this.middleResult.push(result[1])
            this.landResult.push(result[2])
        }
    }

    drawBase() {
        let ctx = this.drawPanel.getComponent(cc.Graphics)
        ctx.lineWidth = this.lineWith
        ctx.moveTo(0, 0)
        ctx.lineTo(0, this.drawPanelHeight)
        ctx.lineTo(4, this.drawPanelHeight - 8)
        ctx.moveTo(0, this.drawPanelHeight)
        ctx.lineTo(-4, this.drawPanelHeight - 8)
        ctx.strokeColor = cc.Color.WHITE
        ctx.stroke()

        ctx.moveTo(0, 0)
        ctx.lineTo(this.drawPanelWidth, 0)
        ctx.lineTo(this.drawPanelWidth - 8, 4)
        ctx.moveTo(this.drawPanelWidth, 0)
        ctx.lineTo(this.drawPanelWidth - 8, -4)
        ctx.strokeColor = cc.Color.WHITE
        ctx.stroke()

        ctx.moveTo(this.drawPanelWidth / 2, 0)
        ctx.lineTo(this.drawPanelWidth / 2, 6)
        ctx.strokeColor = cc.Color.WHITE
        ctx.stroke()


        ctx.moveTo(this.drawPanelWidth - 12, 0)
        ctx.lineTo(this.drawPanelWidth - 12, 6)
        ctx.strokeColor = cc.Color.WHITE
        ctx.stroke()

        ctx.moveTo(0, this.drawPanelHeight / 2)
        ctx.lineTo(6, this.drawPanelHeight / 2)
        ctx.strokeColor = cc.Color.WHITE
        ctx.stroke()
        ctx.moveTo(0, this.drawPanelHeight - 12)
        ctx.lineTo(6, this.drawPanelHeight - 12)
        ctx.strokeColor = cc.Color.WHITE
        ctx.stroke()

        ctx.moveTo(30, this.drawPanelHeight - 30)
        ctx.lineTo(50, this.drawPanelHeight - 30)
        ctx.strokeColor = this.colorSet[0]
        ctx.lineWidth = this.lineWith
        ctx.stroke()

        ctx.moveTo(30, this.drawPanelHeight - 60)
        ctx.lineTo(50, this.drawPanelHeight - 60)
        ctx.strokeColor = this.colorSet[1]
        ctx.lineWidth = this.lineWith
        ctx.stroke()

        ctx.moveTo(30, this.drawPanelHeight - 90)
        ctx.lineTo(50, this.drawPanelHeight - 90)
        ctx.strokeColor = this.colorSet[2]
        ctx.lineWidth = this.lineWith
        ctx.stroke()
        let RaceCount = RoomManage.roomItem.playCount
        this.yEndlabel.string = RaceCount + ''
        this.xEndlabel.string = RaceCount + ''
        this.xMiddlelabel.string = Math.floor(RaceCount / 2) + ''
        this.yMiddlelabel.string = Math.floor(RaceCount / 2) + ''
    }
    drawByResult(winResult: boolean[], deskLocation: betLocaion) {
        let RaceCount = RoomManage.roomItem.playCount
        let xItemLen = this.drawPanelWidth / RaceCount
        let yItemLen = this.drawPanelHeight / RaceCount
        let ctx = this.drawPanel.getComponent(cc.Graphics)
        let x = 0
        let y = 0
        if (deskLocation == betLocaion.SKY) {
            ctx.strokeColor = this.colorSet[0]
            ctx.lineWidth = this.lineWith
            y = 4
        } else if (deskLocation == betLocaion.MIDDLE) {
            ctx.strokeColor = this.colorSet[1]
            ctx.lineWidth = this.lineWith
            y = 2
        } else {
            ctx.strokeColor = this.colorSet[2]
            ctx.lineWidth = this.lineWith
        }
        ctx.moveTo(0, 0)
        for (let i = 0; i < winResult.length; i++) {
            x += xItemLen
            if (winResult[i]) {
                y += yItemLen
            }
            ctx.lineTo(x, y)
        }
        ctx.stroke()
    }

    onDisable() {
        eventBus.off(EventType.LOCAL_NOTICE_EVENT, this.eventIdOne)
    }

    onEnable() {
        this.drawPanelWidth = this.drawPanel.width
        this.drawPanelHeight = this.drawPanel.height
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.node.destroy()
        })

        this.eventIdOne = randEventId()
        eventBus.on(EventType.LOCAL_NOTICE_EVENT, randEventId(), (info: LocalNoticeEventPara): void => {
            let localNoticeEventType = info.type
            switch (localNoticeEventType) {
                case LocalNoticeEventType.OPEN_CARD_FINISHED_NOTICE:
                    this.reDraw()
            }
        })
    }
}
