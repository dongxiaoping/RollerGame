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

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Prefab)
    private desk: cc.Prefab = null  //桌子
    @property
    text: string = 'hello';
    scheduleOnceOb: any = null


    @property(cc.Prefab)
    private fexshu: cc.Prefab = null  //分数标签测试

    // onLoad () {}
    start() {
        let node = cc.instantiate(this.fexshu)
        node.parent = this.node
        node.setPosition(100, 100);
        node.getComponent('MahjongResultLabel').showResultWenZi({one:1,two:2})
        node.active = true
        // cc.loader.loadRes('ziMajongZhi/zi_2', (error, img) => {
        //     let myIcon = new cc.SpriteFrame(img);
        //     this.node.getChildByName('Bg').  spriteFrame = myIcon;
        // })
        // this.scheduleOnce(function() { //定时器
        //   console.log(6666666666666)
        // }, 3);
        //this.initDesk()
        // var arr = [
        //     { "raceNum": "1001", "userId": "值1", "value": "1" },
        //     { "raceNum": "1001", "userId": "值1", "value": "2" },
        //     { "raceNum": "1002", "userId": "值3", "value": "3" },
        //     { "raceNum": "1002", "userId": "值4", "value": "4" },
        //     { "raceNum": "1002", "userId": "值6", "value": "5" },
        //     { "raceNum": "1003", "userId": "值6", "value": "6" }
        // ];
        // let list = this.transRaceNum(arr);
        // let outList = [];
        // list.forEach((item:any)=>{
        //     let raceNum = item[0].raceNum;
        //     let userList = this.transUserId(item);
        //     outList[raceNum] = userList
        // })
        // console.log(outList);
    }
    transRaceNum(list: any): any {
        let type = 'raceNum';
        var map = {}, dest = [];
        for (var i = 0; i < list.length; i++) {
            var ai = list[i];
            if (!map[ai[type]]) {
                dest.push({
                    raceNum: ai[type],
                    data: [ai]
                });
                map[ai[type]] = ai;
            } else {
                for (var j = 0; j < dest.length; j++) {
                    var dj = dest[j];
                    if (dj[type] == ai[type]) {
                        dj.data.push(ai);
                        break;
                    }
                }
            }
        }
        let listAll = [];
        dest.forEach((item)=>{
            listAll[item[type]] = item['data']
        })
        return listAll
    }

    transUserId(list: any): any {
        let type = 'userId';
        var map = {}, dest = [];
        for (var i = 0; i < list.length; i++) {
            var ai = list[i];
            if (!map[ai[type]]) {
                dest.push({
                    userId: ai[type],
                    data: [ai]
                });
                map[ai[type]] = ai;
            } else {
                for (var j = 0; j < dest.length; j++) {
                    var dj = dest[j];
                    if (dj[type] == ai[type]) {
                        dj.data.push(ai);
                        break;
                    }
                }
            }
        }
        let listAll = [];
        dest.forEach((item)=>{
            listAll[item[type]] = item['data']
        })
        return listAll
    }
    private initDesk(){
        let node = cc.instantiate(this.desk)
        node.parent = this.node
        node.active = true
    }

    // update (dt) {}
}
