import { raceRecord, RaceState, CompareDxRe } from '../common/Const'
export const RaceList: raceRecord[] = [
    {
        id: '1',
        raceNum: 0,
        landlordId: '6666660',
        playState: RaceState.NOT_BEGIN,
        landlordScore: { 'one': 3, 'two': 3 },
        skyScore: { 'one': 3, 'two': 3 },
        middleScore: { 'one': 3, 'two': 3 },
        landScore: { 'one': 3, 'two': 3 },
        points: { one: 3, two: 5 },
        landResult: CompareDxRe.BIG,
        middleResult: CompareDxRe.BIG,
        bridgResult: CompareDxRe.BIG,
        landCornerResult: CompareDxRe.BIG,
        skyCornerResult: CompareDxRe.BIG,
        skyResult: CompareDxRe.BIG
    }, {
        id: '3',
        raceNum: 1,
        landlordId: '6666660',
        playState: RaceState.NOT_BEGIN,
        landlordScore: { 'one': 3, 'two': 3 },
        skyScore: { 'one': 3, 'two': 3 },
        middleScore: { 'one': 3, 'two': 3 },
        landScore: { 'one': 3, 'two': 3 },
        points: { one: 3, two: 5 },
        landResult: CompareDxRe.BIG,
        middleResult: CompareDxRe.BIG,
        bridgResult: CompareDxRe.BIG,
        landCornerResult: CompareDxRe.BIG,
        skyCornerResult: CompareDxRe.BIG,
        skyResult: CompareDxRe.BIG
    }

]

