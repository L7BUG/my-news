<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-form label-position="top" label-width="80px" :model="updatePassword" :rules="pwdRef" ref="pwdUpdate">
        <el-form-item label="名称">
          <el-input v-model="updatePassword.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="updatePassword.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="rPassword">
          <el-input v-model="updatePassword.rPassword" type="password"></el-input>
        </el-form-item>
        <el-button @click="put(updatePassword)">确认修改</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'AdminPassword',
  data () {
    return {
      updatePassword: {
        id: JSON.parse(sessionStorage.getItem('user')).id,
        username: JSON.parse(sessionStorage.getItem('user')).username,
        password: '',
        rPassword: ''
      },
      pwdRef: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度最少6个字符', trigger: 'blur' }
        ],
        rPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { min: 6, message: '长度最少6个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    put (role) {
      this.$refs.pwdUpdate.validate(bool => {
        if (bool) {
          if (role.rPassword === role.password) {
            this.$axios.put('user/password', role)
              .then(resp => {
                if (resp.data.code === 200) {
                  this.$notify.success({
                    title: resp.data.code,
                    message: resp.data.message + '\t请重新登陆'
                  })
                  sessionStorage.removeItem('user')
                  this.$router.push('/admin/')
                } else {
                  this.$notify.warning({
                    title: resp.data.code,
                    message: resp.data.message
                  })
                }
              })
          } else {
            this.$notify.warning({
              title: '警告！',
              message: '两次密码不一致'
            })
          }
        } else {
          this.$notify.warning({
            title: '警告！',
            message: '请正确填写密码'
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
