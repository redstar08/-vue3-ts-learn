const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

const handlePromise = (promise2, result, resolve, reject) => {
  if (promise2 === result) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  let called = undefined
  if ((typeof result === 'object' && result !== null) || typeof result === 'function') {
    try {
      const then = result.then
      if (typeof then === 'function') {
        then.call(
          result,
          (promise3) => {
            if (called) return
            called = true
            handlePromise(promise2, promise3, resolve, reject)
          },
          (reason) => {
            if (called) return
            called = true
            reject(reason)
          },
        )
      } else {
        resolve(result)
      }
    } catch (error) {
      if (called) return
      called = true
      reject(error)
    }
  } else {
    resolve(result)
  }
}

class promise {
  constructor(executor) {
    this.status = PENDING
    this.result = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (result) => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.result = result
        this.onResolvedCallbacks.forEach((callback) => callback())
      }
    }

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach((callback) => callback())
      }
    }

    // 立即执行
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : (v) => v
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : (e) => {
            throw e
          }
    const promise2 = new promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            // 将结果传递给下一个 then
            const result = onResolved(this.result)
            handlePromise(promise2, result, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            // 将结果传递给下一个 then
            const result = onRejected(this.reason)
            handlePromise(promise2, result, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      // 执行状态未定，收集依赖
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const result = onResolved(this.result)
              handlePromise(promise2, result, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const result = onRejected(this.reason)
              handlePromise(promise2, result, resolve, reject)
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

// test
const p1 = new promise((resolve, reject) => {
  setTimeout(() => {
    resolve('resolve')
    // reject("reject")
  }, 1000)
})
  .then((result) => {
    console.log('sucess: ', result)
    return p1
  })
  .catch((reason) => {
    console.log('faild: ', reason)
  })

promise.deferred = () => {
  const defer = {}
  defer.promise = new promise((resolve, reject) => {
    defer.resolve = resolve
    defer.reject = reject
  })
  return defer
}

module.exports = promise
