// 手写 Awaited
type Thenable<T = unknown> = {
  then: (onfulfilled: (arg: T) => unknown) => unknown
}

type MyAwaited<T> = T extends Promise<infer P>
  ? P extends Promise<any>
    ? MyAwaited<P>
    : P
  : T extends Thenable<infer A>
  ? A
  : never

// 测试用例
type X = Promise<string>
type Y = Promise<{ field: number }>
type Z = Promise<Promise<string | number>>
type Z1 = Promise<Promise<Promise<string | boolean>>>
type T = { then: (onfulfilled: (arg: number) => any) => any }

// 官方 Utility Types 的 Awaited
type AwaitedX = Awaited<X>
type AwaitedY = Awaited<Y>
type AwaitedZ = Awaited<Z>
type AwaitedZ1 = Awaited<Z1>
type AwaitedT = Awaited<T>

// MyAwaitedX
type MyAwaitedX = MyAwaited<X>
type MyAwaitedY = MyAwaited<Y>
type MyAwaitedZ = MyAwaited<Z>
type MyAwaitedZ1 = MyAwaited<Z1>
type MyAwaitedT = MyAwaited<T>
