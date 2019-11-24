const { ccclass } = cc._decorator;
import { config } from '../../common/Config'
import { appMode, PromiseParam, PromiseResult, ResponseStatus } from '../../common/Const'
import { userInfo } from '../../mock/UserInfo'
import UserItem from './UserItem'
import axios from 'axios'
import { UserInfo } from './UserBase';
@ccclass
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



    public requestUserInfo(userId: string): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (config.appMode === appMode.LOCAL_TEST) {
                this.setUserInfo(userInfo)
                resolve({ result: PromiseResult.SUCCESS, extObject: this.userInfo })
            } else {
                let httpUrl = config.serverAddress + '/race/user/get_user_info_by_id'
                axios
                    .get(httpUrl, {
                        params: {
                            id: userId
                        }
                    })
                    .then((response: any): void => {
                        let info = response.data.data
                        this.userInfo = new UserItem(info)
                        resolve({ result: ResponseStatus.SUCCESS, extObject: this.userInfo })
                    })
            }

        })
    }

    public requestVisitorUserInfo(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            let httpUrl = config.serverAddress + '/race/user/create_visit_account'
            axios
                .get(httpUrl)
                .then((response: any): void => {
                    let info = response.data.data
                    this.userInfo = new UserItem(info)
                    resolve({ result: ResponseStatus.SUCCESS, extObject: this.userInfo })
                })
        })
    }
}

export default new UserManage()
