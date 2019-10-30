/* 牌桌
 * 功能：1、提供桌面显示 2、提供桌位的坐标 3、提供天、地、中等位置放置chip的中心点坐标
 * 3、提供出结果后，桌面的提示动画  4、提供用户图标显示管理
 */
const { ccclass, property } = cc._decorator;
import GameMemberManage from '../../store/GameMember/GameMemberManage'
import GameMemberItem from '../../store/GameMember/GameMemberItem'
import { GameMember, gameMemberType } from '../../store/GameMember/GameMemberBase'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    private playUserIcon: cc.Prefab = null //玩家icon

    start() {
        this.showMembers()
    }

    async showMembers() {
        let memberList = await GameMemberManage.requestGameMemberList()
        let list = memberList.extObject as GameMemberItem[]
        let locationList = [{ x: -2.6, y: -211 }, { x: -400, y: -39 }, { x: -5, y: 196 }, { x: 394, y: -72 }]
        let i = 0
        list.forEach((item: GameMemberItem): void => {
            var node = cc.instantiate(this.playUserIcon)
            node.name = item.userId
            node.parent = this.node.parent
            node.setPosition(locationList[i].x, locationList[i].y);
            node.active = true
            i++
        })
    }
}
