import BetLocItem from '../../store/Bets/BetLocItem'
import {DiceCountInfo} from '../../common/Const'
export enum raceState {
    NOT_BEGIN = 1, //没开始
    DELIVERY_MONEY = 2,  //下注中
    RESULT = 3,  //揭晓结果
    FINISHED = 4  //完成
}

export interface raceRecord {
    raceId: string
    num: number //场次编号
    betInfo?: BetLocItem[] //下注信息
    state: raceState
    majongResult?: MajongResult
}

export interface MajongResult {
    sky: DiceCountInfo,
    middle: DiceCountInfo,
    land: DiceCountInfo,
    landlord: DiceCountInfo
}