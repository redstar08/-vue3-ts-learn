// 三个状态：PENDING、FULFILLED、REJECTED
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED '
const REJECTED = 'REJECTED'

const resolvePromise = (promise2, result, resolve, reject) => {
  // 自己等待自己完成是错误的实现，用一个类型错误，结束掉 promise
  if (promise2 === result) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  let called = undefined
  // 对象需要判断一下是不是 Promise 对象，或者 thenable 对象
  if ((typeof result === 'object' && result != null) || typeof result === 'function') {
    try {
      const then = result.then
      // 如果 result.then 是一个函数，就说明是 Promise 对象，或者 thenable 对象
      if (typeof then === 'function') {
        // 不要写成 result.then，直接 then.call 就可以了 因为 x.then 会再次取值，Object.defineProperty
        then.call(
          result,
          (promise3) => {
            if (called) return
            called = true
            // 递归解析的过程（因为可能 promise 中还有 promise）直到是普通值为止
            resolvePromise(promise2, promise3, resolve, reject)
          },
          (reason) => {
            if (called) return
            called = true
            reject(reason)
          },
        )
      } else {
        // 如果不是 function, 那么说明只是普通对象，并不是 Promise 对象，或者 thenable 对象, 当普通值处理
        resolve(result)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    // 不是对象，那就是普通值或者函数，直接 resolve 作为结果
    resolve(result)
  }
}

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
    }
  }

  // 包含 then 方法将执行结果或者拒绝的理由，通过回调的形式抛出
  then(onFulfilled, onRejected) {
    // then 函数可以不接受参数 此时将值传递给下一个 promise (proimise2)
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (result) => result
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (reason) => {
            throw reason
          }
    // then 函数的返回值是一个 promise 对象用于链式调用
    const promise2 = new promise((resolve, reject) => {
      // 状态切换，执行成功了
      if (this.status === FULFILLED) {
        // 等待当前的执行成功的返回值，并且将返回值 resolve 出去
        // 当 onFullFilled 函数返回值是普通值时，下一个 then 的 onFullFilled 函数将会以这个返回值作为参数。
        // 当 onFullFilled 函数返回值是一个函数时，下一个 then 的 onFullFilled 函数也会直接以这个函数当作参数。
        // 当 onFullFilled 函数返回值是一个 Promise 时，promise2 resolve() 或者 reject() 的值
        // 取决于 onFullFilled 函数返回的 Prmise 对象 resolve() 或者 reject() 的值
        setTimeout(() => {
          try {
            const result = onFulfilled(this.result)
            resolvePromise(promise2, result, resolve, reject)
            // resolve(result)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      // 状态切换，执行拒绝了
      if (this.status === REJECTED) {
        // 等待当前执行失败的返回值，并且将返回值 reject 出去
        setTimeout(() => {
          try {
            const reason = onRejected(this.reason)
            resolvePromise(promise2, reason, resolve, reject)
            // reject(reason)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      // 状态没有切换，先将状态当前回调保存起来
      if (this.status === PENDING) {
        // 等待当前成功的回调
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const result = onFulfilled(this.result)
              resolvePromise(promise2, result, resolve, reject)
              // resolve(result)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
        // 等待当前失败的回调
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const reason = onRejected(this.reason)
              resolvePromise(promise2, reason, resolve, reject)
              // reject(reason)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
      }
    })
    return promise2
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }
}

// 测试 promise
// let count = 0
// const promise1 = new promise((resolve, reject) => {
//   setTimeout(() => {
//     resolve("resolved")
//     reject("rejected")
//   }, 1000)
// })
// let value = null
// const promise2 = promise1
//   .then((data) => {
//     console.log("success", data, count++)
//     value = promise2
//     return new promise((resolve, reject) => {
//       setTimeout(() => {
//         reject("rejected")
//       }, 1000)
//     })
//   })
//   .catch((err) => {
//     console.log("faild", err, count++)
//     return err
//   })

promise.deferred = function () {
  const defer = {}
  defer.promise = new promise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}

module.exports = promise
