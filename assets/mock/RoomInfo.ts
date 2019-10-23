import {RoomInfo, playMode, roomState} from '../store/Room/RoomBase'

export const roomInfo: RoomInfo  = {
    num: 12,
    creatUserId: '23',
    memberLimit: 8,
    playCount : 8,
    playMode: playMode.TURN,
    costLimit: 20,
    roomState: roomState.PLAYING
}