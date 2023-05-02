<script setup lang="ts">
import { ref } from 'vue'
import { io } from 'socket.io-client'

const textarea = ref('')

// 链接
const handleConnect = () => {
  const socket = io('http://localhost:3000')

  // client-side
  socket.on('connect', () => {
    console.log(socket.id) // x8WIv7-mJelg7on_ALbx
  })

  socket.on('disconnect', () => {
    console.log(socket.id) // undefined
  })
}
</script>

<template>
  <div class="text-center">
    <h1 class="text-24 underline">socket.io-client</h1>
    <el-divider></el-divider>

    <el-row class="mb-4">
      <el-button type="primary" @click="handleConnect">connect</el-button>
      <el-button>disconnect</el-button>
    </el-row>
  </div>

  <div>
    <el-input v-model="textarea" type="textarea" :row="8" placeholder="Please input" />
  </div>
</template>
