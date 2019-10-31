
export interface BetRecord {
    id: string
    userId: string
    raceId: string
    betLocaion: betLocaion
    moneyValue: number
}


export enum betLocaion {
    SKY = 1,
    LAND = 2,
    MIDDLE = 3,
    BRIDG = 4,
    SKY_CORNER = 5,
    LAND_CORNER = 6
}

export interface BetScore {
    sky: number,
    land: number,
    middle: number,
    bridg: number,
    sky_corner: number,
    land_corner: number
}