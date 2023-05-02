// 函数的柯里化

// let count = 0
// const cost = (money) => {
//   count += money
// }

// cost(100)
// cost(200)
// cost(300)

// console.log(count)

const cost = (() => {
  const args = []

  return function () {
    // 计算当前花销
    if (arguments.length === 0) {
      // let count = 0
      // args.forEach((money) => (count += money))
      return args.reduce((pre, cur) => (pre += cur), 0)
    } else {
      // [].push.apply(args, arguments)
      // args.push(...arguments)
      Array.prototype.push.apply(args, arguments)
    }
  }
})()

cost(100)
cost(200)
cost(300)

console.log(cost())

// uncurrying 让入参的首项 调用原函数并将剩余的项作为参数传递
Function.prototype.uncurrying = function () {
  let self = this
  return function () {
    const item = Array.prototype.shift(arguments) // 取出首项作为 item
    return self.apply(item, arguments) // 让 item 调用原函数
  }
}
// 类似效果
// const uncurrying = (fn, ...args) => {
//   fn(...args)
// }

/**
 * @description: 将函数柯里化的工具函数
 * @param {Function} fn 待柯里化的函数
 * @param {array} args 已经接收的参数列表
 * @return {Function}
 */
const currying = function (fn, ...args) {
  // fn需要的参数个数
  const len = fn.length
  // 返回一个函数接收剩余参数
  return function (...params) {
    // 拼接已经接收和新接收的参数列表
    let _args = [...args, ...params]
    // 如果已经接收的参数个数还不够，继续返回一个新函数接收剩余参数
    if (_args.length < len) {
      return currying.call(this, fn, ..._args)
    }
    // 参数全部接收完调用原函数
    return fn.apply(this, _args)
  }
}

const curryingFn = currying((a, b, c) => {
  return a + b + c
}, 100)

console.log(curryingFn(1)(2))

const trueCurrying = (fn, ...args) => {
  // 实际的有效参数, fn.length 代表需要的参数个数
  if (args.length >= fn.length) {
    return fn(...args)
  }
  return (...args2) => {
    return trueCurrying(fn, ...args, ...args2)
  }
}

const trueCurrying1 = trueCurrying((a, b, c) => {
  return a + b + c
}, 100)
console.log(trueCurrying1(200, 300))
