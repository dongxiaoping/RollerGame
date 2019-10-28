const { ccclass } = cc._decorator;
import { config, } from '../../common/Config'
import { appMode, PromiseParam, PromiseResult } from '../../common/Const'
import GameMemberItem from './GameMemberItem'
import { GameMemberList } from '../../mock/GameMemberList'
import {GameMember} from './GameMemberBase'
import axios from 'axios'
@ccclass
class GameMemberManage {
    private gameMenmberList: GameMemberItem[] = []

    public requestGameMemberList(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            if (config.appMode === appMode.DEV) {
                GameMemberList.forEach((item: GameMember):void=>{
                    this.gameMenmberList.push(new GameMemberItem(item))
                })
            } else {

            }
            resolve({ result: PromiseResult.SUCCESS, extObject: this.gameMenmberList })
        })
    }
}

export default new GameMemberManage
