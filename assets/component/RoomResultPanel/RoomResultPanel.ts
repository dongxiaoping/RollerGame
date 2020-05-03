
const { ccclass, property } = cc._decorator
import RaceManage from '../../store/Races/RaceManage';
import RoomManage from '../../store/Room/RoomManage';
import { raceResultData, LocalNoticeEventType, LocalNoticeEventPara, EventType } from '../../common/Const';
import { eventBus } from '../../common/EventBus';
import ConfigManage from '../../store/Config/ConfigManage';
import { webCookie } from '../../common/Util';

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.WebView)
    webViewPart: cc.WebView = null;

    @property(cc.Node)
    leftList: cc.Node = null;
    @property(cc.Node)
    rightList: cc.Node = null;
    @property(cc.Prefab)
    userItem: cc.Prefab = null;

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

    showZhanjiShare(resultList) {
        let contentInfo = this.getShareZhanjiMessage(resultList);
        webCookie.setItem("zhanji", contentInfo, 0.01)
        this.webViewPart.url = ConfigManage.getZhanjiPageAddr()
    }
    //获取战绩分享信息
    getShareZhanjiMessage(resultList) {
        let resultString = RoomManage.roomItem.id+'号房间比赛结果->'
        resultList.forEach(element => {
            let name = element.nick
            let score = element.score
            resultString = resultString + name +"："+score+"，"
        });
        resultString = resultString+"详细战绩请查看:" +window.location.href
        return resultString
    }

    updateShow() {
        try {
            let roomInfo = RoomManage.roomItem
            this.roomNum.string = '房间号：' + roomInfo.id
            this.raceCount.string = '总局数：' + roomInfo.playCount + '局'
    
            let resultList = RaceManage.gameOverResultList
            this.showZhanjiShare(resultList)
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
        } catch (error) {

        }
    }

    // update (dt) {}
}
