import { PromiseParam, InterfaceUrl, ResponseStatus } from '../../common/Const';
import { config } from '../../common/Config';
import UserManage from '../User/UserManage';
import axios from 'axios'
class ConfigManage {
    private isBackMusic: boolean = true //背景音乐是否开启
    private isTxMusic: boolean = true //特效音乐是否开启
    private configHasLoad: boolean = false //网络配置文件是否加载
    private createDiamondConfig: any = null //创建房间的相关数据信息
    private chipValList: any = []
    private userIconUrl: string = '' //用户Icon地址前缀
    private audioUrl: string = '' //音频文件地址
    private rapLandlordTime: number
    private gameUrl: string = '' //游戏地址
    private informMessage: string = "滚筒子诚招代理，代理请于客服联系！文明游戏，禁止赌博，一旦发现利用平台从事赌博活动一律封号处理！"
    private customerWechat: string = 'xxxx'
    private rollDiceTime: number = 4
    private betTime: number = 13
    private showDownTime: number = 7
    private showResultKeepTime: number = 4
    private showResultTime: number = 4
    private dealTime: number = 3
    private beginTextShowTime: number = 1.5
    private timeBeforeBeginText: number = 0.5

    constructor() {
        let isTxMusic = window.localStorage.getItem("isTxMusic")
        if (isTxMusic == null) {
            this.isTxMusic = true
        } else {
            this.isTxMusic = parseInt(isTxMusic) ? true : false
        }

        let isBackMusic = window.localStorage.getItem("isBackMusic")
        if (isBackMusic == null) {
            this.isBackMusic = true
        } else {
            this.isBackMusic = parseInt(isBackMusic) ? true : false
        }
    }

    public setBackMusic(isOpen: boolean) {
        this.isBackMusic = isOpen
        let flag = isOpen ? 1 : 0
        window.localStorage.setItem("isBackMusic", flag.toString())
    }

    public setTxMusic(isOpen: boolean) {
        this.isTxMusic = isOpen
        let flag = isOpen ? 1 : 0
        window.localStorage.setItem("isTxMusic", flag.toString())
    }

    public isTxMusicOpen() {
        return this.isTxMusic
    }

    public isBackMusicOpen() {
        return this.isBackMusic
    }

    public getUserIconUrl() {
        return this.userIconUrl
    }

    public setUserIconUrl(url: string) {
        this.userIconUrl = url
    }

    public getAudioUrl() {
        return this.audioUrl
    }

    public getTimeBeforeBeginText() {
        return this.timeBeforeBeginText
    }


    public setAudioUrl(url: string) {
        this.audioUrl = url
    }

    public setRapLandlordTime(val:number){
        this.rapLandlordTime = val;
    }

    public getRapLandlordTime() {
        return this.rapLandlordTime
    }

    public isConfigHasLoad(): boolean {
        return this.configHasLoad
    }

    public getCreateDiamondConfig() {
        return this.createDiamondConfig
    }

    public getBeginTextShowTime() {
        return this.beginTextShowTime
    }

    //摇色子时间
    public getRollDiceTime(): number {
        return this.rollDiceTime
    }

    //发牌时间
    public getDealTime(): number {
        return this.dealTime
    }

    //下注时间
    public getBetTime(): number {
        return this.betTime
    }

    //开牌动画时间
    public getShowDownTime(): number {
        return this.showDownTime
    }

    //结果显示停留时间 s
    public getShowResultKeepTime(): number {
        return this.showResultKeepTime
    }

    //结果面板显示时间
    public getShowResultTime(): number {
        return this.showResultTime
    }

    public loadConfigInfo(): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            let httpUrl = config.serverAddress + InterfaceUrl.GET_CONFIG
            axios
                .get(httpUrl)
                .then((response: any): void => {
                    let info = response.data
                    this.createDiamondConfig = info.data.createDiamond
                    this.setChipValList(info.data.roomGame.chipValList)
                    UserManage.setSelectChipValue(info.data.roomGame.chipValList[0])
                    this.configHasLoad = true
                    resolve({ result: ResponseStatus.SUCCESS, extObject: ""})
                }).catch(function (e) {
                    resolve({ result: ResponseStatus.FAIL, extObject: { status: 0, message: 'net_error', data: '' } })
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
        return this.customerWechat
    }

    //公告信息
    public getInformMessage() {
        return this.informMessage
    }

    public setGameUrl(url: string) {
        this.gameUrl = url
    }

    public getGameUrl() {
        return this.gameUrl
    }

    //分享游戏页面地址
    public getSharePageAddr() {
        return "https://www.toplaygame.cn/login/copySharePage"
      // return "localhost/login/copySharePage"
    }

    //分享战绩页面地址
    public getZhanjiPageAddr() {
       // return "http://localhost/login/copyZhanjiPage/"
        return "https://www.toplaygame.cn/login/copyZhanjiPage"
    }
}

export default new ConfigManage