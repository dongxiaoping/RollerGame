import { UserInfo, userType } from './UserBase'
import { eventBus } from '../../common/EventBus'
import { EventType, LocalNoticeEventType } from '../../common/Const'

export default class UserItem {
    public id: string = null
    public icon: string = null
    public nick: string = null
    private _type: userType = null
    public score: number = null
    private _diamond: number = null
    public phone: string = null

    constructor(val: UserInfo) {
        this.type = val.type
        this.id = val.id
        this.icon = val.icon
        this.nick = val.nick
        this.score = val.score
        this._diamond = val.diamond
        this.phone = val.phone
    }
    get type(): userType {
        return this._type
    }
    set type(val: userType) {
        this._type = val
    }

    get diamond(): number {
        return this._diamond
    }
    set diamond(val: number) {
        this._diamond = val
        eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
            type: LocalNoticeEventType.DIAMOND_COUNT_CHANGE,
            info: val
        })
    }
}

