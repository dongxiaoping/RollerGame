import BetLocItem from '../../store/Bets/BetLocItem'
import {DiceCountInfo} from '../../common/Const'
export enum raceState {
    NOT_BEGIN = 1, //没开始
    CHOICE_LANDLORD = 2, //选地主
    ROLL_DICE = 3,  //摇色子
    DEAL = 4,  //发牌
    BET = 5,  //下注
    SHOW_DOWN = 6,  //比大小
    SHOW_RESULT = 7,  //揭晓结果
    FINISHED = 8  //完成
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