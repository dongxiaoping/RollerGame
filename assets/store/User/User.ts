const { ccclass } = cc._decorator;
import { UserInfo, emptyUserInfo } from './UserBase'
import { config, } from '../../static/Config'
import { appMode } from '../../static/Const'
import {userInfo} from '../../mock/UserInfo'
@ccclass
class User {
    userInfo: UserInfo
    constructor() {
        if (config.appMode === appMode.DEV) {
            this.userInfo = userInfo
        } else {
            this.userInfo = emptyUserInfo()
        }
    }
    requestUserInfo() {

    }
}

export default new User
