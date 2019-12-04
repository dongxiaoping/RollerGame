import { EventType } from '../common/Const'

class EventBus {
  private listeners: any = {}

  //添加事件监听
  on(
    eventType: EventType,
    listenerId: string,
    fn: any,
    once: boolean = false
  ): void {
    if (!listenerId || typeof fn !== 'function') {
      return
    }
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = {}
    }
    this.listeners[eventType][listenerId] = { once: once, fn: fn }
  }

  //移除事件监听
  off(eventType: EventType, listenerId: string): void {
    if (this.listeners[eventType]) {
      delete this.listeners[eventType][listenerId]
    }
  }

  clearAll(){
    this.listeners = {}
  }

  //添加事件监听,只能触发一次
  once(eventType: EventType, listenerId: string, fn: any): void {
    this.on(eventType, listenerId, fn, true)
  }

  //触发事件
  emit(eventType: EventType, fnArgs: any): void {
    setTimeout((): void => {
      let deleteArray = []
      if (this.listeners[eventType]) {
        for (let listenerId in this.listeners[eventType]) {
          let listener = this.listeners[eventType][listenerId]
          if (listener) {
            if (listener.once) {
              deleteArray.push({ eventType: eventType, listenerId: listenerId })
            }
            if (typeof listener.fn === 'function') {
              try {
                listener.fn(fnArgs)
              } catch (err) {
                console.log(err)
              }
            } else {
              deleteArray.push({ eventType: eventType, listenerId: listenerId })
            }
          } else {
            deleteArray.push({ eventType: eventType, listenerId: listenerId })
          }
        }
      }
      for (let i = 0, len = deleteArray.length; i < len; i++) {
        let del = deleteArray[i]
        this.off(del.eventType, del.listenerId)
      }
    })
  }
}

export const eventBus = new EventBus()
