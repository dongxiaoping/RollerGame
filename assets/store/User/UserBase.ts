export enum userType {
    NORMAL_USER = 1, //普通用户
    CHEAT_USER = 2 //作弊用户
}

export interface UserInfo {
    id: string
    icon: string
    nick: string
    type: userType
    score: number
    diamond: number
    phone: string
}

export const emptyUserInfo = function (): UserInfo {
    return {
        id: '',
        nick: '',
        icon: '',
        type: userType.NORMAL_USER,
        score: 0,
        diamond: 0,
        phone: ''
    }
}