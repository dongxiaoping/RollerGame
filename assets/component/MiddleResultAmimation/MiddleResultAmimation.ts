import RoomManage from "../../store/Room/RoomManage";
import RaceManage from "../../store/Races/RaceManage";
import { CompareDxRe } from "../../common/Const";
import UserManage from "../../store/User/UserManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    bg: cc.Sprite = null;

    @property(cc.Sprite)
    wenZi: cc.Sprite = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        let oningNum = RoomManage.roomItem.oningRaceNum
        let result = RaceManage.raceList[oningNum].locationResultDetail
        let landLordId = RaceManage.raceList[0].landlordId
        let userId = UserManage.userInfo.id
        let bgPicUrl: string = ''
        let wenziUrl: string = ''
        if (result.sky === CompareDxRe.BIG && result.middle === CompareDxRe.BIG &&
            result.land === CompareDxRe.BIG) {
            if (landLordId === userId) {
                bgPicUrl = 'resultBg/result-bg_2cc9d222_01'
                wenziUrl = 'resultWenzi/result_47f49bf6_01'
            } else {
                bgPicUrl = 'resultBg/result-bg_2cc9d222_02'
                wenziUrl = 'resultWenzi/result_47f49bf6_04'
            }
        } else if (result.sky === CompareDxRe.SMALL &&
            result.middle === CompareDxRe.SMALL && result.land === CompareDxRe.SMALL) {
            if (landLordId === userId) {
                bgPicUrl = 'resultBg/result-bg_2cc9d222_02'
                wenziUrl = 'resultWenzi/result_47f49bf6_02'
            } else {
                bgPicUrl = 'resultBg/result-bg_2cc9d222_01'
                wenziUrl = 'resultWenzi/result_47f49bf6_03'
            }
        }
        cc.loader.loadRes(bgPicUrl, (error, img) => {
            let myIcon = new cc.SpriteFrame(img);
            this.bg.spriteFrame = myIcon;
        })
        cc.loader.loadRes(wenziUrl, (error, img) => {
            let myIcon = new cc.SpriteFrame(img);
            this.wenZi.spriteFrame = myIcon;
        })
    }

    // update (dt) {}
}
