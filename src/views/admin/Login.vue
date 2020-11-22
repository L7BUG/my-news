<template>
    <div class="login_container">
        <div class="login_box">
            <!--        头像-->
            <div class="avatar_box">
                <img src="../../assets/images/login.jpg">
            </div>
            <!--        表单区域-->
            <el-form
                :rules="loginFormRules"
                ref="loginFormRef"
                label-width="0px"
                class="login_from"
                :model="loginForm">

                <!--          用户名-->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-username" v-model="loginForm.username"/>
                </el-form-item>
                <!--          密码-->
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-mima" type="password" v-model="loginForm.password"/>
                </el-form-item>
                <!--          按钮-->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      // 表单数据
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 数据验证
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置，移除校验结果并且初始化
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录按钮事件
    login () {
      this.$message.success('登陆成功')
      this.$router.push('/admin')
    }
  }
}
</script>

<style scoped lang="less">
.login_container {
    background-color: #006266;
    height: 100%;
}

.login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
        height: 130px;
        width: 130px;
        border: 1px solid #ccc;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;

        img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
}

.btns {
    display: flex;
    justify-content: flex-end;
}

.login_from {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
</style>
