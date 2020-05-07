import { config, } from '../../common/Config'
import { PromiseParam, PromiseResult, GameMember, EventType, LocalNoticeEventType, LocalNoticeEventPara, RaceState, roomState, memberState } from '../../common/Const'
import GameMemberItem from './GameMemberItem'
import { GameMemberList } from '../../mock/GameMemberList'
import { eventBus } from '../../common/EventBus';
import RoomManage from '../Room/RoomManage';
class GameMemberManage {
    private _gameMenmberList: GameMemberItem[] = null

    public clear() {
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
            //cc.log('成员上线')
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
        if (typeof (this._gameMenmberList[userId]) === 'undefined') {
            return null
        }
        return this._gameMenmberList[userId]
    }

    //服务器通知过来的用户信息，对本地的用户信息进行校验
    checkRoomMember(memberList: GameMember[]) {
        let invaildMemeberIds = this.getInvaildMemberIds(memberList)
        for (let i = 0; i < invaildMemeberIds.length; i++) {
            this.outGameMember(invaildMemeberIds[i])
        }
        let addMemberList = this.getNeedAddMemberList(memberList)
        for (let j = 0; j < addMemberList.length; j++) {
            this.addGameMember(addMemberList[j])
        }
    }

    private getInvaildMemberIds(serverMemberList: GameMember[]): string[] {
        let list = []
        this.gameMenmberList.forEach((item: GameMemberItem) => {
            let isExistMember = false
            let j = 0;
            for (; j < serverMemberList.length; j++) {
                if (serverMemberList[j]["userId"] == item.userId) {
                    isExistMember = true
                    break
                }
            }
            if (!isExistMember) {
                list.push(item.userId)
            }
        })
        return list
    }



    private getNeedAddMemberList(serverMemberList: GameMember[]): GameMember[] {
        let list = []
        serverMemberList.forEach((item: GameMemberItem) => {
            let isNeedAdd = true
            let j = 0;
            if (typeof (this.gameMenmberList[item.userId]) != 'undefined') {
                isNeedAdd = false
            }
            if (isNeedAdd) {
                list.push(item.userId)
            }
        })
        return list
    }
}

export default new GameMemberManage
