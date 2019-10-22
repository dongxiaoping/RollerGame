const { ccclass } = cc._decorator;
import { UserInfo, emptyUserInfo } from './UserBase'
import { config, } from '../../common/Config'
import { appMode, PromiseParam, PromiseResult } from '../../common/Const'
import { userInfo } from '../../mock/UserInfo'
import axios from 'axios'
@ccclass
class User {
    private userInfo: UserInfo = null
    constructor() {
    }

    public requestUserInfo(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (config.appMode === appMode.DEV) {
                this.userInfo = userInfo
                console.log(axios)
            } else {
                this.userInfo = emptyUserInfo()
                axios
                .get('https://www.baidu.com')
                .then((response: any): void => {
                    console.log(5555555555555555)
                })
            }
            resolve({ result: PromiseResult.SUCCESS, extObject: this.userInfo })
        })
    }
}

export default new User
