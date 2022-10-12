<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Animate } from '@/utils/animate'
// 响应式状态
const animateDom = ref()
// 用来修改状态、触发更新的函数

const handleStart = () => {
  const animate = new Animate(animateDom.value)
  animate.start('left', 1000, 1000, 'easeIn')
  setTimeout(() => {
    animate.start('left', 0, 1000, 'easeIn')
  }, 2000)
}

// 生命周期钩子
onMounted(() => {
  console.log('`The initial animateDom is: `', animateDom.value)
})
</script>

<template>
  <div
    ref="animateDom"
    class="w-100px h-100px text-white bg-blue-500 flex flex-col justify-center items-center absolute top-0 left-0"
  >
    I am a box
  </div>
  <button @click="handleStart" class="w-50px h-50px text-white bg-blue-500 flex flex-col justify-center items-center">
    start
  </button>
</template>

<style lang="scss"></style>
