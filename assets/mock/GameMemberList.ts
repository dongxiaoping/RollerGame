import { GameMember, gameMemberType, memberState } from '../common/Const'


export const GameMemberList: GameMember[] = [ //数据默认第一个是房主
    {
        userId: '6666661',
        roleType: gameMemberType.PLAYER,
        nick: '糊涂虫',
        icon: 'test/44',
        score:0,
        state:memberState.OnLine
    },
    {
        userId: '6666662',
        roleType: gameMemberType.PLAYER,
        nick: '张三',
        icon: 'test/33',
        score:0,
        state:memberState.OnLine
    },
    {
        userId: '6666663',
        roleType: gameMemberType.PLAYER,
        nick: '二哈',
        icon: 'test/44',
        score:0,
        state:memberState.OnLine
    },
    {
        userId: '6666664',
        roleType: gameMemberType.PLAYER,
        nick: '李四',
        icon: 'test/22',
        score:0,
        state:memberState.OnLine
    },
    {
        userId: '6666665',
        roleType: gameMemberType.PLAYER,
        nick: '飘',
        icon: 'test/22',
        score:0,
        state:memberState.OnLine
    },
    {
        userId: '6666666',
        roleType: gameMemberType.PLAYER,
        nick: '风吹屁屁凉',
        icon: 'test/22',
        score:0,
        state:memberState.OnLine
    },
    {
        userId: '6666667',
        roleType: gameMemberType.PLAYER,
        nick: '这里有眼',
        icon: 'test/22',
        score:0,
        state:memberState.OnLine
    },
    {
        userId: '6666668',
        roleType: gameMemberType.PLAYER,
        nick: '眼在兜里',
        icon: 'test/22',
        score:0,
        state:memberState.OnLine
    },
    {
        userId: '6666669',
        roleType: gameMemberType.PLAYER,
        nick: '眼在兜里没有',
        icon: 'test/22',
        score:0,
        state:memberState.OnLine
    }
]