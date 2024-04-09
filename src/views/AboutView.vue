<template>
  <div class="about">
    <h1>This is an about page</h1>
    <my-popup-box a="1" data-text="data-text.data-text.data-text12312312312312312312312">
      popup-box-content
    </my-popup-box>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
}
</style>
