const { ccclass } = cc._decorator;
import {GameMember, gameMemberType} from './GameMemberBase'

@ccclass
export default class GameMemberItem {
    public userId: string = null
    public roleType: gameMemberType = null
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
}
