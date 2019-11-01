import { betLocaion } from '../../common/Const'
export interface BetRecord {
    id: string
    userId: string
    raceId: string
    betLocaion: betLocaion
    moneyValue: number
}

export interface BetScore {
    raceId: string,
    userId: string,
    sky: number,
    land: number,
    middle: number,
    bridg: number,
    skyCorner: number,
    landCorner: number
}