import { CreateRoomPayModel, ResponseStatus, RoomInfo } from "../../common/Const";
import RoomManage from "../../store/Room/RoomManage";
import UserManage from "../../store/User/UserManage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    createButton: cc.Sprite = null
    @property(cc.Sprite)
    cancelButton: cc.Sprite = null

    //////////////////////房间人数
    @property(cc.Toggle)
    renshu_6: cc.Toggle = null
    @property(cc.Toggle)
    renshu_8: cc.Toggle = null
    @property(cc.Toggle)
    renshu_10: cc.Toggle = null
    ////////////////////////////////

    //////////////////////总共局数
    @property(cc.Toggle)
    jushu_15: cc.Toggle = null
    @property(cc.Toggle)
    jushu_20: cc.Toggle = null
    @property(cc.Toggle)
    jushu_25: cc.Toggle = null
    ////////////////////////////////

    //////////////////////扣钻模式
    @property(cc.Toggle)
    DaiKai: cc.Toggle = null
    @property(cc.Toggle)
    AA: cc.Toggle = null
    ////////////////////////////////

    //////////////////////房间人数
    @property(cc.Toggle)
    xiazhu_200: cc.Toggle = null
    @property(cc.Toggle)
    xiazhu_300: cc.Toggle = null
    @property(cc.Toggle)
    xiazhu_500: cc.Toggle = null
    ////////////////////////////////

    start() {
        this.renshu_6.isChecked = true
        this.jushu_15.isChecked = true
        this.DaiKai.isChecked = true
        this.xiazhu_200.isChecked = true
    }

    onEnable() {
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
            if (this.renshu_6.isChecked) {
                renshu = 6
            } else if (this.renshu_8.isChecked) {
                renshu = 8
            } else if (this.renshu_10.isChecked) {
                renshu = 10
            } else {
                renshu = null
                cc.log('人数不能为空')
                return
            }

            if (this.jushu_15.isChecked) {
                jushu = 15
            } else if (this.jushu_20.isChecked) {
                jushu = 20
            } else if (this.jushu_25.isChecked) {
                jushu = 25
            } else {
                jushu = null
                cc.log('局数不能为空')
                return
            }

            if (this.DaiKai.isChecked) {
                payMode = CreateRoomPayModel.DAI_KAI
            } else if (this.AA.isChecked) {
                payMode = CreateRoomPayModel.AA
            } else {
                payMode = null
                cc.log('付款模式不能为空')
                return
            }

            if (this.xiazhu_200.isChecked) {
                xiazhu = 200
            } else if (this.xiazhu_300.isChecked) {
                xiazhu = 300
            } else if (this.xiazhu_500.isChecked) {
                xiazhu = 500
            } else {
                xiazhu = null
                cc.log('下注上限不能为空')
                return
            }
            cc.log('创建信息：人数：' + renshu + ",局数：" + jushu + ",付款模式:" + payMode + ',下注上限：' + xiazhu)
            this.dealCreateRoom(UserManage.userInfo.id, renshu, jushu, payMode, xiazhu)
        })
    }

    async dealCreateRoom(userId: string, renshu: number, jushu: number, payMode: CreateRoomPayModel, xiazhu: number) {
        let res = await RoomManage.createRoom(userId, renshu, jushu, payMode, xiazhu)
        if (res.result === ResponseStatus.SUCCESS) {
            let roomInfo = res.extObject as RoomInfo
            RoomManage.setRoomItem(roomInfo)
            this.node.destroy()
            cc.director.loadScene("RollRoomScene");
            cc.log('房间创建成功,房间信息：' + JSON.stringify(roomInfo))
            cc.log('进入游戏房间')
        } else {
            cc.log('房间创建失败')
        }
    }


    toggleInit() {
        /////人数
        this.renshu_6.node.on('toggle', () => {
            if (this.renshu_6.isChecked) {
                this.renshu_8.isChecked = false
                this.renshu_10.isChecked = false
                cc.log('renshu_6')
            }
        }, this);
        this.renshu_8.node.on('toggle', () => {
            if (this.renshu_8.isChecked) {
                this.renshu_6.isChecked = false
                this.renshu_10.isChecked = false
                cc.log('renshu_8')
            }
        }, this);
        this.renshu_10.node.on('toggle', () => {
            if (this.renshu_10.isChecked) {
                this.renshu_6.isChecked = false
                this.renshu_8.isChecked = false
                cc.log('renshu_10')
            }
        }, this);
        ////


        /////局数
        this.jushu_15.node.on('toggle', () => {
            if (this.jushu_15.isChecked) {
                this.jushu_20.isChecked = false
                this.jushu_25.isChecked = false
                cc.log('renshu_6')
            }
        }, this);
        this.jushu_20.node.on('toggle', () => {
            if (this.jushu_20.isChecked) {
                this.jushu_15.isChecked = false
                this.jushu_25.isChecked = false
                cc.log('renshu_8')
            }
        }, this);
        this.jushu_25.node.on('toggle', () => {
            if (this.jushu_25.isChecked) {
                this.jushu_15.isChecked = false
                this.jushu_20.isChecked = false
                cc.log('renshu_10')
            }
        }, this);
        ////


        this.DaiKai.node.on('toggle', () => {
            if (this.DaiKai.isChecked) {
                this.AA.isChecked = false
                cc.log('选择了代开')
            }
        }, this);
        this.AA.node.on('toggle', () => {
            if (this.AA.isChecked) {
                this.DaiKai.isChecked = false
                cc.log('先择了AA')
            } else {

            }
        }, this);

        ////倍率
        this.xiazhu_200.node.on('toggle', () => {
            if (this.xiazhu_200.isChecked) {
                this.xiazhu_300.isChecked = false
                this.xiazhu_500.isChecked = false
                cc.log('renshu_6')
            }
        }, this);
        this.xiazhu_300.node.on('toggle', () => {
            if (this.xiazhu_300.isChecked) {
                this.xiazhu_200.isChecked = false
                this.xiazhu_500.isChecked = false
                cc.log('renshu_8')
            }
        }, this);
        this.xiazhu_500.node.on('toggle', () => {
            if (this.xiazhu_500.isChecked) {
                this.xiazhu_200.isChecked = false
                this.xiazhu_300.isChecked = false
                cc.log('renshu_10')
            }
        }, this);
        ////

    }
}