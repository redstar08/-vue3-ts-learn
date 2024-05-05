interface Point {
  x: number
  y: number
  toString(): string
}

interface PointConstructor {
  new (x?: number, y?: number): Point
  // 无法同时实现 构造签名 和 调用签名
  // (x?: number, y?: number): Point
  // (point?: Point): Point
  create(x?: number, y?: number): Point
  create(point?: Point): Point
  readonly prototype: Point
}

class MyPoint implements Point {
  x: number
  y: number
  constructor(x?: number, y?: number) {
    this.x = x || 0
    this.y = y || 0
  }
  toString(): string {
    return `(${this.x}, ${this.y})`
  }
  static create(x?: number | Point, y?: number) {
    if (typeof x === 'number' && typeof y === 'number') {
      return new MyPoint(x, y)
    } else if (typeof x !== 'undefined' && x instanceof Object) {
      return new MyPoint(x.x, x.y)
    } else {
      return new MyPoint(0, 0)
    }
  }
}

const MyPointConstructor: PointConstructor = MyPoint
console.log('MyPointConstructor -> ', new MyPointConstructor())

// 测试调用签名
const point1 = MyPointConstructor.create(1, 2)
console.log(point1.toString()) // 输出：(1, 2)

const point2 = MyPointConstructor.create({ x: 3, y: 4 })
console.log(point2.toString()) // 输出：(5, 6)

// 测试实例签名
const point3 = new MyPointConstructor(5, 6)
console.log(point3.toString()) // 输出：(5, 6)
