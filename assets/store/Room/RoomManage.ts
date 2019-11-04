const { ccclass } = cc._decorator;
import { config } from '../../common/Config'
import RoomItem from './RoomItem'
import { appMode, PromiseParam, PromiseResult, RoomInfo } from '../../common/Const'
import { roomInfo } from '../../mock/RoomInfo'

@ccclass
class RoomManage {
    public roomItem: RoomItem = null

    public requestRoomInfo(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (this.roomItem !== null) {
                resolve({ result: PromiseResult.SUCCESS, extObject: this.roomItem })
                return
            }
            if (config.appMode === appMode.DEV) {
                this.roomItem = new RoomItem(roomInfo as RoomInfo)
            } else {

            }
            resolve({ result: PromiseResult.SUCCESS, extObject: this.roomItem })
        })
    }
}

export default new RoomManage()