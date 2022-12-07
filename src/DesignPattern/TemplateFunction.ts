/**
 * @description 模板方法模式
 * @example
 * @comments 模板方法模式（比如脚手架就是一个模板方法模式），设计模式的核心其实是将变化和不变的分离开
 * 模板方法模式可以将一些对象的共性行为提升到父类中，将不同的行为留给子类实现，不一定非得需要继承来实现模板方法模式
 * javascript 中没有抽象类，可以通过抛出异常在运行时模拟“接口检查”
 * 通过钩子方法 hooks 可以实现一些默认的行为
 * 在 javascript 中比起模板方法模式，高阶函数是更好的选择
 */

class Beverage {
  init() {
    this.boilWater()
    this.brew()
    this.pourInCup()
    if (this.customerWantsCondiments()) {
      this.addCondiments()
    }
  }

  boilWater() {
    console.log('把水煮沸')
  }

  brew() {
    throw new Error('Please override brew function!')
  }

  pourInCup() {
    console.log('把饮料倒进杯子里')
  }

  addCondiments() {
    throw new Error('Please override addCondiments function!')
  }

  customerWantsCondiments() {
    return true
  }
}

class Coffee extends Beverage {
  brew() {
    console.log('沸水冲泡咖啡')
  }

  addCondiments() {
    console.log('加糖和牛奶')
  }
}

class CoffeeWithoutCondiments extends Beverage {
  brew() {
    console.log('沸水冲泡咖啡')
  }

  customerWantsCondiments() {
    return false
  }
}

const coffee1 = new Coffee()
const coffee2 = new CoffeeWithoutCondiments()

const start = () => {
  coffee1.init()
  console.log('-------------华丽的分割线-------------')

  coffee2.init()
}

start()

// 不一定用继承

const Drink = (params: any) => {
  const F = function () {}

  const boilWater =
    params.boilWater ||
    function () {
      console.log('把水煮沸')
    }
  const brew =
    params.brew ||
    function () {
      throw new Error('Please override brew function!')
    }
  const pourInCup =
    params.pourInCup ||
    function () {
      console.log('把饮料倒进杯子里')
    }
  const addCondiments =
    params.addCondiments ||
    function () {
      throw new Error('Please override addCondiments function!')
    }

  F.prototype.init = function () {
    boilWater()
    brew()
    pourInCup()
    addCondiments()
  }
  return F
}

const CoffeeNoExtends: any = Drink({
  brew() {
    console.log('沸水冲泡咖啡')
  },
  addCondiments() {
    console.log('加糖和牛奶')
  },
})
console.log('-------------华丽的分割线-------------')

const coffeeNoExtends1 = new CoffeeNoExtends()
coffeeNoExtends1.init()
