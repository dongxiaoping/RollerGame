export interface RoomGameConfig {
    rollDiceTime: number //摇色子持续时间 s
    dealTime: number //发牌持续时间 s
    betTime: number //下注持续时间 s
    showDownTime: number //开牌时间
    showResultKeepTime: number //结果显示停留时间 s
    showResultTime: number //结果面板持续时间 s
    delayTime?: number //服务器和客户端之间的延迟时间
}
export const roomGameConfig: RoomGameConfig = {
    rollDiceTime: 5,
    dealTime: 4,
    betTime: 15,
    showDownTime: 10,
    showResultKeepTime: 4,
    showResultTime: 5
}