import { roomGameConfig } from '../../common/RoomGameConfig';
class ConfigManage {
    private isBackMusic: boolean = true //背景音乐是否开启
    private isTxMusic: boolean = true //特效音乐是否开启

    public setBackMusic(isOpen: boolean) {
        this.isBackMusic = isOpen
    }

    public setTxMusic(isOpen: boolean) {
        this.isTxMusic = isOpen
    }

    public isBackMusicOpen() {
        return this.isBackMusic
    }

    public isTxMusicOpen() {
        return this.isTxMusic
    }

    //摇色子时间
    public getRollDiceTime(): number {
        return roomGameConfig.rollDiceTime
    }

    //发牌时间
    public getDealTime(): number {
        return roomGameConfig.dealTime
    }

    //下注时间
    public getBetTime(): number {
        return roomGameConfig.betTime
    }

    //开牌动画时间
    public getShowDownTime(): number {
        return roomGameConfig.showDownTime
    }

    //结果显示停留时间 s
    public showResultKeepTime(): number {
        return roomGameConfig.showResultKeepTime
    }

    //结果面板显示时间
    public getShowResultTime(): number {
        return roomGameConfig.showResultTime
    }
}

export default new ConfigManage