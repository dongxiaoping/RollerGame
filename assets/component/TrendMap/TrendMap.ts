import RoomManage from "../../store/Room/RoomManage";
import RaceManage from "../../store/Races/RaceManage";
import { betLocaion, CompareDxRe, EventType, LocalNoticeEventPara, LocalNoticeEventType } from "../../common/Const";
import { eventBus } from "../../common/EventBus";
import { randEventId } from "../../common/Util";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    raceItemPrefab: cc.Prefab = null

    @property(cc.Node)
    listNodeOb: cc.Node = null
    eventId: any = null

    @property(cc.Node)
    switchButton: cc.Node = null

    @property(cc.Node)
    content: cc.Node = null

    start() {
        this.eventId = randEventId()
        // eventBus.on(EventType.LOCAL_NOTICE_EVENT, this.eventId, (info: LocalNoticeEventPara): void => {
        //     let localNoticeEventType = info.type
        //     switch (localNoticeEventType) {
        //         case LocalNoticeEventType.OPEN_CARD_FINISHED_NOTICE:
        //             let onRaceNum = RoomManage.roomItem.oningRaceNum
        //             let result = this.getRaceResult(onRaceNum)
        //             this.addItem(result[0], result[1], result[2])
        //             break
        //     }
        // })

        this.switchButton.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.active = false
            this.node.parent.getChildByName('ShowTrendButton').active = true
        })
    }

    getRaceResult(raceNum: number) {
        let race = RaceManage.raceList[raceNum]
        let skyWin = race.getLocationResult(betLocaion.SKY) === CompareDxRe.BIG ? true : false
        let middleWin = race.getLocationResult(betLocaion.MIDDLE) === CompareDxRe.BIG ? true : false
        let landWin = race.getLocationResult(betLocaion.LAND) === CompareDxRe.BIG ? true : false
        return [skyWin, middleWin, landWin]
    }

    show() {
        this.content.removeAllChildren()
        let onRaceNum = -1
        try {
            onRaceNum = RoomManage.roomItem.oningRaceNum === null ? 0 : RoomManage.roomItem.oningRaceNum
        } catch (e) { }
        let i = 0
        for (; i < onRaceNum; i++) {
            let result = this.getRaceResult(i)
            this.addItem(result[0], result[1], result[2])
        }
    }

    test() {
        this.addItem(true, false, false)
        this.addItem(true, false, false)
        this.addItem(true, false, false)
        this.addItem(true, false, false)
        this.addItem(true, false, false)
        this.addItem(true, false, false)
        this.addItem(true, false, false)
    }

    addItem(skyWin: boolean, middleWin: boolean, landWin: boolean) {
        let itemNode = cc.instantiate(this.raceItemPrefab)
        itemNode.name = 'trendItem'
        let jsOb = itemNode.getComponent('TrendItem')
        jsOb.setShow(skyWin, middleWin, landWin)
        this.listNodeOb.addChild(itemNode)
    }

    onDisable() {
       // eventBus.off(EventType.LOCAL_NOTICE_EVENT, this.eventId)
    }
}
