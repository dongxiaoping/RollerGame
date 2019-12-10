import { DiceCountInfo, MajhongValueType, TableLocationType, raceResultData } from './Const'
import GameMemberItem from '../store/GameMember/GameMemberItem'
export function randEventId(): string {
    return `roll_${new Date().getTime()}_${Math.ceil(
        Math.random() * 10
    )}`
}

export function getMajhongValueType(majongInfo: DiceCountInfo): MajhongValueType {
    if (majongInfo.one === majongInfo.two) {
        return MajhongValueType.DUI_ZI
    } else if (majongInfo.two + majongInfo.one === 10) {
        return MajhongValueType.BI_SHI
    } else {
        return MajhongValueType.DIAN
    }
}

export function randFloatNum(n: number, m: number) {
    let c = m - n + 1;
    return Math.random() * c + n;
}

//获取发牌位置
export function getFaPaiLocation(diceCountInfo: DiceCountInfo): TableLocationType {
    let val = (diceCountInfo.one + diceCountInfo.two)
    if (val === 2 || val === 6 || val === 10) {
        return TableLocationType.SKY
    } else if (val === 3 || val === 7 || val === 11) {
        return TableLocationType.MIDDLE
    } else if (val === 4 || val === 8 || val === 12) {
        return TableLocationType.LAND
    } else {
        return TableLocationType.LANDLORD
    }
}



//截取url中指定的传参
export function getUrlParam(name: string) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

//是否是Url直接去游戏房间的URL,如果是 要传userId 以及roomId
export function isUrlToGameRoom(): boolean {
    let roomId = getUrlParam('roomId')
    let userId = getUrlParam('userId')
    if (roomId !== null && userId !== null) {
        return true
    }
    return false
}

export function getDistanceBetweenTwoPoints(x1: number, y1: number, x2: number, y2: number) {
    let a = x1 - x2;
    let b = y1 - y2;
    let result = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    return result;
}

export function getItemFromResultDataByUserId(userId: string, list: raceResultData[]): raceResultData {
    for (let i = 0; i < list.length; i++) {
        if (list[i].userId === userId) {
            return list[i]
        }
    }
    return null
}

export function getMemeberResultScoreList(list: raceResultData[], memberList: GameMemberItem[]) {
    let newList: raceResultData[] = []
    memberList.forEach((item: GameMemberItem) => {
        let userId = item.userId
        let result = getItemFromResultDataByUserId(userId, list)
        if (result === null) {
            newList.push({
                userId: userId,
                score: 0,
                nick: item.nick,
                icon: item.icon,
            } as raceResultData)
        } else {
            newList.push(result)
        }
    })
    return newList
}