<template>
<div>
  <p>欢迎!{{user.username}}</p>
  <p>您的权限为{{user.role.name}}</p>
  <p>权限介绍:{{user.role.remark}}</p>
</div>
</template>

<script>
export default {
  name: 'Welcome',
  data () {
    return {
      user: ''
    }
  },
  created () {
    this.user = JSON.parse(sessionStorage.getItem('user'))
    console.log(this.user)
  }
}
</script>

<style scoped>

</style>
