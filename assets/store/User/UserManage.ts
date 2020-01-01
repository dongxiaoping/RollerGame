import { config } from '../../common/Config'
import { appMode, PromiseParam, PromiseResult, ResponseStatus } from '../../common/Const'
import UserItem from './UserItem'
import http from '../../common/Http'
import { UserInfo } from './UserBase';
import { RoomGameConfig } from '../../common/RoomGameConfig'
import RoomManage from '../Room/RoomManage'

class UserManage {
    public userInfo: UserItem = null
    selectChipValue: number = 10 //当前用户选中的下注值，默认10
    constructor() {
    }

    getSelectChipValue(): number {
        return this.selectChipValue
    }

    setSelectChipValue(val: number) {
        this.selectChipValue = val
    }

    setUserInfo(info: UserInfo) {
        this.userInfo = new UserItem(info)
    }

    public requestUserInfo(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (this.userInfo !== null) {
                resolve({ result: ResponseStatus.SUCCESS, extObject: this.userInfo })
                return
            }
            let httpUrl = config.serverAddress + '/race/user/create_visit_account'
            http.getWithUrl(httpUrl, (status: boolean, info: any) => {
                let userInfo = info.data as UserInfo
                let gameConfig = info.config as RoomGameConfig
                RoomManage.setNetRoomGameConfig(gameConfig)
                this.userInfo = new UserItem(userInfo)
                resolve({ result: ResponseStatus.SUCCESS, extObject: this.userInfo })
            })
        })
    }

    //游戏开始，扣钻流程
    public costDiamondInRoom(roomId: number, userId: string): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            let httpUrl = config.serverAddress + '/race/user/cost_diamond_in_room?userId=' + userId + '&roomId=' + roomId
            http.getWithUrl(httpUrl, (status: boolean, info: any) => {

            })
        })
    }
}

export default new UserManage()
