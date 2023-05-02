// 迭代器模式: 土工一种方法顺序访问一个数据的各个元素，无需暴露对象的内部表示

// 1.内部迭代器
// 在内部定义好迭代规则
const myForEach = function <T>(array: Array<T>, fn: (item?: T, index?: number, array?: Array<T>) => void) {
  const length = array.length
  for (let index = 0; index < length; index++) {
    const item = array[index]
    fn(item, index, array)
  }
}

myForEach([{ name: 1 }, { age: 2 }, '3'], (item) => {
  console.log(item)
})

// 2.外部迭代器
// 显示的请求下一个迭代（比如 Generator 的 yield ）
const outIterator = function <T>(array: Array<T>) {
  let current = 0
  console.log(arguments)

  const next = () => {
    current++
  }

  const isDone = () => current >= array.length

  const getCurrentItem = () => array[current]

  return { next, isDone, getCurrentItem, length: array.length }
}

// 增加一些调用的复杂度
const iterator1 = outIterator([1, 2, 3, 4])

const myIteratorFunc = (iterator: any) => {
  while (!iterator.isDone()) {
    console.log(iterator.getCurrentItem())
    // 显示的进行下一次迭代
    iterator.next()
  }
}
myIteratorFunc(iterator1)
