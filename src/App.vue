<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  beforeCreate () {
    console.log('before create, initialise store')
    this.$store.commit('initialiseStore')
  }
}
</script>

<style>
</style>
