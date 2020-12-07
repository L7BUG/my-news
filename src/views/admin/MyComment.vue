<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人管理</el-breadcrumb-item>
      <el-breadcrumb-item>我的评论</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>

      <el-table
        border
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          width="100"
          label="评论id"
          prop="id">
        </el-table-column>
        <el-table-column
          label="评论内容"
          prop="content">
        </el-table-column>
        <el-table-column
          label="发表用户"
          prop="user.username">
        </el-table-column>
        <el-table-column
          label="新闻标题"
          prop="mnew.title">
        </el-table-column>
        <el-table-column
          width="160"
          label="评论时间">
          <template slot-scope="scope">
            {{new Date(scope.row.publishTime).toLocaleString()}}
          </template>
        </el-table-column>

        <el-table-column
          width="150"
          label="评论操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="editRow(scope.row)"
              type="primary">编辑
            </el-button>
            <el-button
              size="mini"
              @click="deleteRow(scope.row)"
              type="danger">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改评论" :visible.sync="dialogUpdate">
      <el-form :model="updateForm" :rules="addRules" ref="updateForm">
        <el-form-item label="内容" prop="content">
          <el-input v-model="updateForm.content" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户id" prop="user.id">
          <el-input v-model="updateForm.user.id" clearable></el-input>
        </el-form-item>
        <el-form-item label="新闻id" prop="mNew.id">
          <el-input v-model="updateForm.mNew.id" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateComment()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MyComment',
  data () {
    return {
      myUser: JSON.parse(sessionStorage.getItem('user')),
      tableData: [],
      addRules: {
        content: [
          { required: true, message: '请输入评论信息', trigger: 'blur' },
          { min: 2, message: '最少两个字符', trigger: 'blur' }
        ],
        user: {
          id: [
            { required: true, message: '请输入用户id', trigger: 'change' }
          ]
        },
        mNew: {
          id: [
            { required: true, message: '请输入新闻id', trigger: 'change' }
          ]
        }
      },
      dialogUpdate: false,
      updateForm: {
        id: null,
        content: null,
        user: {
          id: null
        },
        mNew: {
          id: null
        }
      }
    }
  },
  methods: {
    select () {
      this.$axios.post('comment/query/' + 1, {
        pageShowNumber: 999999,
        user: this.myUser
      })
        .then(resp => {
          this.tableData = resp.data.data.data
        })
    },
    editRow (row) {
      console.log(row)
      this.dialogUpdate = true
      this.updateForm.id = row.id
      this.updateForm.mNew.id = row.mnew.id
      this.updateForm.content = row.content
      this.updateForm.user.id = row.user.id
    },
    deleteRow (row) {
      this.$axios.delete('comment/delete/' + row.id)
        .then(resp => {
          if (resp.data.code === 200) {
            this.$notify.success({
              title: '删除成功!code:' + resp.data.code,
              message: 'message:' + resp.data.message
            })
            this.select(this.selectForm)
          } else {
            this.$notify.warning({
              title: '删除失败!code:' + resp.data.code,
              message: 'message:' + resp.data.message
            })
          }
        })
    },
    updateComment () {
      this.$refs.updateForm.validate(bool => {
        if (bool) {
          this.$axios.put('comment/update', this.updateForm)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$notify.success({
                  title: '修改成功!code:' + resp.data.code,
                  message: 'message:' + resp.data.message
                })
                this.select(this.selectForm)
              } else {
                this.$notify.warning({
                  title: '修改失败!code:' + resp.data.code,
                  message: 'message:' + resp.data.message
                })
              }
              this.dialogUpdate = false
            })
        } else {
          this.$message.error('请正确输入')
        }
      })
    }
  },
  created () {
    this.select()
  }
}
</script>

<style scoped>

</style>
