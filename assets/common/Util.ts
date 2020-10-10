import { DiceCountInfo, MajhongValueType, TableLocationType, raceResultData } from './Const'
import GameMemberItem from '../store/GameMember/GameMemberItem'
export function randEventId(): string {
    return `roll_${new Date().getTime()}_${Math.ceil(
        Math.random() * 10
    )}`
}

export function getMajhongValueType(majongInfo: DiceCountInfo): MajhongValueType {
    if((majongInfo.one == 2 && majongInfo.two == 8) || (majongInfo.one == 8 && majongInfo.two == 2)){
        return MajhongValueType.ER_BA_GANG
    }else if (majongInfo.one === majongInfo.two) {
        return MajhongValueType.DUI_ZI
    } else if (majongInfo.two + majongInfo.one == 10) {
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
    if (roomId !== null ) {
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


export function touchMoveEvent(event: any) {
    let dx = Math.abs(event.currentTouch._point.x - event.currentTouch._startPoint.x)
    let dy = Math.abs(event.currentTouch._point.y - event.currentTouch._startPoint.y)
    var dis = parseFloat(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)).toFixed(2));
    if (dis < 30) {
        return false
    }
    return true
}

export function mergeRaceResult(listOne: raceResultData[], listTwo: raceResultData[]): raceResultData[] {
    for (let i = 0; i < listOne.length; i++) {
        let item = listOne[i]
        let itemExist = false
        for (let j = 0; j < listTwo.length; j++) {
            if (item.userId === listTwo[j].userId) {
                itemExist = true
                listTwo[j].score += item.score
            }
        }
        if (!itemExist) {
            listTwo.push(item)
        }
    }
    return listTwo
}

//返回指定返回随机整数
export function randomRange(min: number, max: number) { // min最小值，max最大值
    return Math.floor(Math.random() * (max - min)) + min;
}

export const webCookie = {
    setItem: function (name, value, expireHour) {
        var Days = 6 * 30 * 24 * 60 * 60 * 1000;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + "; path=/";
    },

    //读取cookies
    getItem: function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            var value = unescape(arr[2]);
            this.setItem(name, value);
            return value;
        } else {
            return null;
        }
    },

    //删除cookies
    removeItem: function (name,path="/") {
        let exp = new Date();
        let exp_time = exp.getTime();
        let new_time = exp_time - 1;
        exp.setTime(new_time);
        let exp_string = exp.toGMTString();
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            let value = unescape(arr[2]);
            document.cookie = name + "=" + value + ";expires=" + exp_string+ "; path="+path;
        }
    }
}
