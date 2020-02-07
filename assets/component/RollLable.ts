/**
* !#en Class KKRollLable
* !#zh 横向滚动字幕条，支持多条消息按添加顺序连续滚动，每条消息只会滚动一次。
* 若需反复滚动同一条消息，就用定时器定时添加。
* @class KKRollLable
* @constructor
* @extends cc.Component
*
* 使用要点：
* 1. 建一个空节点，绑定本脚本组件。
* 2. 在空节点下，建立一个 Mask 节点，将 AnchorX 设置为零，宽度设置为滚动区域的宽度。
* 3. 在Mask组件下，建立一个 Label 节点，将 AnchorX 设置为零，Overflow 模式为 None。
* 4. 将 Mask、Label 节点添加到本组件属性上。
* 5. 设置两条消息间的间隔字符串，建议8个空格。
* 6. 设置滚动速度，单位为像素/秒。
* 7. 调用 addText() 添加消息文本。
*
* 特色:
* 1. 支持多条消息文本连续滚动。
* 2. 用字符串数组缓存消息，实际进入Label的消息文本较少。
* 3. 使用简单，只要将服务器发来的公告文本，往组件里添加即可。
* 
* 缺点：
* 1. 不支持彩色富文本，如果把Label替换成富文本控件似乎就可以。
* 2. _rollText 函数不可重入，不要直接调用它。
* 3. 在消息尾部补空格的算法效率低下，最坏的情况下，可能要设置几十次 label.string 值。
* 4. 没有消息丢弃机制，如果短时间塞进去1000条消息，它也会慢慢一条一条的滚动。可在 addText
* 中限制添加到 _strings 中的消息数量，丢弃过多的消息。
*
* 测试：仅在 web 和 ios 环境下做过简单测试，貌似稳定，但仍可能有 Bug。
*
*/

const { ccclass, property } = cc._decorator;

@ccclass
export default class RollLable extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null  // Lable 控件，需要将其 AnchorX 设置为零，Overflow 模式为 None。
    @property(cc.Mask)
    mask: cc.Mask = null// Mask 控件，需要将其 AnchorX 设置为零，将其宽度设置为滚动区域的宽度。

    space: String = '      '       // 在两条消息之间的间隔字符串，通常设置为八个空格。

    _strings: String[] = []

    _d1: number = 0   // 正在滚动的文本长度

    speed: number = 30

    _d2: number = 0  // 已经添加的后续文本长度
    start() {
        this.addText(this.label.string)
    }

    /**
 * !#en
 * !#zh 添加一条滚动消息。
 * @method addText
 * @param {cc.String} text - 消息文本。
 */
    addText(text: String): void {
        var prefix = "";
        var suffix = this.space;
        if (this._strings.length === 0) {
            // 没有正在滚动的文本
            this.label.node.x = this.mask.node.width;
            this.label.string = prefix + text + suffix;
            this._d1 = this.label.node.width;
            this._d2 = this.label.node.width - this._d1;
            this._strings.push(prefix + text + suffix);
            this._rollText();
        } else {
            // 有正在滚动的文本
            if (this._d2 < this.mask.node.width) {
                // 还可以添加后续文本
                while (this.label.node.x + this._d1 + this._d2 < this.mask.node.width) {
                    // 补空格      
                    this.label.string = this.label.string + " ";
                    this._d2 = this.label.node.width - this._d1;
                    prefix = prefix + " ";
                }
                this.label.string = this.label.string + text + suffix;
                this._d2 = this.label.node.width - this._d1;
                this._strings.push(prefix + text + suffix);
            } else {
                // 不能再添加后续文本
                this._strings.push(prefix + text + suffix);
            }
        }
    }

    _rollText(): void {
        try {
            //var self = this;
            if (this._strings.length > 0) {
                setTimeout(function () {
                    var d = this.label.node.x + this._d1;
                    var x = - this._d1;
                    var t = d / this.speed;
                    this.label.node.runAction(cc.sequence(
                        cc.moveTo(t, cc.v2(x, this.label.node.y)),
                        cc.callFunc(function () {
                            this._strings.shift();
                            if (this._strings.length > 0) {
                                this.label.node.x = 0;
                                this.label.string = this._strings[0];
                                this._d1 = this.label.node.width;
                                this._d2 = this.label.node.width - this._d1;
                                for (var i = 1; i < this._strings.length; i++) {
                                    if (this.label.node.x + this._d1 + this._d2 < this.mask.node.width + this._d1) {
                                        this.label.string = this.label.string + this._strings[i];
                                        this._d2 = this.label.node.width - this._d1;
                                    } else {
                                        break;
                                    }
                                }
                                this._rollText();
                            } else {
                                setTimeout((): void => {
                                    this.addText(this.label.string)
                                }, 5 * 1000)
                            }
                        }.bind(this))
                    ));
                }.bind(this), 800);
            }
        } catch (e) {
            //console.log(e)
        }
    }

    // update (dt) {}
}
