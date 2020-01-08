import { MemberInChairData, Coordinate } from "../../common/Const";

export default class ChairItem {
    private cc: any
    public memberInChairData: MemberInChairData = null
    public chairName: string //一个10个椅子 每个椅子的节点都有一个固定名称 依次 Member_0 到Member_9
    private playUserIcon: any = null  //图标预制件
    private playerIconNamePre = 'playerIcon_'
    constructor(ccOb: any, chairName: string, playUserIcon: any) {
        this.cc = ccOb
        this.chairName = chairName
        this.playUserIcon = playUserIcon

    }

    public inChairWithNode(memberInChairData: MemberInChairData, userIconNode: any) {
        //debugger
        let data = JSON.stringify(memberInChairData)
        this.memberInChairData = JSON.parse(data)
        let url = "Canvas/" + this.chairName
        let chairNode = this.cc.find(url)
        userIconNode.parent = chairNode
        userIconNode.setPosition(0, 0)
        //chairNode.getChildByName('Chair').active = false
        userIconNode.active = true
        chairNode.active = true
    }

    //winVal 当前用户前几场输赢值  xiaZhuVal 当前用户当前下注值
    public inChair(memberInChairData: MemberInChairData): boolean {
        if (!this.isChairEmputy()) {
            return false
        }
        let data = JSON.stringify(memberInChairData)
        this.memberInChairData = JSON.parse(data)
        let url = "Canvas/" + this.chairName
        let chairNode = this.cc.find(url)
        //chairNode.getChildByName('Chair').active = false
        let userIconNode = this.cc.instantiate(this.playUserIcon)
        userIconNode.name = this.playerIconNamePre + memberInChairData.userId
        userIconNode.setPosition(0, 0)
        userIconNode.parent = chairNode
        let jsOb = userIconNode.getComponent('PlayUserIcon')
        jsOb.setShow(memberInChairData.userIcon, memberInChairData.userName, memberInChairData.userId, 0, 0)
        userIconNode.active = true
        chairNode.active = true
        return true
    }

    public outChair(func: any) {
        let url = "Canvas/" + this.chairName
        let chairNode = this.cc.find(url)
        let name = this.playerIconNamePre + this.memberInChairData.userId
        chairNode.getChildByName(name).destroy()
        //chairNode.getChildByName('Chair').active = true
        this.memberInChairData = null
        func()
    }

    public isChairEmputy(): boolean {
        if (this.memberInChairData !== null) {
            return false
        }
        return true
    }

    getUserInfo() {
        // let url = "Canvas/" + this.chairName
        // let chairNode = this.cc.find(url)
        if (this.memberInChairData !== null) {
            let data = JSON.stringify(this.memberInChairData)
            return JSON.parse(data)
        }
        return null
    }

    public getChairPosition(): Coordinate {
        let url = "Canvas/" + this.chairName
        if (typeof (this.cc.find(url)) === 'undefined') {
            return null
        }
        let chairNode = this.cc.find(url)
        return chairNode.getPosition()
    }

}

