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
      const c = {
        username: 'admin',
        password: '123456'
      }

      this.$axios.post('admin/postJSON', c, {
        headers: {
          'Content-Type': 'text/plain;charset=UTF-8'
        }
      }).then(response => {
        console.log(response.data)
      })
    }
  }
}
</script>

<style scoped>

</style>
