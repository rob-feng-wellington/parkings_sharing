<template>
  <div id="app">
    <nav-component></nav-component>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Nav from './components/Nav'
export default {
  name: 'app',
  components: {
    'nav-component': Nav
  }
}
</script>
<style>
.main-content {
  padding-top: 40px;
}
</style>
