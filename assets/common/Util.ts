import { DiceCountInfo, MajhongValueType, TableLocationType, raceResultData } from './Const'
import axios from 'axios'
import { config } from './Config'
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

export function getMahjongValueVoice(majongInfo: DiceCountInfo): void {
    let typeV = this.getMajhongValueType(majongInfo)
    switch (typeV) {
        case MajhongValueType.DUI_ZI:
            cc.log('对子')
            break
        case MajhongValueType.BI_SHI:
            cc.log('鄙十')
            break
        case MajhongValueType.DIAN:
            cc.log('点数')
            let ponit = majongInfo.two + majongInfo.one
            if (ponit > 10) {
                ponit = ponit - 10
            }
            switch (ponit) {
                case 1.5:
                    cc.log('1.5点')
                    break
                case 2.5:
                    cc.log('2.5点')
                    break
                case 3.5:
                    cc.log('3.5点')
                    break
                case 4.5:
                    cc.log('4.5点')
                    break
                case 5.5:
                    cc.log('5.5点')
                    break
                case 6.5:
                    cc.log('6.5点')
                    break
                case 7.5:
                    cc.log('7.5点')
                    break
                case 8.5:
                    cc.log('8.5点')
                    break
                case 9.5:
                    cc.log('9.5点')
                    break
                case 1:
                    cc.log('1点')
                    break
                case 2:
                    cc.log('2点')
                    break
                case 3:
                    cc.log('3点')
                    break
                case 4:
                    cc.log('4点')
                    break
                case 5:
                    cc.log('5点')
                    break
                case 6:
                    cc.log('6点')
                    break
                case 7:
                    cc.log('7点')
                    break
                case 8:
                    cc.log('8点')
                    break
            }
            break
    }
}

export const Ajax = axios.create({
    baseURL: config.serverAddress,
    timeout: config.requestTimeoutTime,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'//'application/json'
    }
})

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