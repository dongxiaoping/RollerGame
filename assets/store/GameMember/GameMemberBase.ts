export enum gameMemberType {
    LANDLORD = 1, //地主
    PLAYER = 2,  //参赛者
    VISITOR = 3   //观众
}

export interface GameMember {
    userId: string
    roleType: gameMemberType
    nick: string
    icon: string
    count: number
}