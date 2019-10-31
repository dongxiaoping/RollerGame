import { GameMember, gameMemberType } from '../store/GameMember/GameMemberBase'

export const GameMemberList: GameMember[] = [
    {
        userId: '23',
        roleType: gameMemberType.PLAYER,
        nick: '王五',
        icon: 'test/11',
        count:5
    },
    {
        userId: '24',
        roleType: gameMemberType.LANDLORD,
        nick: '张三',
        icon: 'test/33',
        count:3
    },
    {
        userId: '25',
        roleType: gameMemberType.PLAYER,
        nick: '二哈',
        icon: 'test/44',
        count:3
    },
    {
        userId: '26',
        roleType: gameMemberType.PLAYER,
        nick: '李四',
        icon: 'test/22',
        count:4
    }
]