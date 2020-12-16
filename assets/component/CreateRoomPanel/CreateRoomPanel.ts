import {
    CreateRoomPayModel,
    ResponseStatus,
    RoomInfo,
    EnterRoomParam,
    EnterRoomModel,
    ResponseData,
    CreateRoomFail,
    TipDialogParam,
    TipDialogButtonAction,
    playMode
} from "../../common/Const";
import RoomManage from "../../store/Room/RoomManage";
import UserManage from "../../store/User/UserManage";
import ConfigManage from "../../store/Config/ConfigManage";
import log from 'loglevel'
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    createButton: cc.Button = null
    @property(cc.Button)
    cancelButton: cc.Button = null

    @property(cc.Sprite)
    closeButton: cc.Sprite = null;

    @property(cc.Node)
    renshu_part_one: cc.Node = null
    @property(cc.Node)
    renshu_part_two: cc.Node = null
    @property(cc.Node)
    renshu_part_three: cc.Node = null

    @property(cc.Node)
    daikai_part: cc.Node = null
    @property(cc.Node)
    aa_part: cc.Node = null

    @property(cc.Node)
    jushu_part_one: cc.Node = null
    @property(cc.Node)
    jushu_part_two: cc.Node = null
    @property(cc.Node)
    jushu_part_three: cc.Node = null
    @property(cc.Node)
    jushu_part_four: cc.Node = null

    @property(cc.Node)
    xiazhu_part_one: cc.Node = null
    @property(cc.Node)
    xiazhu_part_two: cc.Node = null
    @property(cc.Node)
    xiazhu_part_three: cc.Node = null
    @property(cc.Node)
    xiazhu_part_four: cc.Node = null

    //////////////////////房间人数
    @property(cc.Toggle)
    renshu_one: cc.Toggle = null
    @property(cc.Label)
    one_renshu_label: cc.Label = null
    @property(cc.Toggle)
    renshu_two: cc.Toggle = null
    @property(cc.Label)
    two_renshu_label: cc.Label = null
    @property(cc.Toggle)
    renshu_three: cc.Toggle = null
    @property(cc.Label)
    three_renshu_label: cc.Label = null
    ////////////////////////////////

    //////////////////////总共局数
    @property(cc.Toggle)
    jushu_one: cc.Toggle = null
    @property(cc.Toggle)
    jushu_two: cc.Toggle = null
    @property(cc.Toggle)
    jushu_three: cc.Toggle = null
    @property(cc.Toggle)
    jushu_four: cc.Toggle = null

    @property(cc.Label)
    one_jushu_label: cc.Label = null
    @property(cc.Label)
    two_jushu_label: cc.Label = null
    @property(cc.Label)
    three_jushu_label: cc.Label = null
    @property(cc.Label)
    four_jushu_label: cc.Label = null
    ////////////////////////////////

    //////////////////////扣钻模式
    @property(cc.Toggle)
    DaiKai: cc.Toggle = null
    @property(cc.Toggle)
    AA: cc.Toggle = null
    ////////////////////////////////

    //////////////////////抢庄模式
    @property(cc.Toggle)
    QiangzhuangTurn: cc.Toggle = null //轮庄
    @property(cc.Toggle)
    QiangzhuangRap: cc.Toggle = null//抢庄

    //////////////////////房间人数
    @property(cc.Toggle)
    xiazhu_one: cc.Toggle = null
    @property(cc.Toggle)
    xiazhu_two: cc.Toggle = null
    @property(cc.Toggle)
    xiazhu_three: cc.Toggle = null
    @property(cc.Toggle)
    xiazhu_four: cc.Toggle = null

    @property(cc.Label)
    one_xiazhu_label: cc.Label = null
    @property(cc.Label)
    two_xiazhu_label: cc.Label = null
    @property(cc.Label)
    three_xiazhu_label: cc.Label = null
    @property(cc.Label)
    four_xiazhu_label: cc.Label = null
    ////////////////////////////////

    @property(cc.Label)
    one_jushu_diamond_label: cc.Label = null
    @property(cc.Label)
    two_jushu_diamond_label: cc.Label = null
    @property(cc.Label)
    three_jushu_diamond_label: cc.Label = null
    @property(cc.Label)
    four_jushu_diamond_label: cc.Label = null
    /////////////////////////////////////

    @property(cc.Label)
    one_xiazhu_diamond_label: cc.Label = null
    @property(cc.Label)
    two_xiazhu_diamond_label: cc.Label = null
    @property(cc.Label)
    three_xiazhu_diamond_label: cc.Label = null
    @property(cc.Label)
    four_xiazhu_diamond_label: cc.Label = null
    /////////////////////////////////////

    creatDiamondConfig: any
    @property(cc.Prefab)
    private tipDialog: cc.Prefab = null  //提示框

    start() {
        this.renshu_one.isChecked = true
        this.jushu_one.isChecked = true
        this.DaiKai.isChecked = true
        this.xiazhu_one.isChecked = true
        this.QiangzhuangTurn.isChecked = true
    }

    setShow() {
        this.one_renshu_label.string = this.creatDiamondConfig.roomPeople.one.peoplecount + '人'
        this.two_renshu_label.string = this.creatDiamondConfig.roomPeople.two.peoplecount + '人'
        this.three_renshu_label.string = this.creatDiamondConfig.roomPeople.three.peoplecount + '人'

        this.one_jushu_label.string = this.creatDiamondConfig.totalRace.one.raceCount + '局'
        this.two_jushu_label.string = this.creatDiamondConfig.totalRace.two.raceCount + '局'
        this.three_jushu_label.string = this.creatDiamondConfig.totalRace.three.raceCount + '局'
        this.four_jushu_label.string = this.creatDiamondConfig.totalRace.four.raceCount + '局'

        this.one_xiazhu_label.string = this.creatDiamondConfig.betLimit.one.limitVal + ''
        this.two_xiazhu_label.string = this.creatDiamondConfig.betLimit.two.limitVal + ''
        this.three_xiazhu_label.string = this.creatDiamondConfig.betLimit.three.limitVal + ''
        this.four_xiazhu_label.string = this.creatDiamondConfig.betLimit.four.limitVal + ''
        this.setJuShuDiamondShow(CreateRoomPayModel.DAI_KAI)
        this.setXiaZhuDiamondShow(CreateRoomPayModel.DAI_KAI)
    }

    setJuShuDiamondShow(mode: CreateRoomPayModel) {
        if (mode == CreateRoomPayModel.AA) {
            this.one_jushu_diamond_label.string = this.creatDiamondConfig.totalRace.one.aaDiamond + ''
            this.two_jushu_diamond_label.string = this.creatDiamondConfig.totalRace.two.aaDiamond + ''
            this.three_jushu_diamond_label.string = this.creatDiamondConfig.totalRace.three.aaDiamond + ''
            this.four_jushu_diamond_label.string = this.creatDiamondConfig.totalRace.four.aaDiamond + ''
        } else {
            this.one_jushu_diamond_label.string = this.creatDiamondConfig.totalRace.one.daiKaiDiamond + ''
            this.two_jushu_diamond_label.string = this.creatDiamondConfig.totalRace.two.daiKaiDiamond + ''
            this.three_jushu_diamond_label.string = this.creatDiamondConfig.totalRace.three.daiKaiDiamond + ''
            this.four_jushu_diamond_label.string = this.creatDiamondConfig.totalRace.four.daiKaiDiamond + ''
        }
    }

    setXiaZhuDiamondShow(mode: CreateRoomPayModel) {
        if (mode == CreateRoomPayModel.AA) {
            this.one_xiazhu_diamond_label.string = this.creatDiamondConfig.betLimit.one.aaRate + '倍'
            this.two_xiazhu_diamond_label.string = this.creatDiamondConfig.betLimit.two.aaRate + '倍'
            this.three_xiazhu_diamond_label.string = this.creatDiamondConfig.betLimit.three.aaRate + '倍'
            this.four_xiazhu_diamond_label.string = this.creatDiamondConfig.betLimit.four.aaRate + '倍'
        } else {
            this.one_xiazhu_diamond_label.string = this.creatDiamondConfig.betLimit.one.daiKaiRate + '倍'
            this.two_xiazhu_diamond_label.string = this.creatDiamondConfig.betLimit.two.daiKaiRate + '倍'
            this.three_xiazhu_diamond_label.string = this.creatDiamondConfig.betLimit.three.daiKaiRate + '倍'
            this.four_xiazhu_diamond_label.string = this.creatDiamondConfig.betLimit.four.daiKaiRate + '倍'
        }
    }

    onEnable() {
        this.closeButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy()
        })
        this.creatDiamondConfig = ConfigManage.getCreateDiamondConfig()
        this.setShow()
        this.toggleInit()
        this.cancelButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy()
        })
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy()
        })
        this.createButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            //cc.log('创建按钮被点击')
            let renshu: number = null
            let jushu: number = null
            let payMode: CreateRoomPayModel = null
            let xiazhu: number = null
            let thePlayMode: number = null //选择模式

            if (this.renshu_one.isChecked) {
                renshu = this.creatDiamondConfig.roomPeople.one.peoplecount
            } else if (this.renshu_two.isChecked) {
                renshu = this.creatDiamondConfig.roomPeople.two.peoplecount
            } else if (this.renshu_three.isChecked) {
                renshu = this.creatDiamondConfig.roomPeople.three.peoplecount
            } else {
                renshu = null
                log.error('创建房间失败，人数不能为空')
                return
            }

            if (this.jushu_one.isChecked) {
                jushu = this.creatDiamondConfig.totalRace.one.raceCount
            } else if (this.jushu_two.isChecked) {
                jushu = this.creatDiamondConfig.totalRace.two.raceCount
            } else if (this.jushu_three.isChecked) {
                jushu = this.creatDiamondConfig.totalRace.three.raceCount
            }else if (this.jushu_four.isChecked) {
                jushu = this.creatDiamondConfig.totalRace.four.raceCount
            } else {
                jushu = null
                log.error('创建房间失败，局数不能为空')
                return
            }

            if(this.QiangzhuangTurn.isChecked){
                thePlayMode = playMode.TURN
            }else{
                thePlayMode = playMode.RAP
            }

            if (this.DaiKai.isChecked) {
                payMode = CreateRoomPayModel.DAI_KAI
                this.setJuShuDiamondShow(CreateRoomPayModel.DAI_KAI)
                this.setXiaZhuDiamondShow(CreateRoomPayModel.DAI_KAI)
            } else if (this.AA.isChecked) {
                payMode = CreateRoomPayModel.AA
                this.setJuShuDiamondShow(CreateRoomPayModel.AA)
                this.setXiaZhuDiamondShow(CreateRoomPayModel.AA)
            } else {
                payMode = null
                log.error('创建房间失败，付款模式不能为空')
                return
            }

            if (this.xiazhu_one.isChecked) {
                xiazhu = this.creatDiamondConfig.betLimit.one.limitVal
            } else if (this.xiazhu_two.isChecked) {
                xiazhu = this.creatDiamondConfig.betLimit.two.limitVal
            } else if (this.xiazhu_three.isChecked) {
                xiazhu = this.creatDiamondConfig.betLimit.three.limitVal
            } else if (this.xiazhu_four.isChecked) {
                xiazhu = this.creatDiamondConfig.betLimit.four.limitVal
            }else {
                xiazhu = null
                log.error('创建房间失败，下注上限不能为空')
                return
            }
            log.info('创建信息：人数：', renshu, ",局数：", jushu,
                ",付款模式:", payMode, ',下注上限：', xiazhu,',抢庄模式：', thePlayMode)
            //this.dealCreateRoom(UserManage.userInfo.id, 3, 5, payMode, xiazhu, thePlayMode)
            this.dealCreateRoom(UserManage.userInfo.id, renshu, jushu, payMode, xiazhu, thePlayMode)
        })
    }

    async dealCreateRoom(userId: string, renshu: number, jushu: number, payMode: CreateRoomPayModel,
                         xiazhu: number, thePlayMode:playMode) {
        let res = await RoomManage.createRoom(userId, renshu, jushu, payMode, xiazhu, thePlayMode)
        log.info('房间创建完毕信息：', res)
        if (res.result === ResponseStatus.SUCCESS) {
            let roomInfo = res.extObject as RoomInfo
            RoomManage.setRoomItem(roomInfo) //主要的设置roomId
            this.node.destroy()
            RoomManage.setEnterRoomParam({
                model: EnterRoomModel.CREATE_ROOM,
                userId: UserManage.userInfo.id,
                roomId: roomInfo.id
            } as EnterRoomParam)
            log.info('start_game_test:创建成功，跳转到房间页面，用户ID:', UserManage.userInfo.id ,',房间ID:' ,roomInfo.id)
            log.info('进入游戏房间')
            cc.director.loadScene("RollRoomScene");
            return
        }
        log.error('房间创建失败')
        this.showCreateRoomFailTip(res.extObject)
        this.node.destroy()
    }

    showCreateRoomFailTip(info: ResponseData) {
        let node = cc.instantiate(this.tipDialog)
        let scriptOb = node.getComponent('TipDialog')
        node.parent = this.node.parent
        node.active = true
        let contenShow = CreateRoomFail[info.message]
        if (info.message === 'diamond_not_enough') {
            //contenShow = '钻余额' + info.data.has + ',创建房间需要钻' + info.data.need + ',请点击确认购买！'
            contenShow = '钻余额不足，请点击购买！'
        }
        let dialogParam = {
            sureButtonShow: true, cancelButtonShow: true, content: contenShow,
            cancelButtonAction: null, sureButtonAction: TipDialogButtonAction.RECHARGE
        } as TipDialogParam
        scriptOb.tipDialogShow(dialogParam)
    }

    toggleInit() {

        //////////////////////////////////////////
        /////人数
        this.renshu_one.node.on('toggle', () => {
            if (this.renshu_one.isChecked) {
                this.renshu_two.isChecked = false
                this.renshu_three.isChecked = false
                //cc.log('renshu_one')
            }
        }, this);
        this.renshu_two.node.on('toggle', () => {
            if (this.renshu_two.isChecked) {
                this.renshu_one.isChecked = false
                this.renshu_three.isChecked = false
                //cc.log('renshu_two')
            }
        }, this);
        this.renshu_three.node.on('toggle', () => {
            if (this.renshu_three.isChecked) {
                this.renshu_one.isChecked = false
                this.renshu_two.isChecked = false
                //cc.log('renshu_three')
            }
        }, this);
        ////


        /////局数
        this.jushu_one.node.on('toggle', () => {
            if (this.jushu_one.isChecked) {
                this.jushu_two.isChecked = false
                this.jushu_three.isChecked = false
                this.jushu_four.isChecked = false
                //cc.log('renshu_one')
            }
        }, this);
        this.jushu_two.node.on('toggle', () => {
            if (this.jushu_two.isChecked) {
                this.jushu_one.isChecked = false
                this.jushu_three.isChecked = false
                this.jushu_four.isChecked = false
                //cc.log('renshu_two')
            }
        }, this);
        this.jushu_three.node.on('toggle', () => {
            if (this.jushu_three.isChecked) {
                this.jushu_one.isChecked = false
                this.jushu_two.isChecked = false
                this.jushu_four.isChecked = false
                //cc.log('renshu_three')
            }
        }, this);
        this.jushu_four.node.on('toggle', () => {
            if (this.jushu_four.isChecked) {
                this.jushu_one.isChecked = false
                this.jushu_two.isChecked = false
                this.jushu_three.isChecked = false
            }
        }, this);
        ////


        this.DaiKai.node.on('toggle', () => {
            if (this.DaiKai.isChecked) {
                this.AA.isChecked = false
                this.setJuShuDiamondShow(CreateRoomPayModel.DAI_KAI)
                this.setXiaZhuDiamondShow(CreateRoomPayModel.DAI_KAI)
                //cc.log('选择了代开')
            }
        }, this);
        this.AA.node.on('toggle', () => {
            if (this.AA.isChecked) {
                this.DaiKai.isChecked = false
                this.setJuShuDiamondShow(CreateRoomPayModel.AA)
                this.setXiaZhuDiamondShow(CreateRoomPayModel.AA)
                //cc.log('先择了AA')
            } else {

            }
        }, this);

        ////倍率
        this.xiazhu_one.node.on('toggle', () => {
            if (this.xiazhu_one.isChecked) {
                this.xiazhu_two.isChecked = false
                this.xiazhu_three.isChecked = false
                this.xiazhu_four.isChecked = false
                //cc.log('renshu_one')
            }
        }, this);
        this.xiazhu_two.node.on('toggle', () => {
            if (this.xiazhu_two.isChecked) {
                this.xiazhu_one.isChecked = false
                this.xiazhu_three.isChecked = false
                this.xiazhu_four.isChecked = false
                //cc.log('renshu_two')
            }
        }, this);
        this.xiazhu_three.node.on('toggle', () => {
            if (this.xiazhu_three.isChecked) {
                this.xiazhu_one.isChecked = false
                this.xiazhu_two.isChecked = false
                this.xiazhu_four.isChecked = false
                //cc.log('renshu_three')
            }
        }, this);
        this.xiazhu_four.node.on('toggle', () => {
            if (this.xiazhu_four.isChecked) {
                this.xiazhu_one.isChecked = false
                this.xiazhu_two.isChecked = false
                this.xiazhu_three.isChecked = false
                //cc.log('renshu_three')
            }
        }, this);
        ////



        ////////////////////////
        /////人数
        this.renshu_part_one.on(cc.Node.EventType.TOUCH_END, () => {
            this.renshu_one.isChecked = true
            this.renshu_two.isChecked = false
            this.renshu_three.isChecked = false
        }, this);

        this.renshu_part_two.on(cc.Node.EventType.TOUCH_END, () => {
            this.renshu_two.isChecked = true
            this.renshu_one.isChecked = false
            this.renshu_three.isChecked = false
        }, this);
        this.renshu_part_three.on(cc.Node.EventType.TOUCH_END, () => {
            this.renshu_three.isChecked = true
            this.renshu_one.isChecked = false
            this.renshu_two.isChecked = false
        }, this);
        ////


        /////局数
        this.jushu_part_one.on(cc.Node.EventType.TOUCH_END, () => {
            this.jushu_one.isChecked = true
            this.jushu_two.isChecked = false
            this.jushu_three.isChecked = false
            this.jushu_four.isChecked = false
        }, this);
        this.jushu_part_two.on(cc.Node.EventType.TOUCH_END, () => {
            this.jushu_two.isChecked = true
            this.jushu_one.isChecked = false
            this.jushu_three.isChecked = false
            this.jushu_four.isChecked = false
        }, this);
        this.jushu_part_three.on(cc.Node.EventType.TOUCH_END, () => {
            this.jushu_three.isChecked = true
            this.jushu_one.isChecked = false
            this.jushu_two.isChecked = false
            this.jushu_four.isChecked = false
        }, this);
        this.jushu_part_four.on(cc.Node.EventType.TOUCH_END, () => {
            this.jushu_four.isChecked = true
            this.jushu_one.isChecked = false
            this.jushu_two.isChecked = false
            this.jushu_three.isChecked = false
        }, this);
        ////


        this.daikai_part.on(cc.Node.EventType.TOUCH_END, () => {
            this.DaiKai.isChecked = true
            this.AA.isChecked = false
            this.setJuShuDiamondShow(CreateRoomPayModel.DAI_KAI)
            this.setXiaZhuDiamondShow(CreateRoomPayModel.DAI_KAI)
        }, this);
        this.aa_part.on(cc.Node.EventType.TOUCH_END, () => {
            this.AA.isChecked = true
            this.DaiKai.isChecked = false
            this.setJuShuDiamondShow(CreateRoomPayModel.AA)
            this.setXiaZhuDiamondShow(CreateRoomPayModel.AA)
        }, this);

        ////倍率
        this.xiazhu_part_one.on(cc.Node.EventType.TOUCH_END, () => {
            this.xiazhu_one.isChecked = true
            this.xiazhu_two.isChecked = false
            this.xiazhu_three.isChecked = false
            this.xiazhu_four.isChecked = false
        }, this);
        this.xiazhu_part_two.on(cc.Node.EventType.TOUCH_END, () => {
            this.xiazhu_two.isChecked = true
            this.xiazhu_one.isChecked = false
            this.xiazhu_three.isChecked = false
            this.xiazhu_four.isChecked = false
        }, this);
        this.xiazhu_part_three.on(cc.Node.EventType.TOUCH_END, () => {
            this.xiazhu_three.isChecked = true
            this.xiazhu_one.isChecked = false
            this.xiazhu_two.isChecked = false
            this.xiazhu_four.isChecked = false
        }, this);
        this.xiazhu_part_four.on(cc.Node.EventType.TOUCH_END, () => {
            this.xiazhu_four.isChecked = true
            this.xiazhu_one.isChecked = false
            this.xiazhu_two.isChecked = false
            this.xiazhu_three.isChecked = false
        }, this);
        ////

    }
}
