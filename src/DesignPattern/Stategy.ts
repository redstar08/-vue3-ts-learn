// Strategy Pattern 策略模式 (用于解决多if-else分支结构的问题)
// 策略模式定义：定义一系列算法，把它们一个个的封装起来，并且使它们可以相互替换
// 1.定义一系列算法
const add = (x: number, y: number): number => {
  return x + y
}

const sub = (x: number, y: number): number => {
  return x - y
}
const muti = (x: number, y: number): number => {
  return x * y
}
const divi = (x: number, y: number): number => {
  return x / y
}

// 委托让 Context 拥有执行的能力
class Executor {
  strategy: any
  constructor() {
    this.strategy = null
  }

  setStrategy(func: any): void {
    this.strategy = func
  }

  execute(x: number, y: number): number {
    return this.strategy(x, y)
  }
}

const Context = new Executor()

Context.setStrategy(add)
console.log(Context.execute(6, 3))

Context.setStrategy(sub)
console.log(Context.execute(6, 3))

Context.setStrategy(muti)
console.log(Context.execute(6, 3))

Context.setStrategy(divi)
console.log(Context.execute(6, 3))

export {}
