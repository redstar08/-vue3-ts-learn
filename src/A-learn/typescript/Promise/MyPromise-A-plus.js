;(function (root, factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    console.log('是commonjs模块规范，nodejs环境')
    module.exports = factory()
  } else if (typeof define === 'function' && define.amd) {
    // 如果环境中有define函数，并且define函数具备amd属性，则可以判断当前环境满足AMD规范
    console.log('是AMD模块规范，如require.js')
    define(factory)
  } else {
    console.log('没有模块环境，直接挂载在全局对象上')
    root.MyPromise = factory()
  }
})(this, function () {
  const PENDING = 'pending'
  const FULFILLED = 'fulfilled'
  const REJECTED = 'rejected'

  /* 微任务中将运行的代码 */
  const runMicroTask = (task) => {
    if (typeof process !== 'undefined' && typeof process.nextTick === 'function') {
      process.nextTick(task)
    } else if (typeof window === 'object' && typeof MutationObserver === 'function') {
      const observer = new MutationObserver(task)
      const textNode = document.createTextNode('1')
      observer.observe(textNode, {
        characterData: true,
      })
      textNode.textContent = '2'
    } else if (typeof queueMicrotask === 'function') {
      queueMicrotask(task)
    } else {
      setTimeout(task, 0)
    }
  }

  /**
   * 检测 Promise 对象
   */
  const isMyPromise = (x) => {
    return typeof x === 'object' && x !== null && x instanceof MyPromise
  }

  /**
   * MDN https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
   * Promise/A+ spec https://promisesaplus.com.cn/
   * ES6 的 Promsie 和 Promise A+ 规范不一样，一个是官方标准，一个是社区规范它们都是 thenable 对象
   */
  class MyPromise {
    constructor(executor) {
      // 初始状态为 PENDING
      this.status = PENDING
      //初始值为 undefined
      this.value = undefined
      // 存放 then 注册的回调函数
      this.queueTasks = []

      const resolve = (value) => {
        this.#runQueueTask(FULFILLED, value)
      }

      const reject = (reason) => {
        this.#runQueueTask(REJECTED, reason)
      }

      try {
        executor(resolve, reject)
      } catch (error) {
        reject(error)
      }
    }

    /**
     * 用私有函数实现
     * 状态敲定，清空任务队列
     */
    #runQueueTask(status, value) {
      if (this.status === PENDING) {
        this.status = status
        this.value = value
        while (this.queueTasks.length) {
          const { resolveTask, rejectTask } = this.queueTasks.shift()
          if (this.status === FULFILLED) {
            resolveTask()
          }
          if (this.status === REJECTED) {
            rejectTask()
          }
        }
      }
    }

    /**
     * 用私有函数实现
     * 2.3 Promise 解决过程
     */
    #promiseResolutionProcedure(promise, x, resolve, reject) {
      // 2.3.1 如果promise和x引用同一个对象，则以TypeError为原因拒绝promise。
      if (promise === x) {
        const e = new TypeError('Chaining cycle detected for promise <Promise>')
        // throw e
        return reject(e)
      }

      let called = undefined
      // console.log('promiseResolutionProcedure -> ', promise, x, called)
      // 2.3.2 如果x是一个promise，采用其状态 -> 此处与 2.3.3 合并
      // 2.3.3 否则，如果x是一个对象或函数：
      if (isMyPromise(x) || (typeof x === 'object' && x !== null) || typeof x === 'function') {
        try {
          const then = x.then
          // 2.3.3.3 如果then是一个函数，则以x作为this，第一个参数为resolvePromise，第二个参数为rejectPromise调用它
          if (typeof then === 'function') {
            then.call(
              x,
              (y) => {
                if (called) return
                called = true
                // 递归解析的过程（因为可能 promise 中还有 promise）直到是普通值为止
                this.#promiseResolutionProcedure(promise, y, resolve, reject)
              },
              (r) => {
                if (called) return
                called = true
                reject(r)
              },
            )
          } else {
            resolve(x)
          }
        } catch (e) {
          if (called) return
          called = true
          // throw e
          reject(e)
        }
      } else {
        // 2.3.4 如果x不是对象或函数，则用x来实现promise
        resolve(x)
      }
    }

    /**
     * then方法可以在同一个promise上多次调用。
     * 2.2.1 onFulfilled和onRejected都是可选参数：
     *    2.2.1.1如果onFulfilled不是一个函数，它必须被忽略。
     *    2.2.1.2如果onRejected不是一个函数，它必须被忽略。
     * 2.2.4 onFulfilled或onRejected不能在执行上下文堆栈中只包含平台代码之前调用。
     * 2.2.5 onFulfilled和onRejected必须作为函数被调用（即没有this值）。
     */
    then(onFulfilled, onRejected) {
      /**
       * 2.2.7 then方法必须返回一个promise
       */
      const promise2 = new MyPromise((resolve, reject) => {
        const settledTask = (callback, settled) => {
          runMicroTask(() => {
            if (typeof callback === 'function') {
              try {
                /**
                 * 2.2.7.1 如果onFulfilled或onRejected返回一个值x，则运行Promise Resolution Procedure [[Resolve]](promise2, x)。
                 */
                const x = callback(this.value)
                this.#promiseResolutionProcedure(promise2, x, resolve, reject)
              } catch (e) {
                /**
                 * 2.2.7.2 如果onFulfilled或onRejected抛出异常e，则promise2必须以e作为原因被拒绝。
                 */
                // throw e
                reject(e)
              }
            } else {
              /**
               * 2.2.7.3 如果onFulfilled不是一个函数且promise1被实现，则promise2必须以与promise1相同的值被实现。
               * 2.2.7.4 如果onRejected不是一个函数且promise1被拒绝，则promise2必须以与promise1相同的原因被拒绝。
               */
              settled(this.value)
            }
          })
        }

        const resolveTask = () => {
          settledTask(onFulfilled, resolve)
        }

        const rejectTask = () => {
          settledTask(onRejected, reject)
        }

        if (this.status === FULFILLED) {
          resolveTask()
        }

        if (this.status === REJECTED) {
          rejectTask()
        }

        if (this.status === PENDING) {
          this.queueTasks.push({
            resolveTask,
            rejectTask,
          })
        }
      })

      return promise2
    }

    /**
     * 返回一个新的 Promise，无论当前的 promise 状态如何，这个新的 promise 在返回时总是处于待定（pending）状态。
     * 如果调用了 onRejected，则返回的 promise 将根据此调用的返回值进行兑现，或者使用此调用引发的错误进行拒绝。
     * 如果当前的 promise 已兑现，则 onRejected 不会被调用，并且返回的 promise 具有相同的兑现值。
     * 此方法是 Promise.prototype.then(undefined, onRejected) 的一种简写形式。
     */
    catch(onRejected) {
      return this.then(undefined, onRejected)
    }

    /**
     * 立即返回一个新的 Promise。
     * 无论当前 promise 的状态如何，此新的 promise 在返回时始终处于待定（pending）状态。
     * 如果 onFinally 抛出错误或返回被拒绝的 promise，则新的 promise 将使用该值进行拒绝。
     * 否则，新的 promise 将以与当前 promise 相同的状态敲定（settled）。
     * 如果 onFinally 不是函数，则调用 then() 时使用 onFinally 同时作为两个参数
     */
    finally(onFinally) {
      // this.then 执行的时候 如果 onFinally 执行报错会被捕获，所以无需处理
      // if (typeof onFinally !== 'function') {
      //   return this.then(onFinally, onFinally)
      // }

      return this.then(
        (value) => {
          return MyPromise.resolve(onFinally()).then(() => value)
        },
        (reason) => {
          return MyPromise.resolve(onFinally()).then(() => {
            throw reason
          })
        },
      )
    }
  }

  /**
   * 实现 ES 规范的 Promise.resolve
   */
  MyPromise.resolve = function (value) {
    if (isMyPromise(value)) {
      return value
    }
    if (typeof value === 'object' && value !== null) {
      const then = value.then
      if (then === 'function') {
        return new MyPromise((resolve, reject) => {
          then.call(value, resolve, reject)
        })
      }
    }
    return new MyPromise((resolve) => resolve(value))
  }

  /**
   * 实现 ES 规范的 Promise.reject
   */
  MyPromise.reject = function (reason) {
    return new MyPromise((resolve, reject) => reject(reason))
  }

  /**
   * 实现 ES 规范的 Promise.all
   * Promise.all() 静态方法接受一个 Promise 可迭代对象作为输入，并返回一个 Promise。
   * 当所有输入的 Promise 都被兑现时，返回的 Promise 也将被兑现（即使传入的是一个空的可迭代对象），并返回一个包含所有兑现值的数组。
   * 如果输入的任何 Promise 被拒绝，则返回的 Promise 将被拒绝，并带有第一个被拒绝的原因。
   */
  MyPromise.all = function (iterable) {
    const promises = [...iterable]
    const totalCount = promises.length

    return new MyPromise((resolve, reject) => {
      const results = []
      let completedCount = 0
      let isSettled = false

      promises.forEach((p, i) => {
        p.then(
          (value) => {
            results[i] = value
            completedCount++
            if (completedCount === totalCount) {
              resolve(results)
            }
          },
          (reason) => {
            if (!isSettled) {
              reject(reason)
            }
          },
        )
      })
    })
  }

  /**
   * 实现 ES 规范的 Promise.allSettled
   * Promise.allSettled() 静态方法将一个 Promise 可迭代对象作为输入，并返回一个单独的 Promise。
   * 当所有输入的 Promise 都已敲定时（包括传入空的可迭代对象时），返回的 Promise 将被兑现，并带有描述每个 Promise 结果的对象数组。
   */
  MyPromise.allSettled = function (iterable) {
    const promises = [...iterable]
    const totalCount = promises.length

    return new MyPromise((resolve, reject) => {
      const results = []
      let settledCount = 0

      promises.forEach((p, i) => {
        p.then(
          (value) => {
            results[i] = { status: FULFILLED, value }
            settledCount++
            if (settledCount === totalCount) {
              resolve(results)
            }
          },
          (reason) => {
            results[i] = { status: REJECTED, reason }
            settledCount++
            if (settledCount === totalCount) {
              resolve(results)
            }
          },
        )
      })
    })
  }

  /**
   * Promise.any() 静态方法将一个 Promise 可迭代对象作为输入，并返回一个 Promise。
   * 当输入的任何一个 Promise 兑现时，这个返回的 Promise 将会兑现，并返回第一个兑现的值。
   * 当所有输入 Promise 都被拒绝（包括传递了空的可迭代对象）时，它会以一个包含拒绝原因数组的 AggregateError 拒绝。
   */
  MyPromise.any = function (iterable) {
    const promises = [...iterable]
    const totalCount = promises.length

    return new MyPromise((resolve, reject) => {
      const errors = []
      let settledCount = 0
      let isSettled = false

      promises.forEach((p, i) => {
        p.then(
          (value) => {
            if (!isSettled) {
              resolve(value)
            }
          },
          (reason) => {
            errors[i] = reason
            settledCount++
            if (settledCount === totalCount) {
              reject(errors)
            }
          },
        )
      })
    })
  }

  /**
   * Promise.race() 静态方法接受一个 promise 可迭代对象作为输入，并返回一个 Promise。
   * 这个返回的 promise 会随着第一个 promise 的敲定而敲定。
   */
  MyPromise.race = function (iterable) {
    const promises = [...iterable]

    return new MyPromise((resolve, reject) => {
      let isSettled = false

      promises.forEach((p) => {
        p.then(
          (value) => {
            if (!isSettled) {
              isSettled = true
              resolve(value)
            }
          },
          (reason) => {
            if (!isSettled) {
              isSettled = true
              reject(reason)
            }
          },
        )
      })
    })
  }

  /**
   * Promise.withResolvers() 静态方法返回一个对象
   * 其包含一个新的 Promise 对象和两个函数，用于解决或拒绝它，对应于传入给 Promise() 构造函数执行器的两个参数。
   */
  MyPromise.withResolvers = function () {
    const resolvers = {}
    resolvers.promise = new MyPromise((resolve, reject) => {
      resolvers.resolve = resolve
      resolvers.reject = reject
    })
    return resolvers
  }

  /**
   * 测试是否符合 Promise/A+ 规范
   * Promise/A+ spec https://promisesaplus.com.cn/
   * promises-aplus-tests https://github.com/promises-aplus/promises-tests
   */
  MyPromise.deferred = function () {
    // const defer = {}
    // defer.promise = new MyPromise((resolve, reject) => {
    //   defer.resolve = resolve
    //   defer.reject = reject
    // })
    return MyPromise.withResolvers()
  }

  return MyPromise
})
