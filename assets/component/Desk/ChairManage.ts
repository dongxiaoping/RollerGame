import ChairItem from "./ChairItem";
import { MemberInChairData, Coordinate } from "../../common/Const";

export default class ChairManage {
    private cc: any;
    public chairList: ChairItem[] = []
    private playUserIcon: any = null
    constructor(cc: any, playUserIcon: any) {
        this.cc = cc
        this.playUserIcon = playUserIcon
        this.init()
    }

    private init() {
        for (let i = 0; i < 10; i++) {
            let chairName = 'Member_' + i
            let item = new ChairItem(this.cc, chairName, this.playUserIcon)
            this.chairList.push(item)
        }
    }

    public getChairPositionByUserId(userId: string): Coordinate {
        for (let i = 0; i < this.chairList.length; i++) {
            if (!this.chairList[i].isChairEmputy()) {
                let userInfo = this.chairList[i].getUserInfo()
                if (userInfo.userId === userId) {
                    return this.chairList[i].getChairPosition()
                }
            }
        }
        console.log('错误，未找到用户椅子位置')
        return null
    }

    public inChair(memberInChairData: MemberInChairData): boolean {
        let emputyChair = this.getOneEmputyChair()
        if (emputyChair) {
            emputyChair.inChair(memberInChairData)
            return true
        }
        return false
    }

    public outChair(userId: string) {
        for (let i = 0; i < this.chairList.length; i++) {
            if (this.chairList[i].getUserInfo().userId === userId) {
                this.chairList[i].outChair(() => { })
                break
            }
        }
    }

    public getOneEmputyChair() {
        for (let i = 0; i < this.chairList.length; i++) {
            if (this.chairList[i].isChairEmputy()) {
                return this.chairList[i]
            }
        }
        return false
    }

    public inCharByList(memberList: MemberInChairData[]) {
        for (let i = 0; i < memberList.length; i++) {
            let isSuccess = this.inChair(memberList[i])
            if (!isSuccess) {
                return false
            }
        }
        return true
    }

    public clearAllChair() {
        for (let i = 0; i < this.chairList.length; i++) {
            if (!this.chairList[i].isChairEmputy()) {
                this.chairList[i].outChair(() => { })
            }
        }
    }

    public moveToLandlordChair(userId: string) {
        if (userId == null || userId == '') {
            return
        }
        let theUserChair = this.getChairByUserId(userId)
        if (theUserChair === null) {
            console.log('改成员不在座椅上，无法挪动到地主位置')
            return

        }
        if (theUserChair.chairName === 'Member_0') {
            console.log('改成员已经在地主位置上')
            return
        }
        let landChair = this.chairList[0]
        let newLanlordUserInfo = theUserChair.getUserInfo()
        if (landChair.isChairEmputy()) {
            theUserChair.outChair(() => {
                this.userIconMoveAnimation(newLanlordUserInfo, theUserChair.getChairPosition(), landChair.getChairPosition(), (userIconNode: cc.Node) => {
                    landChair.inChairWithNode(userIconNode)
                })
            })
        } else {
            let oldLandChairUserInfo = landChair.getUserInfo()
            landChair.outChair(() => {
                this.userIconMoveAnimation(oldLandChairUserInfo, landChair.getChairPosition(), theUserChair.getChairPosition(), (userIconNode: cc.Node) => {
                    theUserChair.inChairWithNode(userIconNode)
                })
            })
            theUserChair.outChair(() => {
                this.userIconMoveAnimation(newLanlordUserInfo, theUserChair.getChairPosition(), landChair.getChairPosition(), (userIconNode: cc.Node) => {
                    landChair.inChairWithNode(userIconNode)
                })
            })
        }
    }

    //换椅子动画，用户图标移动动画
    public userIconMoveAnimation(userInfo: MemberInChairData, fromLocation: Coordinate, toLocation: Coordinate, callback: any) {
        let userIconNode = this.cc.instantiate(this.playUserIcon)
        let jsOb = userIconNode.getComponent('PlayUserIcon')
        jsOb.setShow(userInfo)
        let url = "Canvas/Desk"
        let parentNode = this.cc.find(url)
        userIconNode.parent = parentNode
        userIconNode.name = 'user_'+userInfo.userId
        userIconNode.setPosition(fromLocation.x, fromLocation.y)
        let action = this.cc.moveTo(1, toLocation.x, toLocation.y)
        let b = cc.sequence(action, this.cc.callFunc(() => {
            callback(userIconNode)
        }, this))
        userIconNode.runAction(b)
    }

    //通过用户ID获取对应的椅子信息，如果没有返回null
    public getChairByUserId(userId: string): ChairItem {
        let i = 0
        for (; i < this.chairList.length; i++) {
            if (this.chairList[i].getUserInfo() != null && this.chairList[i].getUserInfo().userId === userId) {
                return this.chairList[i]
            }
        }
        return null
    }
}
