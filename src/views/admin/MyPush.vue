<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人管理</el-breadcrumb-item>
      <el-breadcrumb-item>我发布的</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-table
        border
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="新闻 ID:">
                <span>{{ props.row.id }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="内容:">
                <span>{{ props.row.content }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="浏览次数:">
                <span>{{ props.row.clicks }}</span>
              </el-form-item>
            </el-form>
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="状态:">
                <span>{{ props.row.publishStatus === '1' ? '发布' : '删除' }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="新闻标题"
          prop="title">
        </el-table-column>
        <el-table-column
          label="作者"
          prop="user.username">
        </el-table-column>
        <el-table-column
          width="100"
          label="新闻类别"
          prop="category.name">
        </el-table-column>
        <el-table-column
          width="160"
          label="发布时间">
          <template slot-scope="scope">
            {{new Date(scope.row.publishTime).toLocaleString()}}
          </template>
        </el-table-column>

        <el-table-column
          width="150"
          label="角色操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="editRow(scope.row)"
              type="primary">编辑
            </el-button>
            <el-button
              size="mini"
              @click="deleteRow(scope.row.id)"
              type="danger">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="修改新闻" :visible.sync="dialogUpdate">
      <el-form :model="updateForm" :rules="addRules" ref="updateForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="updateForm.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属类别" prop="category.id">
          <el-select v-model="updateForm.category.id" clearable placeholder="请选择">
            <el-option
              v-for="item in categorys"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="updateForm.content" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateRow()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MyPush',
  data () {
    return {
      myUser: JSON.parse(sessionStorage.getItem('user')),
      tableData: [

      ],
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
        ]
      },
      dialogUpdate: false,
      updateForm: {
        title: null,
        category: {
          id: null
        },
        user: {
          id: null
        },
        content: null
      },
      // 类别
      categorys: [
        {
          id: 1,
          name: '假数据'
        }
      ]
    }
  },
  methods: {
    select () {
      this.$axios.post('new/query', {
        user: this.myUser
      })
        .then(resp => {
          console.log(resp.data)
          if (resp.data.code === 200) {
            this.tableData = resp.data.data
          }
        })
    },
    editRow (row) {
      this.dialogUpdate = true
      this.updateForm = row
    },
    deleteRow (id) {
      this.$confirm('是否删除？此操作会删除相关评论信息', '警告！')
        .then(_ => {
          this.$axios.delete('new/delete/' + id)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$notify.success({
                  title: '删除成功' + resp.data.code,
                  message: resp.data.message
                })
                this.select()
              } else {
                this.$notify.warning({
                  title: '删除失败' + resp.data.code,
                  message: resp.data.message
                })
              }
            })
        })
        .catch(_ => {
          this.$notify.info({
            title: '取消删除'
          })
        })
    },
    updateRow () {
      this.$refs.updateForm.validate(bool => {
        if (bool) {
          this.$axios.put('new/update', this.updateForm)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$notify.success({
                  title: '修改成功 code:' + resp.data.code,
                  message: 'message' + resp.data.message
                })
                this.select()
              } else {
                this.$notify.warning({
                  title: '修改失败 code:' + resp.data.code,
                  message: 'message:' + resp.data.message
                })
              }
            })
          this.dialogUpdate = false
        } else {
          this.$message.error('请正确输入')
        }
      })
    }
  },
  created () {
    this.$axios.get('category/queryAll')
      .then(resp => {
        if (resp.data.code === 200) {
          this.categorys = resp.data.data
        }
      })
    this.select()
  }
}
</script>

<style scoped>

</style>
