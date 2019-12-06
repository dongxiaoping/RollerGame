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

    @property(cc.AudioSource)
    tongsha: cc.AudioSource = null //通杀语音

    @property(cc.AudioSource)
    tongpei: cc.AudioSource = null //通赔语音

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        let that = this
        let oningNum = RoomManage.roomItem.oningRaceNum
        let race = RaceManage.raceList[oningNum]
        let landLordId = RaceManage.raceList[0].landlordId
        let userId = UserManage.userInfo.id
        let bgPicUrl: string = ''
        let wenziUrl: string = ''
        if (race.skyResult === CompareDxRe.BIG && race.middleResult === CompareDxRe.BIG &&
            race.landResult === CompareDxRe.BIG) {
            this.tongpei.play()
            if (landLordId === userId) {
                bgPicUrl = 'resultBg/result-bg_2cc9d222_01'
                wenziUrl = 'resultWenzi/result_47f49bf6_01'
            } else {
                bgPicUrl = 'resultBg/result-bg_2cc9d222_02'
                wenziUrl = 'resultWenzi/result_47f49bf6_04'
            }
        } else if (race.skyResult === CompareDxRe.SMALL &&
            race.middleResult === CompareDxRe.SMALL && race.landResult === CompareDxRe.SMALL) {
            this.tongsha.play()
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
            that.bg.spriteFrame = myIcon;
        })
        cc.loader.loadRes(wenziUrl, (error, img) => {
            let myIcon = new cc.SpriteFrame(img);
            that.wenZi.spriteFrame = myIcon;
        })
    }
    onEnable() {

    }

    // update (dt) {}
}
