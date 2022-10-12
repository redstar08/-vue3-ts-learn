// 观察者模式
// 被观察者（目标）
const Subject = {
  observers: [] as Array<Observer>,
  subscribe(observer: Observer) {
    if (!observer) return false
    const _this = this
    _this.observers.push(observer)
    return _this
  },
  publish(...args: any[]) {
    const _this = this
    const observers = _this.observers
    if (observers.length === 0) return false
    observers.forEach((observer: Observer) => {
      observer.update && observer.update(...args)
    })
    return _this
  },
  unsubscribe(observer: Observer) {
    const _this = this
    const observers = _this.observers
    if (!observer) {
      observers.length = 0
    } else {
      observers.forEach((_observer: Observer, index: number) => {
        if (_observer === observer) {
          observers.splice(index, 1)
        }
      })
    }
    return _this
  },
  once(observer: Observer) {
    if (!observer) return false
    const _this = this
    const _observer = {
      ...observer,
      update: (...args: any) => {
        observer.update && observer.update(...args)
        _this.unsubscribe(_observer)
      },
    }
    _this.subscribe(_observer)
    return _this
  },
}
// 观察者
class Observer {
  name: string = `随机观察者${Math.floor(Math.random() * 10)}`
  constructor(name?: string) {
    if (typeof name === 'string') this.name = name
  }
  update(...args: any[]) {
    console.log('观察者:', this.name, '，您有来自 Subject 的通知：', args)
  }
}

const observer1 = new Observer()
const observer2 = new Observer('observer2')
const observer3 = new Observer('observer3')
const observer4 = new Observer('observer4')

Subject.subscribe(observer1)
Subject.subscribe(observer2)
Subject.subscribe(observer3)
Subject.unsubscribe(observer3)
Subject.once(observer4)

Subject.publish({ title: '今日推荐', content: '《Javascript 入门到放弃》', price: '￥48' })
Subject.publish({ title: '今日推荐', content: '《Javascript 百炼成仙》', price: '￥68' })
