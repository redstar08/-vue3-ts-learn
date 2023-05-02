// 继承的几种方式
// 一、原型链继承
// 大致思路：将子类的 prototype 指向父类的实例
const PrototypeExtends = () => {
  function Father(name) {
    this.name = name || 'Father'
    this.colors = ['red', 'blue', 'green']
  }

  Father.prototype.sayName = function () {
    console.log(this.name)
    return this.name
  }

  function Son(name, age) {
    this.myName = name
    this.age = age
  }
  // 继承
  Son.prototype = new Father()
  // 必须先继承，再扩展，因为重写了 prototype
  Son.prototype.sayMyName = function () {
    console.log(this.myName)
    return this.myName
  }

  const son = new Son('Son', 18)
  son.sayName()
  son.sayMyName()
  console.log(son)
}
// PrototypeExtends()
// 缺点：
// 1.所有子类实例共享 引用类型 的属性(colors)
// 2.创建子类实例时，无法向父类构造函数传参(name)

// 二、借用构造函数
// 大致思路：在子类中借用并执行父类构造函数
const ConstructorExtends = () => {
  function Father(name) {
    this.name = name || 'Father'
    this.colors = ['red', 'blue', 'green']
    this.sayName = function () {
      console.log(this.name)
      return this.name
    }
  }

  function Son(name, age) {
    // 继承
    Father.call(this, name)
    this.age = age
  }

  const son = new Son('Son', 18)
  son.sayName()
  console.log(son)
}
// ConstructorExtends()
// 缺点：
// 1.所有子类实例都生成自身的公共函数，没有做到函数共享

// 三、组合继承
// 大致思路：原型属性和方法通过原型链继承，实例属性通过借用构造函数继承
// 避免了原型链和借用构造函数的缺点，融合了两者的优点，是最常用的 JavaScript 的继承模式
const CombineExtends = () => {
  function Father(name) {
    this.name = name || 'Father'
    this.colors = ['red', 'blue', 'green']
  }

  Father.prototype.sayName = function () {
    console.log(this.name)
    return this.name
  }

  function Son(name, age) {
    // 继承实例属性
    Father.call(this, name)
    this.age = age
  }
  // 继承原型方法
  Son.prototype = new Father()
  Son.prototype.constructor = Son
  // 必须先继承，再扩展，因为重写了 prototype
  Son.prototype.sayAge = function () {
    console.log(this.age)
    return this.age
  }

  const son = new Son('Son', 18)
  son.sayName()
  son.sayAge()
  console.log(son)
}
// CombineExtends()
// 缺点：
// 1.需要调用 2次 父构造函数

// 四、原型式继承
// 大致思路：通过 Object.create() 进行浅拷贝
const PrototypalExtends = () => {
  // 与 Object.create() 的行为相同
  function createObject(object) {
    function Fn() {}
    // 继承 object
    Fn.prototype = object
    return new Fn()
  }

  const person = {
    name: 'redstar08',
    friends: ['linju', 'zhouyu', 'xiaohong'],
  }
  const p1 = createObject(person)
  // const p1 = Object.create(person)
  p1.name = 'p1'
  p1.friends.push('p1')

  const p2 = createObject(person)
  // const p2 = Object.create(person)
  p2.name = 'p2'
  p2.friends.push('p2')

  console.log(person, p1, p2)
}
// PrototypalExtends()
// 缺点：
// 1.只适合继承某个对象的属性和方法，引用类型 会共享

// 五、寄生式继承
// 大致思路：通过 原型式继承 封装成一个工厂函数，在工厂函数中通过某种方式增强这个对象
const ParasiticExtends = () => {
  // 封装工厂函数
  function createPerson(person) {
    // 原型式继承
    const clonePerson = Object.create(person)
    // 增强对象
    clonePerson.sayName = function () {
      console.log(this.name)
      return this.name
    }
    return clonePerson
  }

  const person = {
    name: 'redstar08',
    friends: ['linju', 'zhouyu', 'xiaohong'],
  }
  const p1 = createPerson(person)
  p1.name = 'p1'
  p1.friends.push('p1')
  p1.sayName()

  const p2 = createPerson(person)
  p2.name = 'p2'
  p2.friends.push('p2')
  p2.sayName()

  console.log(person, p1, p2)
}
ParasiticExtends()
// 缺点：
// 1.只适合继承某个对象的属性和方法，引用类型 会共享
// 2.同构造函数类似，无法做到函数复用

// 六、寄生组合式继承（圣杯模式）
// 大致思路：通过 原型式继承 继承父类的方法，通过构造函数继承实例属性
const InheritPrototype = () => {
  const Inherit = function (Son, Father) {
    // 创建 super 类原型的副本
    // function Fn() {}
    // Fn.prototype = Father.prototype
    // const prototype = new Fn()
    const prototype = Object.create(Father.prototype)
    // 增强对象
    prototype.constructor = Son
    prototype.uber = Father
    // 继承
    Son.prototype = prototype
  }

  function Father(name) {
    this.name = name || 'Father'
    this.colors = ['red', 'blue', 'green']
  }

  Father.prototype.sayName = function () {
    console.log(this.name)
    return this.name
  }

  function Son(name, age) {
    Father.call(this, name)
    this.age = age
  }

  // 继承
  Inherit(Son, Father)
  // 扩展
  Son.prototype.sayAge = function () {
    console.log(this.age)
    return this.age
  }

  const son = new Son('Son', 18)
  son.sayName()
  son.sayAge()
  son.colors.push('yellow')
  console.log(son, new Son('Son1', 19))
}
// 圣杯模式，最完美的继承方案
InheritPrototype()
