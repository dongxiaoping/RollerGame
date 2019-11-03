import { DiceCountInfo, raceRecord, raceState  } from '../common/Const'
export const RaceList: raceRecord[] = [
    {
        raceId: '1',
        num: 1,
        state: raceState.SHOW_RESULT,
        majongResult: { sky: { one: 7, two: 8 }, land: { one: 9, two: 0.5 }, landlord: { one: 1, two: 2 }, middle: { one: 3, two: 4 } }
    },
    {
        raceId: '2',
        num: 2,
        state: raceState.NOT_BEGIN,
        majongResult: { sky: { one: 9, two: 0.5 }, land: { one: 1, two: 2 }, landlord: { one: 3, two: 4 }, middle: { one: 5, two: 6 } }
    },
    {
        raceId: '3',
        num: 3,
        state: raceState.NOT_BEGIN,
        majongResult: { sky: { one: 1, two: 2 }, land: { one: 3, two: 4 }, landlord: { one: 5, two: 6 }, middle: { one: 7, two: 8 } }
    },
    {
        raceId: '4',
        num: 4,
        state: raceState.NOT_BEGIN,
        majongResult: { sky: { one: 3, two: 4 }, land: { one: 5, two: 6 }, landlord: { one: 7, two: 8 }, middle: { one: 9, two: 0.5 } }
    },
    {
        raceId: '5',
        num: 5,
        state: raceState.NOT_BEGIN,
        majongResult: { sky: { one: 5, two: 6 }, land: { one: 7, two: 8 }, landlord: { one: 9, two: 0.5 }, middle: { one: 1, two: 2 } }
    },
    {
        raceId: '6',
        num: 6,
        state: raceState.NOT_BEGIN,
        majongResult: { sky: { one: 7, two: 8 }, land: { one: 9, two: 0.5 }, landlord: { one: 1, two: 2 }, middle: { one: 3, two: 4 } }
    },
    {
        raceId: '7',
        num: 7,
        state: raceState.NOT_BEGIN,
        majongResult: { sky: { one: 9, two: 0.5 }, land: { one: 1, two: 2 }, landlord: { one: 3, two: 4 }, middle: { one: 5, two: 6 } }
    },
    {
        raceId: '8',
        num: 8,
        state: raceState.NOT_BEGIN,
        majongResult: { sky: { one: 1, two: 2 }, land: { one: 3, two: 4 }, landlord: { one: 5, two: 6 }, middle: { one: 7, two: 8 } }
    }
]