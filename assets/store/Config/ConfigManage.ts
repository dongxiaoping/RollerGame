import { roomGameConfig } from '../../common/RoomGameConfig';
import { PromiseParam, InterfaceUrl, ResponseStatus } from '../../common/Const';
import { config } from '../../common/Config';
import http from '../../common/Http'
import UserManage from '../User/UserManage';
class ConfigManage {
    private isBackMusic: boolean = true //背景音乐是否开启
    private isTxMusic: boolean = true //特效音乐是否开启
    private configHasLoad: boolean = false //网络配置文件是否加载
    private createDiamondConfig: any = null //创建房间的相关数据信息
    private chipValList: any = []
    private userIconUrl: string = '' //用户Icon地址前缀
    public setBackMusic(isOpen: boolean) {
        this.isBackMusic = isOpen
    }

    public getUserIconUrl() {
        return this.userIconUrl
    }

    public setUserIconUrl(url: string) {
        this.userIconUrl = url
    }

    public isConfigHasLoad(): boolean {
        return this.configHasLoad
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

    public getCreateDiamondConfig() {
        return this.createDiamondConfig
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

    public loadConfigInfo(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            let httpUrl = config.serverAddress + InterfaceUrl.GET_CONFIG
            http.getWithUrl(httpUrl, (error: boolean, info: any) => {
                if (!error && info.status != ResponseStatus.FAIL) {
                    this.createDiamondConfig = info.data.createDiamond
                    this.setChipValList(info.data.roomGame.chipValList)
                    UserManage.setSelectChipValue(info.data.roomGame.chipValList[0])
                    this.configHasLoad = true
                }
            })
        })
    }

    public getChipValList() {
        return this.chipValList
    }
    public setChipValList(valList: any) {
        this.chipValList = valList
    }

    //获取客服微信号
    public getCustomerWechatNum() {
        return roomGameConfig.customerWechat
    }

    //公告信息
    public getInformMessage() {
        return roomGameConfig.informMessage
    }
}

export default new ConfigManage