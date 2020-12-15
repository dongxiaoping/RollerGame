import { config } from '../../common/Config'
import {PromiseParam, PromiseResult, ResponseStatus, InterfaceUrl, ResponseData, GameMember} from '../../common/Const'
import UserItem from './UserItem'
import http from '../../common/Http'
import { UserInfo } from './UserBase';
import { RoomGameConfig } from '../../common/RoomGameConfig'
import ConfigManage from '../Config/ConfigManage';
import {getUrlParam, webCookie} from '../../common/Util';
import axios from 'axios'
import log from 'loglevel'
class UserManage {
    public userInfo: UserItem = null
    selectChipValue: number = 0 //当前用户选中的下注值，默认10
    public userInfoInRoom: GameMember = null//当前用户在玩家列表中显示的一些基本数据
    constructor() {
    }

    getSelectChipValue(): number {
        return this.selectChipValue
    }

    getLoginUserId() {
        try{
            let id = getUrlParam('userId')
            if(id != null){
                log.info("从url中取到了用户ID，主要用于快速测试使用，用户ID:", id)
                return id
            }
            id = webCookie.getItem('userId')
            log.info("cookie获取用户id", id)
            if(id == null){
                id = localStorage.getItem('userId')
                log.info("localStorage获取用户id", id)
            }
            return id
        }catch (e) {
            log.error("本地查找用户id异常",e)
            return null
        }
    }

    setUserInfoInRoom(item: GameMember){
        this.userInfoInRoom = item
    }

    getUserInfoInRoom(){
        return this.userInfoInRoom
    }

    setSelectChipValue(val: number) {
        this.selectChipValue = val
    }

    getUserIconUrl(): string {
        // let  iconUrl = 'http://localhost:7456/res/import/cf/cff28e0a-70b9-498d-a348-40eda2f525a8.jpg'
        let iconUrl = ConfigManage.getUserIconUrl() + this.userInfo.icon
        return iconUrl
    }

    setUserInfo(info: UserInfo) {
        this.userInfo = new UserItem(info)
    }

    public requestUserInfo(userId: string): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (this.userInfo !== null) {
                resolve({ result: ResponseStatus.SUCCESS, extObject: this.userInfo })
                return
            }
            let httpUrl = config.serverAddress + InterfaceUrl.GET_USER_INFO
            axios
            .get(httpUrl, {
                params: {
                    id: userId
                }
            })
            .then((response: any): void => {
                let info = response.data
                if(info.status == 0){
                    resolve({ result: ResponseStatus.FAIL, extObject: info })
                    return
                }
                let userInfo = info.data as UserInfo
                let gameConfig = info.config as RoomGameConfig
                ConfigManage.setGameUrl(info.gameUrl)
                ConfigManage.setAudioUrl(info.config.userAudioUrl)
                ConfigManage.setUserIconUrl(gameConfig.userIconUrl)
                ConfigManage.setRapLandlordTime(gameConfig.rapLandlordTime)
                this.userInfo = new UserItem(userInfo)
                resolve({ result: ResponseStatus.SUCCESS, extObject: this.userInfo })
            }).catch(function(e){
                resolve({ result: ResponseStatus.FAIL, extObject: {status:0,message:'net_error',data:''} })
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
