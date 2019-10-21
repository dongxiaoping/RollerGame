export enum roomState{
    OPEN = 1, //创建
    PLAYING = 2,  //进行中
    CLOSE = 3   //关闭
}

export enum hostMode{
    ROB = 1,
    TURN = 2 
}

export interface RoomInfo{
    roomNumber : number
    roomState: roomState
    creatorId: string
    peopleLimit: number
    playCountLimit: number
    hostMode: hostMode  //轮庄模式
}