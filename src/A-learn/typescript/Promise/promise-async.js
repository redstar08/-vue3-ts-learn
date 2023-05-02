// 三个状态：PENDING、FULFILLED、REJECTED
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED '
const REJECTED = 'REJECTED'

class promise {
  constructor(executor) {
    // 初始状态为 PENDING
    this.status = PENDING
    // 存放成功状态的值，默认为 undefined
    this.result = undefined
    // 存放失败状态的值，默认为 undefined
    this.reason = undefined
    // 存放成功的回调
    this.onResolvedCallbacks = []
    // 存放失败的回调
    this.onRejectedCallbacks = []

    // 调用此方法表示成功
    const resolve = (result) => {
      // 只有 PENGDING 状态才能更新为其他状态
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.result = result
        // 依次执行成功对应的回调
        this.onResolvedCallbacks.forEach((callback) => callback())
      }
    }

    const reject = (reason) => {
      // 只有 PENGDING 状态才能更新为其他状态
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        // 依次执行对应失败的回调
        this.onRejectedCallbacks.forEach((callback) => callback())
      }
    }

    // 立即执行 executor
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
      console.log(error)
    }
  }

  // 包含 then 方法将执行结果或者拒绝的理由，通过回调的形式抛出
  then(onFulfilled, onRejected) {
    // 状态切换，执行成功了
    if (this.status === FULFILLED) {
      onFulfilled(this.result)
    }

    // 状态切换，执行拒绝了
    if (this.status === REJECTED) {
      onRejected(this.reason)
    }

    // 状态没有切换，先将状态当前回调保存起来
    if (this.status === PENDING) {
      // 保存当前成功的回调
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.result)
      })
      // 保存当前失败的回调
      this.onRejectedCallbacks.push(() => {
        onFulfilled(this.result)
      })
    }
  }
}

const p1 = new promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功数据')
  }, 1000)
}).then(
  // 执行 then 的时候 p1 的状态还是 PENGDING 所以需要收集当前的回调，等状态改变后在执行回调
  // 熟悉设计模式的同学，应该意识到了这其实是一个发布订阅模式
  // 这种收集依赖 -> 触发通知 -> 取出依赖执行的方式，被广泛运用于发布订阅模式的实现
  (data) => {
    console.log('success', data)
  },
  (err) => {
    console.log('faild', err)
  },
)
