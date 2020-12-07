<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>评论管理</el-breadcrumb-item>
      <el-breadcrumb-item>查看评论</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="success" icon="el-icon-search" plain size="mini" @click="dialogAdd = true">增加评论</el-button>
        <el-button type="warning" icon="el-icon-delete" plain size="mini" @click="deleteSelection()">删除评论</el-button>
      </el-row>
      <!--      搜索区域-->
      <el-row>
        <el-form :inline="true" :model="selectTemp" class="demo-form-inline">
          <el-form-item label="评论内容">
            <el-input v-model="selectTemp.content" placeholder="内容" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="评论id">
            <el-input type="number" v-model="selectTemp.id" placeholder="评论id" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="用户id">
            <el-input type="number" v-model="selectTemp.user.id" placeholder="新闻id" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="succ ess" size="mini" icon="el-icon-search" plain @click="selectClick()">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-table
        border
        @selection-change="selectionChange"
        :data="tableData.data"
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

      <el-row>
        <el-pagination
          @size-change="setPageShowNumber"
          @current-change="handleCurrentChange"
          :current-page="tableData.page"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="selectForm.pageShowNumber"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.maxPageNumber">
        </el-pagination>
      </el-row>
    </el-card>
    <!--      添加评论弹框-->
    <el-dialog title="添加评论" :visible.sync="dialogAdd">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="内容" prop="content">
          <el-input v-model="addForm.content" clearable></el-input>
        </el-form-item>
        <el-form-item label="用户id" prop="user.id">
          <el-input v-model="addForm.user.id" clearable></el-input>
        </el-form-item>
        <el-form-item label="新闻id" prop="mNew.id">
          <el-input v-model="addForm.mNew.id" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="addComment()">确 定</el-button>
      </div>
    </el-dialog>
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
  name: 'Comment',
  data () {
    return {
      tableData: {
        data: [
          {
            id: 1,
            user: {
              username: '假数据'
            },
            mNew: {
              title: '假数据'
            },
            content: '假数据',
            publishTime: null
          }
        ],
        maxPageNumber: 2000,
        page: 1
      },
      // 查询条件
      selectForm: {
        content: null,
        id: null,
        user: {
          id: null
        },
        pageShowNumber: 5
      },
      // 临时查询条件 最后会赋值给 selectForm
      selectTemp: {
        content: null,
        id: null,
        user: {
          id: null
        }
      },
      dialogAdd: false,
      addForm: {
        content: null,
        user: {
          id: null
        },
        mNew: {
          id: null
        }
      },
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
      },
      selection: null
    }
  },
  methods: {
    select (selectForm) {
      this.$axios.post('comment/query/' + this.tableData.page, selectForm)
        .then(resp => {
          if (resp.data.code === 200) {
            console.log(resp.data)
            this.tableData.data = resp.data.data.data
            this.tableData.maxPageNumber = resp.data.data.maxPageNumber
          }
        })
    },
    selectionChange (selection) {
      this.selection = selection
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
    setPageShowNumber (val) {
      this.selectForm.pageShowNumber = val
      this.select(this.selectForm)
    },
    handleCurrentChange (val) {
      this.tableData.page = val
      this.select(this.selectForm)
    },
    selectClick () {
      this.selectForm.content = this.selectTemp.content
      this.selectForm.id = this.selectTemp.id
      this.selectForm.user = this.selectTemp.user
      this.select(this.selectForm)
    },
    addComment () {
      this.$refs.addForm.validate(bool => {
        if (bool) {
          this.$axios.post('comment/add', this.addForm)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$notify.success({
                  title: '添加成功!code:' + resp.data.code,
                  message: 'message:' + resp.data.message
                })
                this.select(this.selectForm)
              } else {
                this.$notify.warning({
                  title: '添加失败!code:' + resp.data.code,
                  message: 'message:' + resp.data.message
                })
              }
              this.dialogAdd = false
            })
        } else {
          this.$message.error('请正确输入')
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
    },
    deleteSelection () {
      this.$axios.delete('comment/delete', {
        data: this.selection
      }
      ).then(resp => {
        if (resp.data.code === 200) {
          this.$notify.success({
            title: '成功!code:' + resp.data.code,
            message: 'message:' + resp.data.message
          })
          this.select(this.selectForm)
        } else {
          this.$notify.warning({
            title: '失败!code:' + resp.data.code,
            message: 'message:' + resp.data.message
          })
        }
        this.dialogUpdate = false
      })
    }
  },
  created () {
    this.select(this.selectForm)
  }
}
</script>

<style scoped>

</style>
