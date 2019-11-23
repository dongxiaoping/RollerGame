import ChairItem from "./ChairItem";
import { ChairState, MemberInChairData, Coordinate } from "../../common/Const";

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
}
