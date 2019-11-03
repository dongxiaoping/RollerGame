const { ccclass } = cc._decorator;
import { eventBus } from '../../common/EventBus'
import { EventType, GameState, ChildGameState, ChildGameParam, GameMember, gameMemberType } from '../../common/Const'
@ccclass
export default class GameMemberItem {
    public userId: string = null
    public _roleType: gameMemberType = null
    public nick: string = null
    public icon: string = null
    public count: number = null //积分

    constructor(val: GameMember) {
        this.userId = val.userId
        this.roleType = val.roleType
        this.nick = val.nick
        this.icon = val.icon
        this.count = val.count
    }

    set roleType(val: gameMemberType) {
        if (val === gameMemberType.LANDLORD) {
            cc.log('有用户被设置为地主')
            cc.log('发出地主改变通知')
            eventBus.emit(EventType.CHILD_GAME_STATE_CHANGE, { parentState: GameState.CHOICE_LANDLORD, childState: ChildGameState.CHOICE_LANDLORD.LANDLORD_HAS_CHANGE, val: this.userId } as ChildGameParam)
        }
        this._roleType = val
    }

    get roleType(): gameMemberType {
        return this._roleType
    }
}
