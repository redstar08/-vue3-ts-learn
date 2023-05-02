// 单例模式
const CreateSignleton = () => {
  // 通过闭包实现(推荐)
  const SingletonCreator = () => {
    let instence: any = null
    return function (name: string): any {
      this.name = name
      if (instence) return instence
      return (instence = this)
    }
  }
  const Singleton: any = SingletonCreator()
  console.log('Signleton:', new Singleton('Signleton0'))
  console.log('Signleton:', new Singleton('Signleton1'))
}

CreateSignleton()

// 通过挂载原型对象实现
class Singleton {
  name: string = `随机实例${Math.floor(Math.random() * 10)}`
  constructor(name?: string) {
    if (typeof name === 'string') this.name = name
  }
  static instance: any = null
  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton()
    }
    return Singleton.instance
  }
}
console.log('Signleton:', new Singleton('SignletonA'))
console.log('Signleton:', new Singleton('SignletonB'))
