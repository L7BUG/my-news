<template>
  <div>
    <h1>
      <router-link to="/login">后台管理</router-link>
      <button @click="test">test json</button>
    </h1>
  </div>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    test () {
      this.$axios.post('test', {
        name: 123
      }).then(response => {
        console.log(response.data)
      })
    }
  }
}
</script>

<style scoped>

</style>
