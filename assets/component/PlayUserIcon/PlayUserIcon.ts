const { ccclass, property } = cc._decorator;
import GameMemberManage from '../../store/GameMember/GameMemberManage'
import GameMemberItem from '../../store/GameMember/GameMemberItem'

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Label)
    userName: cc.Label = null;

    @property(cc.Label)
    userCount: cc.Label = null;

    @property(cc.Sprite)
    userIcon: cc.Sprite = null;

    start() {
        this.showInfo()

    }

    async showInfo() {
        let memberList = await GameMemberManage.requestGameMemberList()
        let list = memberList.extObject as GameMemberItem[]
        list.forEach((item: GameMemberItem): void => {
            if (item.userId === this.node.name) {
                cc.loader.loadRes(item.icon, (error, img) => {
                    let myIcon = new cc.SpriteFrame(img);
                    this.userIcon.spriteFrame = myIcon
                    this.userCount.string = item.count + ''
                    this.userName.string = item.nick
                })
                return
            }
            
        })
    }

    // update (dt) {}
}
