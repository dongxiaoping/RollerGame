import { RoomInfo, playMode, roomState, CreateRoomPayModel } from '../common/Const'

export const roomInfo: RoomInfo = {
    id: 88888,
    creatUserId: '6666660',
    memberLimit: 10,
    playCount: 4,
    playMode: playMode.TURN,
    roomFee: 10,
    roomPay: CreateRoomPayModel.AA,
    costLimit: 400,
    roomState: roomState.OPEN,
    oningRaceNum: 0
}