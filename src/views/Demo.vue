<template>
  <div class="container">
    <div>I am a Demo: {{ msg }}</div>
    <input v-model="msg" />
  </div>
</template>

<script lang="js">
export default {
  data() {
    return {
      msg: 'hello',
    }
  },
  methods: {


  },
  computed: {

  }
}
</script>

<style lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  text-align: center;

  div {
    margin: 20px auto;
  }
}
</style>
