export enum singleGameState{
    NOT_BEGIN = 1, //没开始
    DELIVERY_MONEY = 2,  //下注中
    RESULT = 3,  //揭晓结果
    FINISHED = 4  //完成
}

export interface BetRecord{
    id: string
    gameId: string
    userId: string
    moneyValue: number
    modTime: string
}

export interface SingleGame{
    id: string
    num: number //场次编号
    state: singleGameState
    betRecords: BetRecord[]
}