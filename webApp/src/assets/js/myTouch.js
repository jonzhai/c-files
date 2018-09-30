(function(win) {
    class touchTarget {
        constructor(ele) {
                var target = null;
                if (typeof ele === "string") {
                    target = win.document.querySelector(ele);
                } else if (ele instanceof HTMLElement) {
                    target = ele;
                }
                if (!target) { return };

                //原始dom对象
                this.dom = target;
                //事件回调对象
                this.callbackArr = {};
                //事件类型
                this.eventType = {
                    tap: 'tap',
                    longtap: 'longtap',
                    swipe: 'swipe',
                    swipleft: 'swipleft',
                    swipright: 'swipright',
                    swipup: 'swipup',
                    swipdown: 'swipdown',
                    drag: 'drag'
                }
                this._init();

            }
            //注册事件
        on(eventType, callback) {
                if (typeof this.callbackArr[eventType] === "undefined") {
                    this.callbackArr[eventType] = Array.of(callback);
                } else {
                    this.callbackArr[eventType].push(callback);
                }
            }
            //触发事件
        trigger(eventType, touchEvent) {
                if (typeof this.callbackArr[eventType] === "undefined") {
                    return;
                }
                this.callbackArr[eventType].forEach(callback => {
                    callback(touchEvent);
                });

            }
            //解绑事件
        off(eventType, callback) {
            if (typeof this.callbackArr[eventType] === "undefined") {
                return;
            } else {
                let index = this.callbackArr[eventType].findIndex(function(item, index) {
                    return Object.is(item, callback)
                });
                if (index !== -1) {
                    this.callbackArr[eventType].splice(index, 1);
                }
                return;
            }
        }
        _init() {
            var obj = {},
                beginMove = false,
                me = this;
            this.dom.addEventListener('touchstart', function(e) {

                obj.startX = e.touches[0].screenX;
                obj.startY = e.touches[0].screenY;
                obj.startTime = e.timeStamp;

                beginMove = true;

            })

            this.dom.addEventListener('touchmove', function(e) {
                if (!beginMove) { return }
                obj.tempX = e.touches[0].screenX;
                obj.tempY = e.touches[0].screenY;
                obj.tempTime = e.timeStamp;
                // var type = me._checkType(obj);
                // if (/swip/gi.test(type)) {
                // console.log(1)
                if (typeof me.callbackArr.drag === "undefined") {
                    return;
                }
                obj.eventType = 'drag';
                me.trigger('drag', Object.assign(e, obj))
                    // }

            })
            this.dom.addEventListener('touchend', function(e) {
                // console.log(e)
                //检查动作类型
                obj.endTime = e.timeStamp;
                var type = me._checkType(obj);
                obj.eventType = type;
                //如果判断为左右或者上下滑动，则同时出发滑动事件
                if (/swip/gi.test(type)) {
                    me.trigger(me.eventType.swipe, Object.assign(e, obj))
                }
                me.trigger(type, Object.assign(e, obj))

                beginMove = false;
                obj = {};
            })


        }
        _checkType(obj) {
            //分析起止点，分析方向和距离，以此判断事件类型
            var dtX, dtY, dtTime, eventType = this.eventType;
            if (typeof obj.tempX === "undefined") {
                dtTime = obj.endTime - obj.startTime;
                if (dtTime >= 500) {
                    return eventType.longtap;
                } else {
                    return eventType.tap;
                }

            } else {
                dtX = obj.tempX - obj.startX;
                dtY = obj.tempY - obj.startY;
                return distinguishDirection(dtX, dtY);
            }

            function distinguishDirection(dtX, dtY) { //识别方向
                if (Math.abs(dtX) >= Math.abs(dtY)) {
                    if (dtX > 0) {
                        return eventType.swipright;
                    } else {
                        return eventType.swipleft;
                    }
                } else {
                    if (dtY > 0) {
                        return eventType.swipdown;
                    } else {
                        return eventType.swipup;
                    }
                }
            }
        }
    }
    win.$$ = function(ele) {
        if (!ele) { return };
        return new touchTarget(ele);
    }

})(window)

export default window.$$;