import { config, } from '../../common/Config'
import { PromiseParam, PromiseResult, GameMember, EventType, LocalNoticeEventType, LocalNoticeEventPara, RaceState, roomState, memberState } from '../../common/Const'
import GameMemberItem from './GameMemberItem'
import { GameMemberList } from '../../mock/GameMemberList'
import { eventBus } from '../../common/EventBus';
import RoomManage from '../Room/RoomManage';
class GameMemberManage {
    private _gameMenmberList: GameMemberItem[] = null

    public reSet() {
        this._gameMenmberList = null
    }

    get gameMenmberList(): GameMemberItem[] {
        return this._gameMenmberList
    }

    set gameMenmberList(list: GameMemberItem[]) {
        this._gameMenmberList = list
    }

    setGameMemberList(gameMemberList: GameMember[]) {
        let list = []
        gameMemberList.forEach((item: GameMember): void => {
            list[item.userId] = new GameMemberItem(item)
        })
        this.gameMenmberList = list
    }

    //用户退出游戏
    outGameMember(userId: string) {
        if (typeof (this._gameMenmberList[userId]) !== 'undefined') {
            delete this._gameMenmberList[userId]
        }
        eventBus.emit(EventType.MEMBER_DELETE_FROM_ROOM, userId)
    }

    addGameMember(gameMember: GameMember) {
        let userId = gameMember.userId
        if (typeof (this.gameMenmberList[userId]) !== 'undefined') {
            this.gameMenmberList[userId].state = memberState.OnLine
            cc.log('成员上线')
            return false
        }
        let newMember = new GameMemberItem(gameMember)
        this._gameMenmberList[gameMember.userId] = newMember
        eventBus.emit(EventType.NEW_MEMBER_IN_ROOM, gameMember)
        return true
    }

    //获取数据并返回，优先从本地获取，本地没有从服务器获取
    public requestGameMemberList(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            resolve({ result: PromiseResult.SUCCESS, extObject: this.gameMenmberList })
        })
    }

    //直接从服务器获取
    public requestGameMemberListFromServer(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            resolve({ result: PromiseResult.SUCCESS, extObject: null })
        })
    }

    //1、从服务器上获取数据 2、对本地数据进行更新 3、返回更新后的数据
    public updateGameMemberListFromServer(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            resolve({ result: PromiseResult.SUCCESS, extObject: null })
        })
    }

    getGameMemberByUserId(userId: string): GameMemberItem {
        if (typeof (this._gameMenmberList[userId] === 'undefined')) {
            return null
        }
        return this._gameMenmberList[userId]
    }
}

export default new GameMemberManage
