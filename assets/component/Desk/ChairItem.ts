import { MemberInChairData, Coordinate } from "../../common/Const";

export default class ChairItem {
    private cc: any
    public chairName: string //一个10个椅子 每个椅子的节点都有一个固定名称 依次 Member_0 到Member_9
    private playUserIcon: any = null  //图标预制件
    constructor(ccOb: any, chairName: string, playUserIcon: any) {
        this.cc = ccOb
        this.chairName = chairName
        this.playUserIcon = playUserIcon

    }

    public inChairWithNode(userIconNode: any) {
        if (!this.isChairEmputy()) {
            return false
        }
        userIconNode.name = "PlayerIcon"
        userIconNode.parent = this.cc.find("Canvas/" + this.chairName)
        userIconNode.setPosition(0, 0)
    }



    //winVal 当前用户前几场输赢值  xiaZhuVal 当前用户当前下注值
    public inChair(memberInChairData: MemberInChairData): boolean {
        if (!this.isChairEmputy()) {
            return false
        }
        let chairNode = this.cc.find("Canvas/" + this.chairName)
        let userIconNode = this.cc.instantiate(this.playUserIcon)
        userIconNode.name = "PlayerIcon"
        userIconNode.setPosition(0, 0)
        userIconNode.parent = chairNode
        userIconNode.getComponent('PlayUserIcon').setShow(memberInChairData)
        return true
    }

    public outChair(func: any) {
        let ob = this.cc.find("Canvas/" + this.chairName).getChildByName("PlayerIcon")
        if (ob) {
            ob.destroy()
        }
        func()
    }

    public isChairEmputy(): boolean {
        let node = this.cc.find("Canvas/" + this.chairName)
        if (node.getChildByName("PlayerIcon")) {
            return false
        }
        return true
    }

    getUserInfo(): MemberInChairData {
        if (this.isChairEmputy()) {
            return null
        }
        return this.cc.find("Canvas/" + this.chairName).getChildByName("PlayerIcon").getComponent('PlayUserIcon').getMemberData()
    }

    public getChairPosition(): Coordinate {
        let url = "Canvas/" + this.chairName
        if (typeof (this.cc.find(url)) === 'undefined') {
            return null
        }
        return this.cc.find(url).getPosition()
    }

}

