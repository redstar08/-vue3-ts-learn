// 发布-订阅-模式
const EventEmitter = {
  _events: {},
  on(event: string, callback: Function) {
    console.log('EventEmitter->on', event)
    const _this: any = this
    // ;(_this._events[event] || (_this._events[event] = [])).push(callback)
    if (_this._events[event]) {
      _this._events[event].push(callback)
    } else {
      _this._events[event] = [callback]
    }
    return _this
  },
  emit(event: string, ...args: any[]) {
    console.log('EventEmitter->emit', event)
    const _this: any = this
    const callbacks = [..._this._events[event]]
    if (!callbacks || callbacks.length === 0) {
      return false
    }
    callbacks.forEach((fn: Function) => {
      fn.apply(_this, args)
    })
    return _this
  },
  off(event: string, callback: Function) {
    console.log('EventEmitter->off', event)
    const _this: any = this
    const callbacks = _this._events[event]
    if (!callbacks || callbacks.length === 0) return false
    if (!callback) {
      callbacks.length = 0
    } else {
      callbacks.forEach((fn: Function, index: number) => {
        if (fn === callback) {
          callbacks.splice(index, 1)
        }
      })
    }
    return _this
  },
  once(event: string, callback: Function) {
    console.log('EventEmitter->once', event)
    const _this: any = this
    const once = (...args: any[]) => {
      callback.apply(_this, args)
      _this.off(event, once)
    }
    _this.on(event, once)
    return _this
  },
}

// Test
const user1 = (data: any) => {
  console.log('用户1，订阅的数据是：', data)
}
const user2 = (data: any) => {
  setTimeout(() => {
    console.log('用户2，订阅的数据是：', data)
  }, 1000)
}
const user3 = (data: any) => {
  console.log('用户3，订阅的数据是：', data)
}
const user4 = (data: any) => {
  setTimeout(() => {
    console.log('用户4，订阅的数据是：', data)
  }, 1000)
}
const user5 = (data: any) => {
  setTimeout(() => {
    console.log('用户5，订阅的数据是：', data)
  }, 1000)
}
EventEmitter.on('article', user1)
EventEmitter.on('article', user2)
EventEmitter.on('article', user3)
EventEmitter.on('article', user4)
EventEmitter.off('article', user4)
EventEmitter.once('article', user5)

EventEmitter.emit('article', { title: '《Javascript 入门到放弃》', price: '￥48' })
EventEmitter.emit('article', { title: '《Javascript 百炼成仙》', price: '￥68' })

// 两种模式的关联和区别:
// 1.发布订阅模式更灵活，是进阶版的观察者模式，指定对应分发。
// 2.观察者模式维护单一事件对应多个依赖该事件的对象关系；
// 3.发布订阅维护多个事件（主题）及依赖各事件（主题）的对象之间的关系；
// 4.观察者模式是目标对象直接触发通知（全部通知），观察对象被迫接收通知。发布订阅模式多了个中间层（事件中心），由其去管理通知广播（只通知订阅对应事件的对象）；
// 5.观察者模式对象间依赖关系较强，发布订阅模式中对象之间实现真正的解耦。
