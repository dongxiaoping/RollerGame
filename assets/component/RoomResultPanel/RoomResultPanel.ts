
const { ccclass, property } = cc._decorator
import GameMemberManage from '../../store/GameMember/GameMemberManage'
import GameMemberItem from '../../store/GameMember/GameMemberItem'
import RaceManage from '../../store/Races/RaceManage';
import RoomManage from '../../store/Room/RoomManage';
import { raceResultData, LocalNoticeEventType, LocalNoticeEventPara, EventType } from '../../common/Const';
import { eventBus } from '../../common/EventBus';

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    leftList: cc.Node = null;
    @property(cc.Node)
    rightList: cc.Node = null;
    @property(cc.Prefab)
    userItem: cc.Prefab = null;

    @property(cc.Label)
    roomModel: cc.Label = null;
    @property(cc.Label)
    roomNum: cc.Label = null;
    @property(cc.Label)
    raceCount: cc.Label = null;

    @property(cc.Sprite)
    backButton: cc.Sprite = null;

    leftUserList: any[] = []
    rightUserList: any[] = []

    start() {
        this.updateShow()
        this.backButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                type: LocalNoticeEventType.TO_LOBBY_EVENT,
                info: null
            } as LocalNoticeEventPara)
        })
    }

    updateShow() {
        let roomInfo = RoomManage.roomItem
        this.roomNum.string = '房间号：' + roomInfo.id
        this.raceCount.string = '总局数：' + roomInfo.playCount + '局'
        
        let resultList = RaceManage.gameOverResultList
        let i = 1
        resultList.forEach((item: raceResultData) => {
            if (i <= 5) {
                this.leftUserList.push(item)
            } else {
                this.rightUserList.push(item)
            }
            i++
        })

        this.leftUserList.forEach((item: raceResultData) => {
            let b = cc.instantiate(this.userItem)
            let jsOb = b.getComponent('RoomResultUserItem')
            jsOb.initData(item.userId, item.icon, item.nick, item.score)
            this.leftList.addChild(b)
        })

        this.rightUserList.forEach((item: raceResultData) => {
            let b = cc.instantiate(this.userItem)
            let jsOb = b.getComponent('RoomResultUserItem')
            jsOb.initData(item.userId, item.icon, item.nick, item.score)
            this.rightList.addChild(b)
        })
    }

    // update (dt) {}
}
