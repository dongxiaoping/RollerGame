const { ccclass, property } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType } from '../../common/Const'
import { UserInfo, userType } from './UserBase'
@ccclass
export default class UserItem {
    private id: string = null
    private icon: string = null
    private nick: string = null
    private _type: userType = null
    private score: number = null
    private diamond: number = null
    private phone: string = null

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
         cc.log(this._type + '--' + val)
        if (val !== this._type) {
            eventBus.emit(EventType.VAL_USER_TYPE_CHANGE, {
                old:  this._type, new: val
            })
        }
        this._type= val
    }
}

