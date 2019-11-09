const { ccclass } = cc._decorator;
import { emptyUserInfo } from './UserBase'
import { config } from '../../common/Config'
import { appMode, PromiseParam, PromiseResult } from '../../common/Const'
import { userInfo } from '../../mock/UserInfo'
import UserItem from './UserItem'
import axios from 'axios'
@ccclass
class UserManage {
    public userInfo: UserItem = null
    selectChipValue: number = 10 //选中的下注值，默认10
    constructor() {
    }

    getSelectChipValue() {
        return this.selectChipValue
    }

    setSelectChipValue(val: number): number {
        return this.selectChipValue
    }

    public requestUserInfo(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (config.appMode === appMode.DEV) {
                this.userInfo = new UserItem(userInfo)
            } else {
                this.userInfo = new UserItem(emptyUserInfo())
                // axios
                // .get('https://www.baidu.com')
                // .then((response: any): void => {
                //     console.log(5555555555555555)
                // })
            }
            resolve({ result: PromiseResult.SUCCESS, extObject: this.userInfo })
        })
    }
}

export default new UserManage()
