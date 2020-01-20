import { raceRecord, RaceState, CompareDxRe } from '../common/Const'
export const RaceList: raceRecord[] = [
    {
        id: '1',
        raceNum: 0,
        landlordId: '6666661',
        playState: RaceState.NOT_BEGIN,
        landlordScore: { 'one': 2, 'two': 8 },
        skyScore: { 'one': 3, 'two': 4 },
        middleScore: { 'one': 4, 'two': 1 },
        landScore: { 'one': 3, 'two': 5 },
        points: { one: 6, two: 5 },
        landResult: CompareDxRe.SMALL,
        middleResult: CompareDxRe.SMALL,
        bridgResult: CompareDxRe.SMALL,
        landCornerResult: CompareDxRe.SMALL,
        skyCornerResult: CompareDxRe.SMALL,
        skyResult: CompareDxRe.SMALL
    }, {
        id: '2',
        raceNum: 1,
        landlordId: '6666661',
        playState: RaceState.NOT_BEGIN,
        landlordScore: { 'one': 0.5, 'two': 3 },
        skyScore: { 'one': 3, 'two': 3 },
        middleScore: { 'one': 6, 'two': 1 },
        landScore: { 'one': 2, 'two': 1 },
        points: { one: 1, two: 1 },
        landResult: CompareDxRe.SMALL,
        middleResult: CompareDxRe.BIG,
        bridgResult: CompareDxRe.EQ,
        landCornerResult: CompareDxRe.EQ,
        skyCornerResult: CompareDxRe.BIG,
        skyResult: CompareDxRe.BIG
    }, {
        id: '3',
        raceNum: 2,
        landlordId: '6666661',
        playState: RaceState.NOT_BEGIN,
        landlordScore: { 'one': 2, 'two': 4 },
        skyScore: { 'one': 6, 'two': 1 },
        middleScore: { 'one': 7, 'two': 0.5 },
        landScore: { 'one': 8, 'two': 8 },
        points: { one: 4, two: 4 },
        landResult: CompareDxRe.BIG,
        middleResult: CompareDxRe.BIG,
        bridgResult: CompareDxRe.BIG,
        landCornerResult: CompareDxRe.BIG,
        skyCornerResult: CompareDxRe.BIG,
        skyResult: CompareDxRe.BIG
    }, {
        id: '4',
        raceNum: 3,
        landlordId: '6666661',
        playState: RaceState.NOT_BEGIN,
        landlordScore: { 'one': 5, 'two': 5 },
        skyScore: { 'one': 1, 'two': 1 },
        middleScore: { 'one': 3, 'two': 4 },
        landScore: { 'one': 8, 'two': 2 },
        points: { one: 2, two: 3 },
        landResult: CompareDxRe.BIG,
        middleResult: CompareDxRe.SMALL,
        bridgResult: CompareDxRe.EQ,
        landCornerResult: CompareDxRe.EQ,
        skyCornerResult: CompareDxRe.SMALL,
        skyResult: CompareDxRe.SMALL
    }
]

