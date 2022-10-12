type Direction = "top" | "left"
type TweenjsEnum = "linear" | "easeIn" | "easeOut"
type Easing = (t: number, b: number, c: number, d: number) => number

export const tweenjs = {
  linear: (t: number, b: number, c: number, d: number): number => {
    return (c * t) / d + b
  },
  easeIn: (t: number, b: number, c: number, d: number): number => {
    return c * (t /= d) + b
  },
  easeOut: (t: number, b: number, c: number, d: number): number => {
    return -c * (t /= d) * (t - 2) + b
  },
}

export class Animate {
  dom: HTMLElement
  startTime: number
  startPos: number
  endPos: number
  propertyName: Direction
  duration: number
  easing: Easing

  constructor(dom: HTMLElement) {
    this.dom = dom
    this.startTime = 0
    this.startPos = 0
    this.endPos = 0
    this.propertyName = "top"
    this.duration = 300
    this.easing = tweenjs["linear"]
  }

  start(propertyName: Direction, endPos: number, duration: number, easing: TweenjsEnum): void {
    const dom: DOMRect = this.dom.getBoundingClientRect()
    this.startTime = Date.now()
    this.propertyName = propertyName
    this.startPos = dom[propertyName]
    this.endPos = endPos
    this.duration = duration
    this.easing = tweenjs[easing]

    const timerId = setInterval(() => {
      if (this.step() === false) {
        clearInterval(timerId)
      }
    }, 16)
  }

  step(): boolean {
    const t = Date.now()
    // 动画结束-移动到最终位置(有可能有一些微小的位置差别)
    if (t >= this.startTime + this.duration) {
      this.update(this.endPos)
      return false
    }
    // 计算新的位置
    const pos = this.easing(t - this.startTime, this.startPos, this.endPos - this.startPos, this.duration)
    this.update(pos)

    return true
  }

  update(pos: number): void {
    this.dom.style[this.propertyName] = pos + "px"
  }
}
