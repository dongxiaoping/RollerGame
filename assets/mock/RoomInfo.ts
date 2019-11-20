import { RoomInfo, playMode, roomState, CreateRoomPayModel } from '../common/Const'

export const roomInfo: RoomInfo = {
    id: 12,
    creatUserId: '23',
    memberLimit: 8,
    playCount: 7,
    playMode: playMode.TURN,
    roomFee: 10,
    roomPay: CreateRoomPayModel.AA,
    costLimit: 20,
    roomState: roomState.OPEN,
    oningRaceNum: 0
}