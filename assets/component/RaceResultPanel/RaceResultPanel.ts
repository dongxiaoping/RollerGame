const { ccclass, property } = cc._decorator;
import RaceManage from '../../store/Races/RaceManage'
import GameMemberManage from '../../store/GameMember/GameMemberManage'
import RoomManage from '../../store/Room/RoomManage'
import UserManage from '../../store/User/UserManage'
import { IconValueList, CompareDxRe, raceResultData } from '../../common/Const'
import RaceItem from '../../store/Races/RaceItem';
import BetManage from '../../store/Bets/BetManage';
import Betitem from '../../store/Bets/BetItem';
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
    start() {
        this.show()
    }

    drawResult(ob: cc.Sprite, val: number) {
        let list = IconValueList[val]
        for (let i = 0; i < list.length; i++) {
            ob.node.getChildByName(list[i]).active = true
        }

    }

    show() {
        cc.log('开始显示结果面板信息')
        let raceNum = RoomManage.roomItem.oningRaceNum
        let raceInfo = RaceManage.raceList[raceNum]
        let landloardId = raceInfo.landlordId
        cc.log(raceInfo)
        this.drawResult(this.sky_dian_1, raceInfo.skyScore.one)
        this.drawResult(this.sky_dian_2, raceInfo.skyScore.two)
        this.drawResult(this.middle_dian_1, raceInfo.middleScore.one)
        this.drawResult(this.middle_dian_2, raceInfo.middleScore.two)
        this.drawResult(this.land_dian_1, raceInfo.landScore.one)
        this.drawResult(this.land_dian_2, raceInfo.landScore.two)
        this.drawResult(this.landlord_dian_1, raceInfo.landlordScore.one)
        this.drawResult(this.landlord_dian_2, raceInfo.landlordScore.two)
        this.showWinOrFailIcon(raceInfo)
        let raceResultList = RaceManage.raceList[raceNum].raceResultList
        let i = 0
        let landlordScore: number = 0
        raceResultList.forEach((item: raceResultData) => {
            i++
            let node = cc.instantiate(this.memberScoreItem)
            let nameLabel = node.getChildByName('name').getComponents(cc.Label)
            let scoreLabel = node.getChildByName('score').getComponents(cc.Label)
            nameLabel[0].string = i + '. ' + item.nick
            scoreLabel[0].string = item.score + ''
            node.parent = this.node.getChildByName('MemberList')
            landlordScore -= item.score
            if (landloardId === item.userId) {
                this.landlordName.string = item.nick
            }
            if (UserManage.userInfo.id === item.userId) {
                this.myScore.string = item.score + ''
            }
        })
        this.landlordScore.string = landlordScore + ''
    }

    showWinOrFailIcon(raceInfo: RaceItem): void {
        if (raceInfo.skyResult === CompareDxRe.BIG) {
            cc.loader.loadRes('winFail/result-icon_7fe1ca6c_02', (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                this.skyWinOrFail.spriteFrame = myIcon;
            })
        } else {
            cc.loader.loadRes('winFail/result-icon_7fe1ca6c_01', (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                this.skyWinOrFail.spriteFrame = myIcon;
            })
        }
        if (raceInfo.middleResult === CompareDxRe.BIG) {
            cc.loader.loadRes('winFail/result-icon_7fe1ca6c_02', (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                this.middleWinOrFail.spriteFrame = myIcon;
            })
        } else {
            cc.loader.loadRes('winFail/result-icon_7fe1ca6c_01', (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                this.middleWinOrFail.spriteFrame = myIcon;
            })
        }
        if (raceInfo.landResult === CompareDxRe.BIG) {
            cc.loader.loadRes('winFail/result-icon_7fe1ca6c_02', (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                this.landWinOrFail.spriteFrame = myIcon;
            })
        } else {
            cc.loader.loadRes('winFail/result-icon_7fe1ca6c_01', (error, img) => {
                let myIcon = new cc.SpriteFrame(img);
                this.landWinOrFail.spriteFrame = myIcon;
            })
        }
    }

}
