import { ChairState, MemberInChairData, Coordinate } from "../../common/Const";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ChairItem {
    private cc: any
    public memberInChairData: MemberInChairData = null
    private chairName: string //一个10个椅子 每个椅子的节点都有一个固定名称 依次 Member_0 到Member_9
    private playUserIcon: any = null  //图标预制件
    private playerIconNamePre = 'playerIcon_'
    constructor(cc: any, chairName: string, playUserIcon: any) {
        this.cc = cc
        this.chairName = chairName
        this.playUserIcon = playUserIcon

    }

    public inChair(memberInChairData: MemberInChairData): boolean {
        if (!this.isChairEmputy()) {
            return false
        }
        this.memberInChairData = memberInChairData
        let url = "Canvas/" + this.chairName
        let chairNode = cc.find(url)
        let userIconNode = cc.instantiate(this.playUserIcon)
        userIconNode.name = this.playerIconNamePre + memberInChairData.userId
        userIconNode.setPosition(0, 0)
        userIconNode.parent = chairNode
        userIconNode.active = true
        let jsOb = userIconNode.getComponent('PlayUserIcon')
        jsOb.setShow(memberInChairData.userIcon, memberInChairData.userName)
        return true
    }

    public outChair() {
        let url = "Canvas/" + this.chairName
        let chairNode = cc.find(url)
        chairNode.removeAllChildren()
        this.memberInChairData = null
    }

    public isChairEmputy(): boolean {
        if (this.memberInChairData !== null) {
            return false
        }
        return true
    }

    public getChairPosition(): Coordinate {
        let url = "Canvas/" + this.chairName
        let chairNode = cc.find(url)
        return chairNode.getPosition()
    }

}

