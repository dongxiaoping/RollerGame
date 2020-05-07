import axios from 'axios'
import { ResponseStatus, PromiseParam, NoticeType, NoticeData, InterfaceUrl, EventType, LocalNoticeEventType, LocalNoticeEventPara, voiceNotice } from '../../common/Const'
import RoomManage from '../Room/RoomManage';
import webSocketManage from '../../common/WebSocketManage'
import UserManage from '../User/UserManage';
import ConfigManage from '../Config/ConfigManage';
import { config } from '../../common/Config';
import { eventBus } from '../../common/EventBus';
class VoiceManage {
    private rec = null//实例化的录音对象
    public timeLimit = 6 //单位s 录音超时时间
    public beginButtonHideTime = 5 //语音按钮消失时长
    public scheduleOnceLimit = null //超时自动关闭录音定时器
    constructor() {

    }

    //实例化录音对象
    recOpen(success) {
        this.rec = window.Recorder({
            type: "mp3", sampleRate: 16000, bitRate: 16 //mp3格式，指定采样率hz、比特率kbps，其他参数使用默认配置；注意：是数字的参数必须提供数字，不要用字符串；需要使用的type类型，需提前把格式支持文件加载进来，比如使用wav格式需要提前加载wav.js编码引擎
            , onProcess: function (buffers, powerLevel, bufferDuration, bufferSampleRate, newBufferIdx, asyncEnd) {
                //录音实时回调，大约1秒调用12次本回调
                //可利用extensions/waveview.js扩展实时绘制波形
                //可利用extensions/sonic.js扩展实时变速变调，此扩展计算量巨大，onProcess需要返回true开启异步模式
            }
        });

        //var dialog=createDelayDialog(); 我们可以选择性的弹一个对话框：为了防止移动端浏览器存在第三种情况：用户忽略，并且（或者国产系统UC系）浏览器没有任何回调，此处demo省略了弹窗的代码
        this.rec.open(function () {//打开麦克风授权获得相关资源
            //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
            //rec.start() 此处可以立即开始录音，但不建议这样编写，因为open是一个延迟漫长的操作，通过两次用户操作来分别调用open和start是推荐的最佳流程
            success && success();
        }, function (msg, isUserNotAllow) {//用户拒绝未授权或不支持
            //dialog&&dialog.Cancel(); 如果开启了弹框，此处需要取消
            eventBus.emit(EventType.LOCAL_NOTICE_EVENT, {
                type: LocalNoticeEventType.PLAY_AUDIO_NOT_SUPPORT,info:""
            } as LocalNoticeEventPara)
            console.log((isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg);
        });
    }

    //开始录音
    recStart() {
        this.recOpen(()=>{
            this.rec.start();
        })
    }

    //上传语音，并通知其它玩家播放语音
    //base64data 语音文件
    //duration 语音时长 单位ms
    async uploadAndNoticeAudio(base64data: any, duration: number) {
        let info = await this.upLoadVice(base64data)
        if (info.result == ResponseStatus.SUCCESS) {
            let notice = {
                type: NoticeType.voicePlay, info: {
                    roomId: RoomManage.roomItem.id,
                    userId: UserManage.userInfo.id,
                    voiceName: info.extObject,
                    duration: duration
                }
            } as NoticeData
            webSocketManage.send(JSON.stringify(notice));
            console.log('语音通知')
        }else{
            console.log('语音上传失败')
        }
    }

    //获取到音频地址后，进行播放
    getAndPlayAudio(ccOb: any, voiceItem: voiceNotice) {
        console.log('准备播放语音')
        ccOb.loader.load(ConfigManage.getAudioUrl() + voiceItem.voiceName, function (err, clip) {
            var audioID = ccOb.audioEngine.play(clip, false, 0.5);
        });
    }

    //结束并上报录音
    recStop() {
        let that = this
        if(this.rec == null){
            return
        }
        this.rec.stop(function (blob, duration) {
            let reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                let base64data = reader.result;
                that.uploadAndNoticeAudio(base64data, duration)
            }

            console.log(blob, (window.URL || webkitURL).createObjectURL(blob), "时长:" + duration + "ms");
            that.rec.close();//释放录音资源，当然可以不释放，后面可以连续调用start；但不释放时系统或浏览器会一直提示在录音，最佳操作是录完就close掉
            that.rec = null;
            //已经拿到blob文件对象想干嘛就干嘛：立即播放、上传
            /*** 【立即播放例子】 ***/
        //    var audio = document.createElement("audio");
         //   audio.controls = true;
            //  document.body.appendChild(audio);
            //简单利用URL生成播放地址，注意不用了时需要revokeObjectURL，否则霸占内存
          //  audio.src = (window.URL || webkitURL).createObjectURL(blob);
           // audio.play();
        }, function (msg) {
            console.log("录音失败:" + msg);
            that.rec.close();//可以通过stop方法的第3个参数来自动调用close
            that.rec = null;
        });
    };

    public upLoadVice(file: string): Promise<PromiseParam> {
        return new Promise((resolve: (param: PromiseParam) => void): void => {
            let Ajax = axios.create({
                baseURL: config.serverAddress,
                timeout: 4000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'//application/json application/x-www-form-urlencoded
                }
            })
            Ajax({
                method: 'POST',
                url: InterfaceUrl.AUDIO_UPLOAD,
                data: {
                    file: file
                }
            }).then(res => {
                if (res.data.status == ResponseStatus.SUCCESS) {
                    let mp3Url = res.data.data
                    resolve({ result: ResponseStatus.SUCCESS, extObject: mp3Url })
                } else {
                    resolve({ result: ResponseStatus.FAIL, extObject: "" })
                    console.log("语音通知失败")
                }
                console.log(res)
            }).catch(function (e) {
                resolve({ result: ResponseStatus.FAIL, extObject: "" })
                console.log("语音通知网络异常")
            })
        })
    }
}
export default new VoiceManage()