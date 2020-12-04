<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>新闻管理</el-breadcrumb-item>
      <el-breadcrumb-item>类别管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="success" @click="dialogAdd = true">添加类别</el-button>
      </el-row>

      <el-table
        border
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%">

        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
          prop="id"
          label="类别ID"
          width="70">
        </el-table-column>

        <el-table-column
          label="类别名称">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>

        <el-table-column
          width="150"
          label="栏目操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="editRow(scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteRow(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>
    <!--      添加类别弹框-->
    <el-dialog title="添加类别" :visible.sync="dialogAdd">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="addTag(addForm)">确 定</el-button>
      </div>
    </el-dialog>
    <!--    编辑角色弹框-->
    <el-dialog title="编辑类别" :visible.sync="dialogUpdate">
      <el-form :model="updateRow" ref="addForm">
        <el-form-item label="列别名称" prop="name">
          <el-input v-model="updateRow.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdate = false">取 消</el-button>
        <el-button type="primary" @click="updateName()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'newTag',
  data () {
    return {
      tableData: [
      ],
      // 添加栏目弹框
      dialogAdd: false,
      addForm: {
        name: null
      },
      // 添加栏目校验条件
      addRules: {
        name: [
          { required: true, message: '请输入类别名', trigger: 'blur' },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ]
      },
      dialogUpdate: false,
      updateRow: {

      }
    }
  },
  methods: {
    addTag (addForm) {
      this.$refs.addForm.validate(bool => {
        if (bool) {
          this.$axios.post('category/add', addForm)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$notify.success({
                  title: '成功' + resp.data.code,
                  message: resp.data.message
                })
                this.selectAll()
              } else {
                this.$notify.warning({
                  title: '失败' + resp.data.code,
                  message: resp.data.message
                })
              }
            })
          this.dialogAdd = false
        } else {
          this.$message.warning('请正确输入!')
        }
      })
    },
    selectAll () {
      this.$axios.get('category/queryAll')
        .then(resp => {
          if (resp.data.code === 200) {
            this.tableData = resp.data.data
          }
        })
    },
    editRow (row) {
      this.updateRow = JSON.parse(JSON.stringify(row))
      this.dialogUpdate = true
    },
    deleteRow (row) {
      this.$axios.delete('category/delete/' + row.id)
        .then(resp => {
          if (resp.data.code === 200) {
            this.$notify.success({
              title: '成功' + resp.data.code,
              message: resp.data.message
            })
            this.selectAll()
          } else {
            this.$notify.warning({
              title: '失败' + resp.data.code,
              message: resp.data.message
            })
          }
        })
    },
    updateName () {
      this.$axios.put('category/update', this.updateRow)
        .then(resp => {
          if (resp.data.code === 200) {
            this.$notify.success({
              title: '成功' + resp.data.code,
              message: resp.data.message
            })
            this.selectAll()
          } else {
            this.$notify.warning({
              title: '失败' + resp.data.code,
              message: resp.data.message
            })
          }
          this.dialogUpdate = false
        })
    }
  },
  created () {
    this.selectAll()
  }
}
</script>

<style scoped>

</style>
