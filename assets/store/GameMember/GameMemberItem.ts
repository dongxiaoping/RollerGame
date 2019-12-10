import { GameMember, gameMemberType, memberState } from '../../common/Const'
export default class GameMemberItem {
    public userId: string = null
    public roleType: gameMemberType = null
    public nick: string = null
    public icon: string = null
    public score: number = null //积分
    public state: memberState = null

    constructor(val: GameMember) {
        this.userId = val.userId
        this.roleType = val.roleType
        this.nick = val.nick
        this.icon = val.icon
        this.score = val.score
        this.state = val.state
    }
}
