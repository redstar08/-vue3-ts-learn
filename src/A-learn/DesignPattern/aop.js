// 简单的 AOP 实现
// 装饰者模式
Function.prototype.before = function (beforeFn) {
  const _this = this
  return function () {
    beforeFn.apply(this, arguments)
    return _this.apply(this, arguments)
  }
}

Function.prototype.after = function (afterFn) {
  const _this = this
  return function () {
    const ret = _this.apply(this, arguments)
    afterFn.apply(this, arguments)
    return ret
  }
}

let demo = () => {
  console.log('demo')
}

demo = demo
  .before((arg) => {
    console.log('before', arg)
  })
  .after((arg) => {
    console.log('after', arg)
  })

demo('call')
