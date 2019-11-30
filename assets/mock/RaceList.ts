import { raceRecord, RaceState, CompareDxRe } from '../common/Const'
export const RaceList: raceRecord[] = [
    {
        id: '1',
        raceNum: 0,
        landlordId: '6666661',
        playState: RaceState.NOT_BEGIN,
        landlordScore: { 'one': 9, 'two': 0.5 },
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
        id: '3',
        raceNum: 1,
        landlordId: '6666661',
        playState: RaceState.NOT_BEGIN,
        landlordScore: { 'one': 0.5, 'two': 3 },
        skyScore: { 'one': 3, 'two': 3 },
        middleScore: { 'one': 6, 'two': 1 },
        landScore: { 'one': 2, 'two': 5 },
        points: { one: 1, two: 1 },
        landResult: CompareDxRe.BIG,
        middleResult: CompareDxRe.BIG,
        bridgResult: CompareDxRe.BIG,
        landCornerResult: CompareDxRe.BIG,
        skyCornerResult: CompareDxRe.BIG,
        skyResult: CompareDxRe.BIG
    }

]

