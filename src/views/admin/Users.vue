<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="success" icon="el-icon-search" plain size="mini" @click="dialogAddUser = true">添加用户</el-button>
        <el-button type="warning" icon="el-icon-delete" plain size="mini" @click="deleteUser(users)">删除用户</el-button>
      </el-row>
<!--      搜索区域-->
      <el-row>
        <el-form :inline="true" :model="selectFormT" class="demo-form-inline">
          <el-form-item label="用户名">
            <el-input v-model="selectFormT.username" placeholder="用户名" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="selectFormT.role.id" clearable placeholder="请选择" size="mini">
              <el-option
                v-for="item in roles"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="succ ess" size="mini" icon="el-icon-search" plain @click="selectClick(selectFormT)">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-table
        border
        ref="multipleTable"
        @selection-change="selectionChange"
        :data="tableData.data"
        tooltip-effect="dark"
        style="width: 100%">

        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
          prop="id"
          label="用户id"
          width="70">
        </el-table-column>

        <el-table-column
          label="用户名"
          width="120">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>

        <el-table-column
          label="所属角色"
          width="120">
          <template slot-scope="scope">{{ scope.row.role.name }}</template>
        </el-table-column>

        <el-table-column
          label="状态"
          width="120">
          <template slot-scope="scope">{{ scope.row.status===1? '启用': '注销' }}</template>
        </el-table-column>

        <el-table-column
          label="密码"
          width="120">
          <template slot-scope="scope">{{ scope.row.password }}</template>
        </el-table-column>

        <el-table-column
          prop="tel"
          label="联系电话">
        </el-table-column>

        <el-table-column
          width="150"
          label="角色操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              :disabled="scope.row.id === 1"
              @click="editRow(scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
              :disabled="scope.row.id === 1"
              type="danger"
              @click="deleteRow(scope.row.id)">删除
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

    <!--      添加用户弹框-->
    <el-dialog title="添加用户" :visible.sync="dialogAddUser">
      <el-form :model="addUserForm" :rules="addUserRules" ref="addForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="role.id">
          <el-select v-model="addUserForm.role.id" clearable placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="addUserForm.tel" clearable type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddUser = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!--      修改用户用户弹框-->
    <el-dialog title="修改" :visible.sync="dialogUpdateUser">
      <el-form :model="updateUserForm" :rules="updateUserRules" ref="updateForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateUserForm.username" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="updateUserForm.password" type="password" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="">
          <el-select v-model="updateUserForm.status" clearable placeholder="状态">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属角色" prop="role.id">
          <el-select v-model="updateUserForm.role.id" clearable placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话" prop="tel">
          <el-input v-model="updateUserForm.tel" clearable type="number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateUser = false">取 消</el-button>
        <el-button type="primary" @click="updateUser()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    return {
      tableData: {
        data: [
          {
            id: 1,
            username: 'admin',
            status: 1,
            tel: '188888888',
            password: '123123',
            role: {
              id: 1,
              name: 'admin'
            }
          }
        ],
        // 当前页
        page: 1,
        // 总数
        maxPageNumber: null
      },
      // 查询条件
      selectForm: {
        username: null,
        role: {
          id: null
        },
        // 每页显示
        pageShowNumber: 5
      },
      selectFormT: {
        username: null,
        role: {
          id: null
        },
        // 每页显示
        pageShowNumber: 5
      },
      // 角色
      roles: [
      ],
      users: [

      ],
      dialogAddUser: false,
      // 添加用户表单
      addUserForm: {
        username: '',
        password: '',
        tel: null,
        role: {
          id: null
        }
      },
      // 添加用户校验条件
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur' }
        ],
        role: {
          id: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ]
        }
      },
      // 修改用户
      dialogUpdateUser: false,
      updateUserForm: {
        username: '',
        password: '',
        tel: null,
        role: {
          id: null
        }
      },
      updateUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur' }
        ],
        role: {
          id: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ]
        }
      },
      statusList: [
        {
          id: 1,
          name: '启用'
        },
        {
          id: 2,
          name: '注销'
        }
      ]
    }
  },
  methods: {
    // 查询
    select (selectForm) {
      this.$axios.post('user/query/' + this.tableData.page, selectForm)
        .then(resp => {
          if (resp.data.code === 200) {
            console.log(resp.data.data)
            this.tableData.maxPageNumber = resp.data.data.maxPageNumber
            this.tableData.data = resp.data.data.tableData
            console.log(resp.data)
          } else {
            this.$notify.error({
              title: resp.data.message,
              context: resp.data.code
            })
          }
        })
    },
    selectClick (selectFormT) {
      this.selectForm = selectFormT
      this.select(selectFormT)
    },
    setPageShowNumber (val) {
      this.selectForm.pageShowNumber = val
      this.select(this.selectForm)
    },
    handleCurrentChange (val) {
      this.tableData.page = val
      this.select(this.selectForm)
    },
    editRow (row) {
      this.updateUserForm = JSON.parse(JSON.stringify(row))
      this.dialogUpdateUser = true
    },
    deleteRow (id) {
      this.$axios.delete('user/delete/' + id)
        .then(resp => {
          if (resp.data.code === 200) {
            this.$notify.success({
              title: '成功' + resp.data.code,
              message: resp.data.message
            })
            this.select(this.selectForm)
          } else {
            this.$notify.error({
              title: '失败' + resp.data.code,
              message: resp.data.message
            })
          }
        })
    },
    // 用户勾选单选框的事件
    selectionChange (selection) {
      this.users = selection
      console.log(this.users)
    },

    deleteUser (users) {
      if (users.length > 0) {
        this.$axios.post('user/delete', users)
          .then(resp => {
            if (resp.data.code === 200) {
              this.$notify.success({
                dangerouslyUseHTMLString: true,
                title: '成功' + resp.data.code,
                message: resp.data.message
              })
              this.select(this.selectForm)
            } else {
              this.$notify.error({
                dangerouslyUseHTMLString: true,
                title: '失败' + resp.data.code,
                message: resp.data.message
              })
            }
          })
      } else {
        this.$message.warning('请选择！')
      }
    },
    // 添加用户
    addUser () {
      this.$refs.addForm.validate(bool => {
        if (bool) {
          this.$axios.post('user/add', this.addUserForm)
            .then(resp => {
              if (resp.data.code === 200) {
                console.log(resp.data)
                this.$notify.success({
                  title: '添加成功' + resp.data.code,
                  message: resp.data.message
                })
                this.select(this.selectForm)
              } else {
                this.$notify.warning({
                  title: '添加失败' + resp.data.code,
                  message: resp.data.message
                })
              }
            })
          this.dialogAddUser = false
          this.$refs.addForm.resetFields()
        } else {
          this.$message.error('请正确输入!')
        }
      })
    },
    updateUser () {
      this.$refs.updateForm.validate(bool => {
        if (bool) {
          this.$axios.put('user/update', this.updateUserForm)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$notify.success({
                  title: '成功' + resp.data.code,
                  message: resp.data.message
                })
                this.select(this.selectForm)
              } else {
                this.$notify.warning({
                  title: '失败' + resp.data.code,
                  message: resp.data.message
                })
              }
            })
          this.dialogUpdateUser = false
        } else {
          this.$message.warning('请正确输入')
        }
      })
    }
  },
  created () {
    // 获得所有权限信息
    this.$axios.get('role/queryAll')
      .then(resp => {
        this.roles = resp.data.data
      })
    // 默认查询第一页
    this.select(this.selectForm)
  }
}
</script>

<style scoped>
</style>
