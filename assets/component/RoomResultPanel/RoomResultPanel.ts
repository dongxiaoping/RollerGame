
const { ccclass, property } = cc._decorator
import GameMemberManage from '../../store/GameMember/GameMemberManage'
import GameMemberItem from '../../store/GameMember/GameMemberItem'
import RaceManage from '../../store/Races/RaceManage';

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    leftList: cc.Node = null;
    @property(cc.Node)
    rightList: cc.Node = null;
    @property(cc.Prefab)
    userItem: cc.Prefab = null;

    leftUserList: any[] = []
    rightUserList: any[] = []

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.updateShow()
    }

    async updateShow(){
        let infoTwo = await GameMemberManage.requestGameMemberList()
        let memberList = GameMemberManage.gameMenmberList
        let i = 1
        memberList.forEach((item: GameMemberItem) => {
            if (i <= 5) {
                this.leftUserList.push(item)
            } else {
                this.rightUserList.push(item)
            }
            i++
        })
        
        this.leftUserList.forEach((item: GameMemberItem) => {
            let b = cc.instantiate(this.userItem)
            let jsOb = b.getComponent('RoomResultUserItem')
            let score = RaceManage.getScoreByUserId(item.userId)
            jsOb.initData('', item.nick, score)
            this.leftList.addChild(b)
        })

        this.rightUserList.forEach((item: GameMemberItem) => {
            let b = cc.instantiate(this.userItem)
            let jsOb = b.getComponent('RoomResultUserItem')
            let score = RaceManage.getScoreByUserId(item.userId)
            jsOb.initData('', item.nick, score)
            this.rightList.addChild(b)
        })
    }

    // update (dt) {}
}
