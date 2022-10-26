<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'

const state = reactive({ count: 0, item: { a: 1, b: 2 } })

// n 是一个局部变量，同 state.count
// 失去响应性连接
let n = state.count
// 不影响原始的 state
n++

// count 也和 state.count 失去了响应性连接
let { count, item } = state
// 不会影响原始的 state
count++
item.a++
// 该函数接收一个普通数字，并且
// 将无法跟踪 state.count 的变化
const callSomeFunction = (count: any) => {
  console.log('callSomeFunction -> ', count)
}
callSomeFunction(state.count)

const obj = {
  foo: ref(1),
  bar: ref(2),
}

// 该函数接收一个 ref
// 需要通过 .value 取值
// 但它会保持响应性
callSomeFunction(obj.foo)

// 仍然是响应式的
let { foo, bar } = obj
foo.value++
// 生命周期钩子
onMounted(() => {
  console.log('`The state.count is: `', n, count, item)
})
const checkedNames = ref([])
const msg = ref('')
// 等价于直接绑定 checkedNames.names
// const checkedNames = reactive({ names: [] })

const handleChange = (value: any) => {
  console.log('handleChange -> ', value)
}
</script>

<template>
  <div>I am a DemoView: {{ count }} {{ item }} {{ obj }}</div>
  <el-button @click="() => item.a++">click me</el-button>

  <div>Checked names: {{ checkedNames }}</div>

  <el-checkbox-group v-model="checkedNames" @change="handleChange">
    <el-checkbox label="Option A" />
    <el-checkbox label="Option B" />
    <el-checkbox label="Option C" />
    <el-checkbox label="disabled" disabled />
  </el-checkbox-group>
  <div>{{ msg }}</div>

  <input v-model="msg" />
</template>

<style lang="scss"></style>
