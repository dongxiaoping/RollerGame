import { GameMember, gameMemberType, memberState, EventType, MemberStateData } from '../../common/Const'
import { eventBus } from '../../common/EventBus'
export default class GameMemberItem {
    public userId: string = null
    public roleType: gameMemberType = null
    public nick: string = null
    public icon: string = null
    public score: number = null //积分
    public _state: memberState = null

    constructor(val: GameMember) {
        this.userId = val.userId
        this.roleType = val.roleType
        this.nick = val.nick
        this.icon = val.icon
        this.score = val.score
        this._state = val.state
    }

    get state(): memberState {
        return this._state
    }

    set state(val: memberState) {
        this._state = val
        eventBus.emit(EventType.MEMBER_STATE_CHANGE, { userId: this.userId, state: this._state } as MemberStateData)
    }
}
