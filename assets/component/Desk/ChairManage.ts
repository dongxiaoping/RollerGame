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
            if (!this.chairList[i].isChairEmputy() && this.chairList[i].memberInChairData.userId === userId) {
                return this.chairList[i].getChairPosition()
            }
        }
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
                this.chairList[i].outChair()
            }
        }
    }

    public moveToLandlordChair(userId: string) {
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
        let memberInfo1 = theUserChair.getUserInfo()
        if (landChair.isChairEmputy()) {
            theUserChair.outChair()
            landChair.inChair(memberInfo1)
        } else {
            let oldLandChairUserInfo = landChair.getUserInfo()
            landChair.outChair()
            theUserChair.outChair()
            theUserChair.inChair(oldLandChairUserInfo)
            landChair.inChair(memberInfo1)
        }
    }

    public getChairByUserId(userId: string): ChairItem {
        for (let i = 0; i < this.chairList.length; i++) {
            if ((!this.chairList[i].isChairEmputy()) && this.chairList[i].memberInChairData.userId === userId) {
                return this.chairList[i]
            }
        }
        return null
    }
}
