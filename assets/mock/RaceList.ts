import { raceRecord, BetRecord, raceState } from '../store/Races/RaceBase'

export const GameMemberList: raceRecord[] = [
    {
        raceId: '4234',
        num: 1,
        state: raceState.FINISHED,
        betRecords: [
            {
                id: '4324',
                userId: '42343',
                moneyValue: 43
            },
            {
                id: '432444',
                userId: '424343',
                moneyValue: 4
            }
        ]
    },
    {
        raceId: '42344',
        num: 2,
        state: raceState.FINISHED,
        betRecords: [
            {
                id: '4323454',
                userId: '42343',
                moneyValue: 3
            },
            {
                id: '43332444',
                userId: '424343',
                moneyValue: 9
            }
        ]
    }
]