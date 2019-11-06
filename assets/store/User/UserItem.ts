const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType } from '../../common/Const'
import { UserInfo, userType } from './UserBase'
@ccclass
export default class UserItem {
    public id: string = null
    public icon: string = null
    public nick: string = null
    public _type: userType = null
    public score: number = null
    public diamond: number = null
    public phone: string = null

    constructor(val: UserInfo) {
        this.type = val.type
        this.id = val.id
        this.icon = val.icon
        this.nick = val.nick
        this.score = val.score
        this.diamond = val.diamond
        this.phone = val.phone
    }
    get type(): userType {
        return this._type
    }
    set type(val: userType) {
        this._type= val
    }
}

