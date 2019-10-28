const { ccclass } = cc._decorator;
import {GameMember, gameMemberType} from './GameMemberBase'

@ccclass
export default class GameMemberItem {
    private userId: string = null
    private roleType: gameMemberType = null
    private nick: string = null
    private icon: string = null

    constructor(val: GameMember) {
        this.userId = val.userId
        this.roleType = val.roleType
        this.nick = val.nick
        this.icon = val.icon
    }
}
