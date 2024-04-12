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
    // then 函数可以不接受参数 此时将值传递给下一个 promise (proimise2)
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (result) => result
    onRejected =
      typeof onFulfilled === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }
    // then 函数的返回值是一个 promise 对象用于链式调用
    const promise2 = new promise((resolve, reject) => {
      // 状态切换，执行成功了
      if (this.status === FULFILLED) {
        // 保存当前的执行成功的返回值，并且将返回值 resolve 出去
        const result = onFulfilled(this.result)
        resolve(result)
      }

      // 状态切换，执行拒绝了
      if (this.status === REJECTED) {
        // 保存当前执行失败的返回值，并且将返回值 reject 出去
        const reason = onRejected(this.reason)
        reject(reason)
      }

      // 状态没有切换，先将状态当前回调保存起来
      if (this.status === PENDING) {
        // 保存当前成功的回调
        this.onResolvedCallbacks.push(() => {
          const result = onFulfilled(this.result)
          resolve(result)
        })
        // 保存当前失败的回调
        this.onRejectedCallbacks.push(() => {
          const reason = onRejected(this.reason)
          reject(reason)
        })
      }
    })
    return promise2
  }
}

// 测试 promise
let count = 0
const promise1 = new promise((resolve, reject) => {
  setTimeout(() => {
    resolve('resolved')
    reject('rejected')
  }, 1000)
})
  .then(
    (data) => {
      console.log('success', data, count++)
      return data
    },
    (err) => {
      console.log('faild', err, count++)
      return err
    },
  )
  .then()
  .then(
    (data) => {
      console.log('success', data, count++)
      return new promise((resolve, reject) => {
        setTimeout(() => {
          resolve('resolved')
          reject('rejected')
        }, 1000)
      })
    },
    (err) => {
      console.log('faild', err, count++)
      return err
    },
  )
  .then(
    (data) => {
      data.then((res) => {
        console.log(res)
      })
      console.log('success', data, count++)
      return data
    },
    (err) => {
      console.log('faild', err, count++)
      return err
    },
  )

promise.deferred = function () {
  const defer = {}
  defer.promise = new promise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}

module.exports = promise
