export interface RoomGameConfig {
    rapLandlordTime:number //抢地主倒计时
    customerWechat:string //客服微信号
    informMessage:string //公告信息
    timeBeforeBeginText: number  //开始文字显示之前的延迟空白时间 s
    beginTextShowTime: number //开始文字显示停留时间
    rollDiceTime: number //摇色子持续时间 s
    dealTime: number //发牌持续时间 s
    betTime: number //下注持续时间 s
    showDownTime: number //开牌时间
    userIconUrl:string //用户icon前缀
    showResultKeepTime: number //结果显示停留时间 s
    showResultTime: number //结果面板持续时间 s
}
/* 发牌阶段时间 = timeBeforeBeginText + beginTextShowTime + rollDiceTime + dealTime
 * 下注阶段时间 = betTime
 * 比大小阶段时间 = showDownTime + showResultKeepTime + showResultTime
 */
