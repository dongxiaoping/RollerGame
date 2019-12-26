
const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
    touchStart:any
    start(){
        cc.log('start')
        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: Event) => {
            // cc.log('滑动事件')
            // let dx = Math.abs(event.currentTouch._point.x - event.currentTouch._startPoint.x);
            // let dy = Math.abs(event.currentTouch._point.y - event.currentTouch._startPoint.y);
            // var dis = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            // cc.log(dis)
            //  event.cu
            // let notice = {
            //     type: NoticeType.cancelRaceBet, info: {
            //         userId: UserManage.userInfo.id,
            //         roomId: RoomManage.roomItem.id,
            //         raceNum: RoomManage.roomItem.oningRaceNum,
            //         betLocation: this.typeValue
            //     } as BetNoticeData
            // } as NoticeData
            // ws.send(JSON.stringify(notice));
        })

        // this.node.on(cc.Node.EventType.TOUCH_START, (event: any) => {
        //     // cc.log(event.currentTouch._point.x)
        //     // cc.log(event.currentTouch._point.y)
        // })
        // this.node.on(cc.Node.EventType.TOUCH_END, (event: any) => {
        //      let dx = Math.abs(event.currentTouch._point.x - event.currentTouch._startPoint.x);
        //      let dy = Math.abs(event.currentTouch._point.y - event.currentTouch._startPoint.y);
        //      var dis = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)).toFixed(2);
        //      cc.log(dis)
        // })
    }

    onEnable(){
        cc.log('onEnable')
    }

    onLoad(){
        cc.log('onLoad')
    }
}
      
