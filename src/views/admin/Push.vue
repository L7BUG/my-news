<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人管理</el-breadcrumb-item>
      <el-breadcrumb-item>发布文章</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>

      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属类别" prop="category.id">
          <el-select v-model="addForm.category.id" clearable placeholder="请选择">
            <el-option
              v-for="item in categorys"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="addForm.content" clearable type="textarea"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addNew()">发布</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Push',
  data () {
    return {
      myUser: JSON.parse(sessionStorage.getItem('user')),
      addForm: {
        title: null,
        category: {
          id: null
        },
        user: {
          id: null
        },
        content: null
      },
      addRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        category: {
          id: [
            { required: true, message: '请选择类别', trigger: 'change' }
          ]
        },
        user: {
          id: [
            { required: true, message: '请输入用户id', trigger: 'blur' }
          ]
        },
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' },
          { min: 3, message: '最少三个字符', trigger: 'blur' }
        ],
        categorys: []
      },
      categorys: null
    }
  },
  methods: {
    addNew () {
      this.$refs.addForm.validate(bool => {
        if (bool) {
          this.$axios.post('new/add', this.addForm)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$notify.success({
                  title: '新增成功:' + resp.data.code,
                  message: resp.data.message
                })
                this.$refs.addForm.resetFields()
              } else {
                this.$notify.warning({
                  title: '新增失败:' + resp.data.code,
                  message: resp.data.message
                })
              }
            })
          this.dialogAddNew = false
        } else {
          this.$message.error('请正确输入')
        }
      })
    }
  },
  created () {
    // 查询所有类别
    this.$axios.get('category/queryAll')
      .then(resp => {
        if (resp.data.code === 200) {
          this.categorys = resp.data.data
        }
      })
    console.log(this.myUser)
    this.addForm.user.id = this.myUser.id
  }
}
</script>

<style scoped>

</style>
