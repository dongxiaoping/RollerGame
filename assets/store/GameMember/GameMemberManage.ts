import { config, } from '../../common/Config'
import { appMode, PromiseParam, PromiseResult, GameMember, EventType, LocalNoticeEventType, LocalNoticeEventPara } from '../../common/Const'
import GameMemberItem from './GameMemberItem'
import { GameMemberList } from '../../mock/GameMemberList'
import { eventBus } from '../../common/EventBus';
class GameMemberManage {
    private _gameMenmberList: GameMemberItem[] = null

    public reSet(){
        this._gameMenmberList = null
    }

    get gameMenmberList(): GameMemberItem[] {
        return this._gameMenmberList
    }

    set gameMenmberList(list: GameMemberItem[]) {
        if (this._gameMenmberList === null) {
            cc.log('玩家成员数据第一次被初始化')
        } else { //对比2次数据变化情况，并对数据的变化发出通知
            list.forEach((item: GameMemberItem, index: any) => {
                if (typeof (this.gameMenmberList[index]) === 'undefined') {
                    cc.log('有新的成员添加进去')
                } else if (item.roleType !== this.gameMenmberList[index].roleType) {
                    cc.log('成员状态有修改')
                }
            })
        }
        this._gameMenmberList = list
    }

    setGameMemberList(gameMemberList: GameMember[]) {
        let list = []
        gameMemberList.forEach((item: GameMember): void => {
            list[item.userId] = new GameMemberItem(item)
        })
        this.gameMenmberList = list
    }

    addGameMember(gameMember: GameMember) {
        let userId = gameMember.userId
        cc.log(typeof (this.gameMenmberList[userId]))
        if (typeof (this.gameMenmberList[userId]) !== 'undefined') {
            cc.log('该成员存在')
            return false
        }
        let newMember = new GameMemberItem(gameMember)
        this._gameMenmberList[gameMember.userId] = newMember
        cc.log('成员有改变，发出本地通知，新增了玩家')
        eventBus.emit(EventType.NEW_MEMBER_IN_ROOM, gameMember)
        return true
    }

    //获取数据并返回，优先从本地获取，本地没有从服务器获取
    public requestGameMemberList(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (this.gameMenmberList !== null) {
                resolve({ result: PromiseResult.SUCCESS, extObject: this.gameMenmberList })
                return
            }
            if (config.appMode === appMode.LOCAL_TEST) { //从模拟数据获取
                this.setGameMemberList(GameMemberList)
                resolve({ result: PromiseResult.SUCCESS, extObject: this.gameMenmberList })
            } else { //从服务器获取
                //this.updateGameMemberListFromServer()
                resolve({ result: PromiseResult.SUCCESS, extObject: null })
            }

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
