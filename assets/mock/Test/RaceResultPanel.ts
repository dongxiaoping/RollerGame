import { GameMember, gameMemberType, memberState, raceRecord, raceState } from '../../common/Const'
export const landlordInfoz: GameMember = {
    userId: '23',
    roleType: gameMemberType.LANDLORD,
    nick: '苹果',
    icon: 'test/44',
    score: 0,
    modTime: 3,
    state: memberState.OnLine
}

export const raceInfo: any = {
    raceId: '11',
    num: 1,
    betInfo: [{
        raceId: '11',
        userId: '12',
        sky: 0,
        land: 0,
        middle: 0,
        bridg: 0,
        skyCorner: 0,
        landCorner: 0,
        score: 0
    },
    {
        raceId: '114',
        userId: '1255',
        sky: 0,
        land: 0,
        middle: 0,
        bridg: 0,
        skyCorner: 0,
        landCorner: 0,
        score: 0
    }
    ],
    state: raceState.SHOW_DOWN,
    majongResult: {
        sky: { x: 0, y: 0 },
        middle: { x: 0, y: 0 },
        land: { x: 0, y: 0 },
        landlord: { x: 0, y: 0 }
    }
}