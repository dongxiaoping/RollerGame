import { GameMember, gameMemberType } from '../store/GameMember/GameMemberBase'

export const GameMemberList: GameMember[] = [
    {
        userId: '23',
        roleType: gameMemberType.PLAYER,
        nick: '王五',
        icon: 'a.png'
    },
    {
        userId: '24',
        roleType: gameMemberType.PLAYER,
        nick: '张三',
        icon: 'a.png'
    },
    {
        userId: '25',
        roleType: gameMemberType.LANDLORD,
        nick: '李四',
        icon: 'a.png'
    }
]