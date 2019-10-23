export enum raceState{
    NOT_BEGIN = 1, //没开始
    DELIVERY_MONEY = 2,  //下注中
    RESULT = 3,  //揭晓结果
    FINISHED = 4  //完成
}

export interface BetRecord{
    id: string
    userId: string
    moneyValue: number
}

export interface raceRecord{
    raceId: string
    num: number //场次编号
    state: raceState
    betRecords: BetRecord[]
}