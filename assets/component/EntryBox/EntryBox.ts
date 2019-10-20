// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Sprite)
    CloseButton: cc.Sprite = null;

    @property(cc.Button)
    One: cc.Button = null;
    @property(cc.Button)
    Two: cc.Button = null;
    @property(cc.Button)
    Three: cc.Button = null;
    @property(cc.Button)
    Four: cc.Button = null;
    @property(cc.Button)
    Five: cc.Button = null;
    @property(cc.Button)
    Six: cc.Button = null;
    @property(cc.Button)
    Seven: cc.Button = null;
    @property(cc.Button)
    Eight: cc.Button = null;
    @property(cc.Button)
    Nine: cc.Button = null;
    @property(cc.Button)
    Zero: cc.Button = null;
    @property(cc.Button)
    Delete: cc.Button = null;
    @property(cc.Button)
    Enter: cc.Button = null;


    @property(cc.Label)
    Num: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
 
    }
    onEnable() {
        this.CloseButton.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.node.destroy()
        })
        this.One.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.Num.string +='1'
        })
        this.Two.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.Num.string +='2'
        })
        this.Three.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.Num.string +='3'
        })
        this.Four.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.Num.string +='4'
        })
        this.Five.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.Num.string +='5'
        })
        this.Six.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.Num.string +='6'
        })
        this.Seven.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.Num.string +='7'
        })
        this.Eight.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.Num.string +='8'
        })
        this.Nine.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.Num.string +='9'
        })
        this.Zero.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.Num.string +='0'
        })
        this.Delete.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            this.Num.string = this.Num.string.substring(0,this.Num.string.length-1)
        })
        this.Enter.node.on(cc.Node.EventType.TOUCH_END, ()=>{
            console.log(this.Num.string)
        })
    }

    onDisable(){
        this.CloseButton.node.off(cc.Node.EventType.TOUCH_END, ()=>{})
    }
    // update (dt) {}
}
