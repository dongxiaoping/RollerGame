const { ccclass } = cc._decorator;
import { config } from '../../common/Config'
import { appMode, PromiseParam, PromiseResult } from '../../common/Const'
import { userInfo } from '../../mock/UserInfo'
import UserItem from './UserItem'
import axios from 'axios'
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

    public requestUserInfo(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (config.appMode === appMode.LOCAL_TEST) {
                this.userInfo = new UserItem(userInfo)
                resolve({ result: PromiseResult.SUCCESS, extObject: this.userInfo })
            } else {
                let httpUrl = config.serverAddress + 'race/user/get_user_info_by_id'
                axios
                    .get(httpUrl, {
                        params: {
                            id: 1
                        }
                    })
                    .then((response: any): void => {
                        let info = response.data.data
                        this.userInfo = new UserItem(info)
                        cc.log(response)
                        resolve({ result: PromiseResult.SUCCESS, extObject: this.userInfo })
                    })
            }
 
        })
    }
}

export default new UserManage()
