import { config } from '../../common/Config'
import { PromiseParam, PromiseResult, ResponseStatus, InterfaceUrl, ResponseData } from '../../common/Const'
import UserItem from './UserItem'
import http from '../../common/Http'
import { UserInfo } from './UserBase';
import { RoomGameConfig } from '../../common/RoomGameConfig'
import ConfigManage from '../Config/ConfigManage';

class UserManage {
    public userInfo: UserItem = null
    selectChipValue: number = 0 //当前用户选中的下注值，默认10
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
            let httpUrl = config.serverAddress + InterfaceUrl.CREATE_VISIT
            http.getWithUrl(httpUrl, (status: boolean, info: any) => {
                let userInfo = info.data as UserInfo
                let gameConfig = info.config as RoomGameConfig
                this.userInfo = new UserItem(userInfo)
                resolve({ result: ResponseStatus.SUCCESS, extObject: this.userInfo })
            })
        })
    }

    public updateUserDiamond(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            let httpUrl = config.serverAddress + InterfaceUrl.GET_USER_DIAMOND + '?userId=' + this.userInfo.id
            http.getWithUrl(httpUrl, (error: boolean, info: ResponseData) => {
                if (!error && info.status != ResponseStatus.FAIL) {
                    this.userInfo.diamond = info.data
                }
            })
        })
    }

    //游戏开始，扣钻流程
    public costDiamondInRoom(roomId: number, userId: string): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            let httpUrl = config.serverAddress + InterfaceUrl.COST_DIAMOND + '?userId=' + userId + '&roomId=' + roomId
            http.getWithUrl(httpUrl, (error: boolean, info: ResponseData) => {
                if (error) {
                    resolve({ result: ResponseStatus.FAIL, extObject: { message: 'interface_fail' } })
                    return
                }
                if (info.status === ResponseStatus.FAIL) {
                    resolve({ result: ResponseStatus.FAIL, extObject: info })
                    return
                }
                resolve({ result: ResponseStatus.SUCCESS, extObject: info.data })
            })
        })
    }

    //购买钻
    public rechargeDiamond(userId: string, diamondCount: number): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            let httpUrl = config.serverAddress + InterfaceUrl.RECHARGE_DIAMOND + '?userId=' + userId + '&diamondCount=' + diamondCount
            http.getWithUrl(httpUrl, (error: boolean, info: ResponseData) => {
                if (error) {
                    resolve({ result: ResponseStatus.FAIL, extObject: { message: 'interface_fail' } })
                    return
                }
                if (info.status === ResponseStatus.FAIL) {
                    resolve({ result: ResponseStatus.FAIL, extObject: info })
                    return
                }
                resolve({ result: ResponseStatus.SUCCESS, extObject: info.data })
            })
        })
    }

    async costDiamond(roomId: number, userId: string) {
        let result = await this.costDiamondInRoom(roomId, userId)
        if (result.result === ResponseStatus.FAIL) {
            return
        }
        this.userInfo.diamond = result.extObject
    }
}

export default new UserManage()
