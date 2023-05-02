// 生成器对象是由一个 generator function 返回的，并且它符合可迭代协议和迭代器协议。

function* generator(preffix: string) {
  let count = 0
  while (count < 5) {
    yield `${preffix}${count++}`
  }
  return 'hongxin'
}

const gen = generator('uuid-')

console.log(gen)
console.log(gen.next().value)
console.log(gen.next().value)

console.log(gen.next())

console.log(gen.next().value)
console.log(gen.next().value)

console.log(gen.next())
console.log(gen.next())
