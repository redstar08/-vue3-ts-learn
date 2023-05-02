const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function promise(executor) {
  // 保存 this
  var _this = this
  // 初始状态为 PENDING
  _this.status = PENDING
  // 存放执行成功的结果，默认为 undefined
  _this.result = undefined
  // 存放执行失败的理由，默认为 undefined
  _this.reason = undefined
  // 收集执行成功和执行失败的回调
  _this.onResolvedCallbacks = []
  _this.onRejectedCallbacks = []

  // 执行成功的回调
  var resolve = function (result) {
    // 只有 PENDING 状态才能改变为其他状态
    if (_this.status === PENDING) {
      _this.status = FULFILLED
      _this.result = result
      _this.onResolvedCallbacks.forEach(function (callback) {
        callback && callback()
      })
    }
  }

  // 执行失败的回调
  var reject = function (reason) {
    // 只有 PENDING 状态才能改变为其他状态
    if (_this.status === PENDING) {
      _this.status = REJECTED
      _this.reason = reason
      _this.onRejectedCallbacks.forEach(function (callback) {
        callback && callback()
      })
    }
  }

  try {
    // 立即执行构造者
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
}

promise.prototype.then = function (onResolved, onRejected) {
  var _this = this
  if (this.status === FULFILLED) {
    onResolved(this.result)
  }
  if (this.status === REJECTED) {
    onRejected(this.reason)
  }
  if (this.status === PENDING) {
    this.onResolvedCallbacks.push(function () {
      onResolved(_this.result)
    })
    this.onRejectedCallbacks.push(function () {
      onRejected(_this.reason)
    })
  }
}

const p1 = new promise(function (resolve, reject) {
  // resolve("成功")
  // reject("失败")
  setTimeout(() => {
    resolve('成功')
    reject('失败')
  }, 1000)
}).then(
  function (data) {
    console.log(data)
  },
  function (err) {
    console.log(err)
  },
)
