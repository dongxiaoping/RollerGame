const { ccclass } = cc._decorator;
import {UserInfo, emptyUserInfo} from './Base'

@ccclass
class User {
    userInfo : UserInfo
    constructor(){
        this.userInfo = emptyUserInfo()
    }

    requestUserInfo(){

    }
}

export default new User
