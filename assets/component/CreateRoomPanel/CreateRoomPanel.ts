import { CreateRoomPayModel, ResponseStatus, RoomInfo, EnterRoomParam, EnterRoomModel, ResponseData, CreateRoomFail, TipDialogParam, TipDialogButtonAction } from "../../common/Const";
import RoomManage from "../../store/Room/RoomManage";
import UserManage from "../../store/User/UserManage";
import { creatDiamondConfig } from "../../common/CreatDiamondConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    createButton: cc.Sprite = null
    @property(cc.Sprite)
    cancelButton: cc.Sprite = null

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

    @property(cc.Label)
    one_jushu_label: cc.Label = null
    @property(cc.Label)
    two_jushu_label: cc.Label = null
    @property(cc.Label)
    three_jushu_label: cc.Label = null
    ////////////////////////////////

    //////////////////////扣钻模式
    @property(cc.Toggle)
    DaiKai: cc.Toggle = null
    @property(cc.Toggle)
    AA: cc.Toggle = null
    ////////////////////////////////

    //////////////////////房间人数
    @property(cc.Toggle)
    xiazhu_one: cc.Toggle = null
    @property(cc.Toggle)
    xiazhu_two: cc.Toggle = null
    @property(cc.Toggle)
    xiazhu_three: cc.Toggle = null

    @property(cc.Label)
    one_xiazhu_label: cc.Label = null
    @property(cc.Label)
    two_xiazhu_label: cc.Label = null
    @property(cc.Label)
    three_xiazhu_label: cc.Label = null
    ////////////////////////////////

    @property(cc.Label)
    one_jushu_diamond_label: cc.Label = null
    @property(cc.Label)
    two_jushu_diamond_label: cc.Label = null
    @property(cc.Label)
    three_jushu_diamond_label: cc.Label = null
    /////////////////////////////////////

    @property(cc.Label)
    one_xiazhu_diamond_label: cc.Label = null
    @property(cc.Label)
    two_xiazhu_diamond_label: cc.Label = null
    @property(cc.Label)
    three_xiazhu_diamond_label: cc.Label = null
    /////////////////////////////////////

    @property(cc.Prefab)
    private tipDialog: cc.Prefab = null  //提示框

    start() {
        this.renshu_one.isChecked = true
        this.jushu_one.isChecked = true
        this.DaiKai.isChecked = true
        this.xiazhu_one.isChecked = true
    }

    setShow() {
        this.one_renshu_label.string = creatDiamondConfig.roomPeople.one.peoplecount + '人'
        this.two_renshu_label.string = creatDiamondConfig.roomPeople.two.peoplecount + '人'
        this.three_renshu_label.string = creatDiamondConfig.roomPeople.three.peoplecount + '人'

        this.one_jushu_label.string = creatDiamondConfig.totalRace.one.raceCount + '局'
        this.two_jushu_label.string = creatDiamondConfig.totalRace.two.raceCount + '局'
        this.three_jushu_label.string = creatDiamondConfig.totalRace.three.raceCount + '局'

        this.one_xiazhu_label.string = creatDiamondConfig.betLimit.one.limitVal + ''
        this.two_xiazhu_label.string = creatDiamondConfig.betLimit.two.limitVal + ''
        this.three_xiazhu_label.string = creatDiamondConfig.betLimit.three.limitVal + ''
        // this.setJuShuDiamondShow(CreateRoomPayModel.DAI_KAI)
        // this.setXiaZhuDiamondShow(CreateRoomPayModel.DAI_KAI)
    }

    setJuShuDiamondShow(mode: CreateRoomPayModel) {
        if (mode == CreateRoomPayModel.AA) {
            this.one_jushu_diamond_label.string = creatDiamondConfig.totalRace.one.aaDiamond + ''
            this.two_jushu_diamond_label.string = creatDiamondConfig.totalRace.two.aaDiamond + ''
            this.three_jushu_diamond_label.string = creatDiamondConfig.totalRace.three.aaDiamond + ''
        } else {
            this.one_jushu_diamond_label.string = creatDiamondConfig.totalRace.one.daiKaiDiamond + ''
            this.two_jushu_diamond_label.string = creatDiamondConfig.totalRace.two.daiKaiDiamond + ''
            this.three_jushu_diamond_label.string = creatDiamondConfig.totalRace.three.daiKaiDiamond + ''
        }
    }

    setXiaZhuDiamondShow(mode: CreateRoomPayModel) {
        if (mode == CreateRoomPayModel.AA) {
            this.one_xiazhu_diamond_label.string = creatDiamondConfig.betLimit.one.aaRate + '倍'
            this.two_xiazhu_diamond_label.string = creatDiamondConfig.betLimit.two.aaRate + '倍'
            this.three_xiazhu_diamond_label.string = creatDiamondConfig.betLimit.three.aaRate + '倍'
        } else {
            this.one_xiazhu_diamond_label.string = creatDiamondConfig.betLimit.one.daiKaiRate + '倍'
            this.two_xiazhu_diamond_label.string = creatDiamondConfig.betLimit.two.daiKaiRate + '倍'
            this.three_xiazhu_diamond_label.string = creatDiamondConfig.betLimit.three.daiKaiRate + '倍'
        }
    }

    onEnable() {
        this.setShow()
        this.toggleInit()
        this.cancelButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy()
        })
        this.createButton.node.on(cc.Node.EventType.TOUCH_END, () => {
            cc.log('创建按钮被点击')
            let renshu: number = null
            let jushu: number = null
            let payMode: CreateRoomPayModel = null
            let xiazhu: number = null
            if (this.renshu_one.isChecked) {
                renshu = 6
            } else if (this.renshu_two.isChecked) {
                renshu = 8
            } else if (this.renshu_three.isChecked) {
                renshu = 10
            } else {
                renshu = null
                cc.log('人数不能为空')
                return
            }

            if (this.jushu_one.isChecked) {
                jushu = creatDiamondConfig.totalRace.one.raceCount
            } else if (this.jushu_two.isChecked) {
                jushu = creatDiamondConfig.totalRace.two.raceCount
            } else if (this.jushu_three.isChecked) {
                jushu = creatDiamondConfig.totalRace.three.raceCount
            } else {
                jushu = null
                cc.log('局数不能为空')
                return
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
                cc.log('付款模式不能为空')
                return
            }

            if (this.xiazhu_one.isChecked) {
                xiazhu = creatDiamondConfig.betLimit.one.limitVal
            } else if (this.xiazhu_two.isChecked) {
                xiazhu = creatDiamondConfig.betLimit.two.limitVal
            } else if (this.xiazhu_three.isChecked) {
                xiazhu = creatDiamondConfig.betLimit.three.limitVal
            } else {
                xiazhu = null
                cc.log('下注上限不能为空')
                return
            }
            cc.log('创建信息：人数：' + renshu + ",局数：" + jushu + ",付款模式:" + payMode + ',下注上限：' + xiazhu)
            cc.log('start_game_test:面板创建游戏')
            this.dealCreateRoom(UserManage.userInfo.id, renshu, jushu, payMode, xiazhu)
        })
    }

    async dealCreateRoom(userId: string, renshu: number, jushu: number, payMode: CreateRoomPayModel, xiazhu: number) {
        let res = await RoomManage.createRoom(userId, renshu, jushu, payMode, xiazhu)
        cc.log('房间创建完毕信息：' + JSON.stringify(res))
        if (res.result === ResponseStatus.SUCCESS) {
            let roomInfo = res.extObject as RoomInfo
            RoomManage.setRoomItem(roomInfo) //主要的设置roomId
            this.node.destroy()
            RoomManage.setEnterRoomParam({
                model: EnterRoomModel.CREATE_ROOM,
                userId: UserManage.userInfo.id,
                roomId: roomInfo.id
            } as EnterRoomParam)
            cc.log('start_game_test:创建成功，跳转到房间页面，用户ID:' + UserManage.userInfo.id + ',房间ID:' + roomInfo.id)
            cc.director.loadScene("RollRoomScene");
            cc.log('进入游戏房间')
            return
        }
        cc.log('房间创建失败')
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
            contenShow = '钻余额' + info.data.has + ',创建房间需要钻' + info.data.need + ',请点击确认购买！'
        }
        let dialogParam = {
            sureButtonShow: true, cancelButtonShow: true, content: contenShow,
            cancelButtonAction: null, sureButtonAction: TipDialogButtonAction.RECHARGE
        } as TipDialogParam
        scriptOb.tipDialogShow(dialogParam)
    }

    toggleInit() {
        /////人数
        this.renshu_one.node.on('toggle', () => {
            if (this.renshu_one.isChecked) {
                this.renshu_two.isChecked = false
                this.renshu_three.isChecked = false
                cc.log('renshu_one')
            }
        }, this);
        this.renshu_two.node.on('toggle', () => {
            if (this.renshu_two.isChecked) {
                this.renshu_one.isChecked = false
                this.renshu_three.isChecked = false
                cc.log('renshu_two')
            }
        }, this);
        this.renshu_three.node.on('toggle', () => {
            if (this.renshu_three.isChecked) {
                this.renshu_one.isChecked = false
                this.renshu_two.isChecked = false
                cc.log('renshu_three')
            }
        }, this);
        ////


        /////局数
        this.jushu_one.node.on('toggle', () => {
            if (this.jushu_one.isChecked) {
                this.jushu_two.isChecked = false
                this.jushu_three.isChecked = false
                cc.log('renshu_one')
            }
        }, this);
        this.jushu_two.node.on('toggle', () => {
            if (this.jushu_two.isChecked) {
                this.jushu_one.isChecked = false
                this.jushu_three.isChecked = false
                cc.log('renshu_two')
            }
        }, this);
        this.jushu_three.node.on('toggle', () => {
            if (this.jushu_three.isChecked) {
                this.jushu_one.isChecked = false
                this.jushu_two.isChecked = false
                cc.log('renshu_three')
            }
        }, this);
        ////


        this.DaiKai.node.on('toggle', () => {
            if (this.DaiKai.isChecked) {
                this.AA.isChecked = false
                this.setJuShuDiamondShow(CreateRoomPayModel.DAI_KAI)
                this.setXiaZhuDiamondShow(CreateRoomPayModel.DAI_KAI)
                cc.log('选择了代开')
            }
        }, this);
        this.AA.node.on('toggle', () => {
            if (this.AA.isChecked) {
                this.DaiKai.isChecked = false
                this.setJuShuDiamondShow(CreateRoomPayModel.AA)
                this.setXiaZhuDiamondShow(CreateRoomPayModel.AA)
                cc.log('先择了AA')
            } else {

            }
        }, this);

        ////倍率
        this.xiazhu_one.node.on('toggle', () => {
            if (this.xiazhu_one.isChecked) {
                this.xiazhu_two.isChecked = false
                this.xiazhu_three.isChecked = false
                cc.log('renshu_one')
            }
        }, this);
        this.xiazhu_two.node.on('toggle', () => {
            if (this.xiazhu_two.isChecked) {
                this.xiazhu_one.isChecked = false
                this.xiazhu_three.isChecked = false
                cc.log('renshu_two')
            }
        }, this);
        this.xiazhu_three.node.on('toggle', () => {
            if (this.xiazhu_three.isChecked) {
                this.xiazhu_one.isChecked = false
                this.xiazhu_two.isChecked = false
                cc.log('renshu_three')
            }
        }, this);
        ////

    }
}
