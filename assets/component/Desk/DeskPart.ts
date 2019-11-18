const { ccclass, property } = cc._decorator;
import { RaceState } from '../../common/Const'
import RaceManage from '../../store/Races/RaceManage'
import RoomManage from '../../store/Room/RoomManage'
import UserManage from '../../store/User/UserManage'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    focus: cc.Sprite = null;

    @property
    typeValue: string = ''; //按钮类型

    start() {
        cc.log('按钮类型：' + this.typeValue)
    }

    onEnable() {
        this.focus.node.active = false
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            let oningRaceNum = RoomManage.roomItem.oningRaceNum
            if(RaceManage.raceList[oningRaceNum].state !== RaceState.BET ){
                return
            }
            if(RaceManage.raceList[oningRaceNum].landlordId === UserManage.userInfo.id){
                return
            }
            this.focus.node.active = true
        })
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            let oningRaceNum = RoomManage.roomItem.oningRaceNum
            if(RaceManage.raceList[oningRaceNum].state !== RaceState.BET ){
                cc.log('当前不是下注环节，不能下注')
                return
            }
            if(RaceManage.raceList[oningRaceNum].landlordId === UserManage.userInfo.id){
                cc.log('地主不能下注')
                return
            }
            this.focus.node.active = false
            RaceManage.raceList[oningRaceNum].betInfo[UserManage.userInfo.id][this.typeValue] += UserManage.selectChipValue
        })
    }

    // update (dt) {}
}
