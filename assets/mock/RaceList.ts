import { DiceCountInfo, raceRecord, RaceState } from '../common/Const'
export const RaceList: raceRecord[] = [
    {
        raceId: '1',
        num: 0,
        landlordId: '',
        state: RaceState.SHOW_RESULT,
        majongResult: { sky: { one: 9, two: 0.5 }, land: { one: 1, two: 2 }, landlord: { one: 1, two: 1 }, middle: { one: 5, two: 6 } }
    } ,
    {
        raceId: '2',
        num: 1,
        landlordId: '',
        state: RaceState.NOT_BEGIN,
        majongResult: { sky: { one: 3, two: 1 }, land: { one: 6, two: 2 }, landlord: { one: 9, two: 4 }, middle: { one: 0.5, two: 6 } }
    }//,
    {
        raceId: '3',
        num: 2,
        landlordId: '23',
        state: RaceState.NOT_BEGIN,
        majongResult: { sky: { one: 1, two: 2 }, land: { one: 3, two: 4 }, landlord: { one: 5, two: 6 }, middle: { one: 7, two: 8 } }
    },
    {
        raceId: '4',
        num: 3,
        landlordId: '23',
        state: RaceState.NOT_BEGIN,
        majongResult: { sky: { one: 3, two: 4 }, land: { one: 5, two: 6 }, landlord: { one: 7, two: 8 }, middle: { one: 9, two: 0.5 } }
    },
    {
        raceId: '5',
        num: 4,
        landlordId: '23',
        state: RaceState.NOT_BEGIN,
        majongResult: { sky: { one: 5, two: 6 }, land: { one: 7, two: 8 }, landlord: { one: 9, two: 0.5 }, middle: { one: 1, two: 2 } }
    },
    {
        raceId: '6',
        num: 5,
        landlordId: '23',
        state: RaceState.NOT_BEGIN,
        majongResult: { sky: { one: 7, two: 8 }, land: { one: 9, two: 0.5 }, landlord: { one: 1, two: 2 }, middle: { one: 3, two: 4 } }
    }
]