import RoomManage from "../../store/Room/RoomManage";
import RaceManage from "../../store/Races/RaceManage";
import { CompareDxRe } from "../../common/Const";
import UserManage from "../../store/User/UserManage";
import ConfigManage from "../../store/Config/ConfigManage";

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

    @property(cc.SpriteFrame)
    goldWinWenZi: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    grayWinWenZi: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    goldFailWenZi: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    grayFailWenZi: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    goldBg: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    grayBg: cc.SpriteFrame = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        let oningNum = RoomManage.roomItem.oningRaceNum
        let race = RaceManage.raceList[oningNum]
        let landLordId = RaceManage.raceList[0].landlordId
        let userId = UserManage.userInfo.id
        let bgPicUrl: cc.SpriteFrame = null
        let wenziUrl: cc.SpriteFrame = null
        if (race.skyResult === CompareDxRe.BIG && race.middleResult === CompareDxRe.BIG &&
            race.landResult === CompareDxRe.BIG) {
            if (ConfigManage.isTxMusicOpen()) {
                this.tongpei.play()
            }

            if (landLordId === userId) {
                bgPicUrl = this.grayBg
                wenziUrl = this.grayFailWenZi
            } else {
                bgPicUrl = this.goldBg
                wenziUrl = this.goldFailWenZi
            }
        } else if (race.skyResult === CompareDxRe.SMALL &&
            race.middleResult === CompareDxRe.SMALL && race.landResult === CompareDxRe.SMALL) {
            if (ConfigManage.isTxMusicOpen()) {
                this.tongsha.play()
            }

            if (landLordId === userId) {
                bgPicUrl = this.goldBg
                wenziUrl = this.goldWinWenZi
            } else {
                bgPicUrl = this.grayBg
                wenziUrl = this.grayWinWenZi
            }
        }
        this.bg.spriteFrame = bgPicUrl;
        this.wenZi.spriteFrame = wenziUrl;
    }
    onEnable() {

    }

    // update (dt) {}
}
