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

    // 调用此方法表示成功
    const resolve = (result) => {
      // 只有 PENGDING 状态才能更新为其他状态
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.result = result
      }
    }

    const reject = (reason) => {
      // 只有 PENGDING 状态才能更新为其他状态
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
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
    if (this.status === FULFILLED) {
      onFulfilled(this.result)
    }
    if (this.status === REJECTED) {
      onRejected(this.reason)
    }
  }
}

const p1 = new promise((resolve, reject) => {
  resolve('成功数据')
  // reject("失败理由")
}).then(
  (data) => {
    console.log('success', data)
  },
  (err) => {
    console.log('faild', err)
  },
)
