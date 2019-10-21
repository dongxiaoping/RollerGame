export enum userType{
    NORMAL_USER = 1, //普通用户
    CHEAT_USER = 2 //作弊用户
}

export interface UserInfo{
    userId : string
    userName: string
    userIcon: string
    userType: userType
    score: number
    diamondCount: number
    phone: string
}

export function emptyUserInfo(): UserInfo{
    return{
        userId: '',
        userName: '',
        userIcon: '',
        userType: userType.NORMAL_USER,
        score: 0,
        diamondCount: 0,
        phone: ''
    }
}