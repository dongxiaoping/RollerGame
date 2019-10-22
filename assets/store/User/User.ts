const { ccclass } = cc._decorator;
import { UserInfo, emptyUserInfo } from './UserBase'
import { config, } from '../../static/Config'
import { appMode, PromiseParam, PromiseResult } from '../../static/Const'
import { userInfo } from '../../mock/UserInfo'
@ccclass
class User {
    private userInfo: UserInfo = null
    constructor() {
    }

    public requestUserInfo(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (config.appMode === appMode.DEV) {
                this.userInfo = userInfo
            } else {
                this.userInfo = emptyUserInfo()
            }
            resolve({ result: PromiseResult.SUCCESS, extObject: this.userInfo })
        })
    }
}

export default new User
