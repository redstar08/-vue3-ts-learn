<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { io, type Socket } from 'socket.io-client'

const EmitEventName = 'send-msg'

const SocketConnectCreator = () => {
  let socket: Socket | null = null

  return (): Socket => {
    if (socket?.id) {
      return socket
    }
    return (socket = io('ws://localhost:3000'))
  }
}

const getSocketConnect = SocketConnectCreator()

const textarea = ref('')

// 链接
const handleConnect = () => {
  const socket = getSocketConnect()

  // client-side
  socket.on('connect', () => {
    console.log('connect success: ', socket.id) // x8WIv7-mJelg7on_ALbx
  })

  socket.on(EmitEventName, (data) => {
    console.log(`emit:${EmitEventName} -> `, data)
  })
}

const handleDisConnect = () => {
  const socket = getSocketConnect()

  socket.on('disconnect', (reason) => {
    // ...
    console.log('disconnect -> ', reason) // undefined
  })

  socket.disconnect()
}

const handleSend = () => {
  const socket = getSocketConnect()

  const data = {
    msg: textarea.value,
  }

  console.log('handleSend -> socket', socket)
  socket.emit(EmitEventName, data)
  console.log('handleSend -> data', data)
}
</script>

<template>
  <div class="text-center">
    <h1 class="text-2xl">socket.io-client</h1>
    <el-divider></el-divider>

    <el-row class="mb-4">
      <el-button type="primary" @click="handleConnect">connect</el-button>
      <el-button @click="handleDisConnect">disconnect</el-button>
      <el-button type="success" @click="handleSend">send</el-button>
    </el-row>
  </div>

  <div>
    <el-input v-model="textarea" type="textarea" :row="8" placeholder="Please input" />
  </div>
</template>
