class LogManage {
    public levels;
    public level;
    public logNum;
    
    constructor() {
        this.levels = {e:4,w:3,i:2,d:1};
        this.level = this.getLevel();
        this.logNum = 1;
    }

    getLevel(){
        let a = "DEBUG"
        switch(a){
            case "ERROR":
                return this.levels.e;
            case "WARN":
                return this.levels.w;
            case "INFO":
                return this.levels.i;
            case "DEBUG":
                return this.levels.d;
            default:
               return this.levels.i;
        }
    }

    consoleShow(types, path, descs, v){
        let descString = JSON.stringify(descs)
        console.log(
            'the-flash:' + v + '(time:' +
            new Date()+
            ',   num:' +
            this.logNum++ +
            ',   type:' +
            JSON.stringify(types) +
            ',   path:' +
            path +
            ',   _desc:' +
            descString +
            ')'
        )
    }

    e(types, path, descs) {
        if (this.level<=this.levels.e) {
            this.consoleShow(types, path, descs, 'e')
        }
    }

    w(types, path, descs) {
        if (this.level<=this.levels.w) {
            this.consoleShow(types, path, descs, 'w')
        }
    }

    i(types, path, descs) {
        if (this.level<=this.levels.i) {
            this.consoleShow(types, path, descs, 'i')
        }
    }

    d(types, path, descs) {
        if (this.level<=this.levels.d) {
            this.consoleShow(types, path, descs, 'd')
        }
    }
}

export default  new LogManage()