<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="success" @click="dialogAddRole = true">添加角色</el-button>
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
          label="角色ID"
          width="70">
        </el-table-column>

        <el-table-column
          label="角色名称"
          width="120">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>

        <el-table-column
          prop="remark"
          label="角色备注">
        </el-table-column>

        <el-table-column
          width="150"
          label="角色操作"
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
    <!--      添加角色弹框-->
    <el-dialog title="添加角色" :visible.sync="dialogAddRole">
      <el-form :model="addForm" :rules="addRoleRules" ref="addForm">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色说明">
          <el-input v-model="addForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddRole = false">取 消</el-button>
        <el-button type="primary" @click="addRole(addForm)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Role',
  data () {
    return {
      tableData: [],
      multipleSelection: [],
      // 添加角色
      dialogAddRole: false,
      addForm: {
        name: '',
        remark: ''
      },
      addRoleRules: {
        name: [
          { required: true, message: '角色名称', trigger: 'blur' },
          { min: 2, message: '最少2个字符', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px'
    }
  },
  methods: {
    addRole (role) {
      this.$refs.addForm.validate(bool => {
        if (bool) {
          this.dialogAddRole = false
          this.$axios.post('role/add', this.addForm)
            .then(resp => {
              console.log(resp.data)
              if (resp.data.code === 200) {
                this.$notify.success({
                  title: '添加成功',
                  message: resp.data.code
                })
                this.initPage()
              } else {
                this.$notify.warning({
                  title: '添加失败',
                  message: resp.data.code
                })
              }
            })
          console.log(role)
        } else {
          this.$message.warning('请正确输入')
        }
      })
    },
    editRow (row) {
      console.log(row)
    },
    deleteRow (row) {
      console.log(row)
      this.$confirm('是否删除？', '提示')
        .then(_ => {
          this.$axios.delete('role/delete/' + row.id)
            .then(resp => {
              if (resp.data.code === 200) {
                this.initPage()
                this.$notify.success({
                  title: '删除成功',
                  message: resp.data.message
                })
              } else {
                this.$notify.warning({
                  title: '删除失败',
                  message: resp.data.message
                })
              }
            })
        })
        .catch(_ => {
          this.$notify.info({
            title: '取消删除',
            message: row.name
          })
        })
    },
    initPage () {
      this.$axios.get('role/queryAll')
        .then(resp => {
          console.log(resp.data)
          this.tableData = resp.data.data
        })
    }

  },
  created () {
    this.initPage()
  }
}
</script>

<style scoped>

</style>
