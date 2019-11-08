import { DiceCountInfo, CompareMahjRe, MajhongValueType } from './Const'
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

//返回第一个值相对第二个值的对比结果，其中第一个值是庄家值(即地主)  true表示第一个参数大 false表示第一个参数小
export function isLandlordMahjongWin(landlordCount: DiceCountInfo, compareToCount: DiceCountInfo): boolean {
    let targerType = getMajhongValueType(landlordCount)
    let compareToType = getMajhongValueType(compareToCount)
    switch (targerType) {
        case MajhongValueType.DUI_ZI:
            switch (compareToType) {
                case MajhongValueType.DUI_ZI:
                    if (compareToCount.one > landlordCount.one) {
                        return false
                    } else {
                        return true
                    }
                    break
                case MajhongValueType.DIAN:
                    return true
                    break
                case MajhongValueType.BI_SHI:
                    return true
                    break
            }
            break
        case MajhongValueType.DIAN:
            switch (compareToType) {
                case MajhongValueType.DUI_ZI:
                    return false
                    break
                case MajhongValueType.DIAN:
                    let targerPonit = landlordCount.two + landlordCount.one
                    if (targerPonit > 10) {
                        targerPonit = targerPonit - 10
                    }
                    let compareToPonit = compareToCount.two + compareToCount.one
                    if (compareToPonit > 10) {
                        compareToPonit = compareToPonit - 10
                    }
                    if (targerPonit > compareToPonit) {
                        return true
                    } else if (targerPonit < compareToPonit) {
                        return false
                    } else { //点数相等情况下的判断
                        if (landlordCount.one === compareToCount.one || landlordCount.one === compareToCount.two) {
                            return true
                        } else if ((landlordCount.one > compareToCount.one && landlordCount.one > compareToCount.two) 
                        || (landlordCount.two > compareToCount.one && landlordCount.two > compareToCount.two)) {
                            return true
                        } else {
                            return false
                        }
                    }
                    break
                case MajhongValueType.BI_SHI:
                    return true
                    break
            }
            break
        case MajhongValueType.BI_SHI:
            switch (compareToType) {
                case MajhongValueType.DUI_ZI:
                    return false
                    break
                case MajhongValueType.DIAN:
                    return false
                    break
                case MajhongValueType.BI_SHI:
                    return true
                    break
            }
            break
    }
    return true
}