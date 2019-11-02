export enum roomState{
    OPEN = 1, //创建,房主没点开始，等待玩家进入
    PLAYING = 2,  //进行中
    CLOSE = 3   //关闭
}

export enum playMode{
    LANDLORD = 1, //霸王庄
    TURN = 2, //轮流
}

export interface RoomInfo{
    num : number  //房间编号
    creatUserId: string  //创建者ID
    memberLimit: number  //人员数量限制
    playCount: number  //场次限制
    playMode: playMode  //上庄模式
    costLimit: number  //消费上限
    roomState: roomState  //房间状态
    oningRaceNum?:number //当前进行中的场次编号
}