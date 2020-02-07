const { ccclass, property } = cc._decorator;
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage'
import UserManage from '../../store/User/UserManage'
import { IconValueList, CompareDxRe, raceResultData } from '../../common/Const'
import RaceItem from '../../store/Races/RaceItem';
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    myScore: cc.Label = null;
    @property(cc.Prefab)
    memberScoreItem: cc.Prefab = null;
    @property(cc.Label)
    landlordName: cc.Label = null;
    @property(cc.Label)
    landlordScore: cc.Label = null;

    @property(cc.Sprite)
    sky_dian_1: cc.Sprite = null;
    @property(cc.Sprite)
    sky_dian_2: cc.Sprite = null;
    @property(cc.Sprite)
    middle_dian_1: cc.Sprite = null;
    @property(cc.Sprite)
    middle_dian_2: cc.Sprite = null;
    @property(cc.Sprite)
    land_dian_1: cc.Sprite = null;
    @property(cc.Sprite)
    land_dian_2: cc.Sprite = null;
    @property(cc.Sprite)
    landlord_dian_1: cc.Sprite = null;
    @property(cc.Sprite)
    landlord_dian_2: cc.Sprite = null;

    @property(cc.Sprite)
    skyWinOrFail: cc.Sprite = null;
    @property(cc.Sprite)
    middleWinOrFail: cc.Sprite = null;
    @property(cc.Sprite)
    landWinOrFail: cc.Sprite = null;
    @property(cc.Sprite)
    userWinOrFail: cc.Sprite = null;

    @property(cc.SpriteFrame)
    majongWinIcon: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    majongFailIcon: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    userWinIcon: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    userFailIcon: cc.SpriteFrame = null;

    @property([cc.SpriteFrame])
    majongIcons: cc.SpriteFrame[] = [] //结果图
    start() {
        this.show()
        this.node.on(cc.Node.EventType.TOUCH_END, (event: any) => {
            this.node.destroy()
        })
    }

    drawResult(ob: cc.Sprite, val: number) {
        val = val === 0.5 ? 0 : val
        ob.node.getChildByName('MajongSprite').getComponent(cc.Sprite).spriteFrame = this.majongIcons[val]
    }

    show() {
        //cc.log('开始显示结果面板信息')
        let raceNum = RoomManage.roomItem.oningRaceNum
        let raceInfo = RaceManage.raceList[raceNum]
        let landloardId = raceInfo.landlordId
        //cc.log(raceInfo)
        this.drawResult(this.sky_dian_1, raceInfo.skyScore.one)
        this.drawResult(this.sky_dian_2, raceInfo.skyScore.two)
        this.drawResult(this.middle_dian_1, raceInfo.middleScore.one)
        this.drawResult(this.middle_dian_2, raceInfo.middleScore.two)
        this.drawResult(this.land_dian_1, raceInfo.landScore.one)
        this.drawResult(this.land_dian_2, raceInfo.landScore.two)
        this.drawResult(this.landlord_dian_1, raceInfo.landlordScore.one)
        this.drawResult(this.landlord_dian_2, raceInfo.landlordScore.two)
        this.showWinOrFailIcon(raceInfo)
        let raceResultList = RaceManage.raceList[raceNum].raceResultList == null
            ? [] : RaceManage.raceList[raceNum].raceResultList
        let i = 0
        raceResultList.forEach((item: raceResultData) => {
            i++
            let node = cc.instantiate(this.memberScoreItem)
            let nameLabel = node.getChildByName('name').getComponents(cc.Label)
            let scoreLabel = node.getChildByName('score').getComponents(cc.Label)
            nameLabel[0].string = i + '. ' + item.nick
            if (item.userId === landloardId) {
                this.landlordName.string = item.nick
                this.landlordScore.string = item.score + ''
            }
            if (item.score > 0) {
                scoreLabel[0].node.color = cc.Color.YELLOW
            }
            scoreLabel[0].string = item.score + ''
            node.parent = this.node.getChildByName('MemberList')
            if (UserManage.userInfo.id === item.userId) {
                this.myScore.string = item.score + ''
                this.userWinOrFail.spriteFrame = item.score >= 0 ? this.userWinIcon : this.userFailIcon
                if (item.score === 0) {
                    this.userWinOrFail.node.active = false
                } else {
                    this.userWinOrFail.node.active = true
                }
            }
        })
    }

    showWinOrFailIcon(raceInfo: RaceItem): void {
        try {
            this.skyWinOrFail.spriteFrame = raceInfo.skyResult === CompareDxRe.BIG ? this.majongWinIcon : this.majongFailIcon
            this.middleWinOrFail.spriteFrame = raceInfo.middleResult === CompareDxRe.BIG ? this.majongWinIcon : this.majongFailIcon
            this.landWinOrFail.spriteFrame = raceInfo.landResult === CompareDxRe.BIG ? this.majongWinIcon : this.majongFailIcon
        } catch (e) { }
    }

}
