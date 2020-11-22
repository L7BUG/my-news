<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图区域-->
    <el-card class="box-card">
      <!--    表单输入框-->
      <el-row :gutter="30">
        <el-col :span="7">
          <div style="margin-top: 15px;">
            <el-input placeholder="请输入内容" v-model="params.query" clearable @clear = 'getUserList'>
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="margin-top: 15px;">
            <el-button type="primary" @click="isboolAddDialogVisible">添加用户</el-button>
          </div>
        </el-col>
      </el-row>
      <!--    表格-->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"  align="center"></el-table-column>
        <el-table-column prop="username" label="姓名" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="mobile" label="电话" align="center"></el-table-column>
        <el-table-column prop="role_name" label="角色" align="center"></el-table-column>
        <el-table-column prop="mg_state" label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state" @change="updateUserState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改用户"
              placement="top"
              :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editUserInfo(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除用户" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserInfo(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRoleDialogData(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--    分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!--  添加用户对话框-->
    <el-dialog
      @close = 'closeAddDialog'
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="70%">
      <!--    添加用户表单-->
      <el-form :model="addUserData" :rules="addUserRules" ref="addUserRuleForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserData.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addUserData.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isboolAddDialogVisible">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--  修改用户对话框-->
    <el-dialog
      @close = 'closeEditDialog'
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="70%">
      <!--    修改用户表单-->
      <el-form :model="editUserData" :rules="addUserRules" ref="editUserRuleForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="editUserData.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserData.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editUserData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isboolEditDialogVisible">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--  分配角色对话框-->
    <el-dialog
      @close="setRoleDialogClose"
      title="提示"
      :visible.sync="setRolesDialogVisible"
      width="70%">
      <div>
              <p>当前用户：{{selectRolesInfo.username}}</p>
              <p>当前角色：{{selectRolesInfo.role_name}}</p>
        <p>分配新角色：
                  <el-select v-model="selectRolesId" placeholder="请选择">
                    <el-option
                      v-for="item in rolesInfo"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id">
                    </el-option>
                  </el-select>
        </p>
      </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="setRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRole">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'users',
  data () {
    // 自定义验证规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号码'))
    }
    return {
      params: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 1
      },
      userList: [],
      total: 0,
      //  添加用户对话框显示隐藏
      addDialogVisible: false,
      // 修改用户对话框显示隐藏
      editDialogVisible: false,
      // 添加用户表单数据
      addUserData: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改用户表单数据
      editUserData: {
        username: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单验证规则
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 分配角色对话框显示与隐藏
      setRolesDialogVisible: false,
      // 当前角色信息
      selectRolesInfo: [],
      // 所有角色信息
      rolesInfo: [],
      // 下拉框当前已经选择的角色id
      selectRolesId: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户数据
    getUserList () {
      const p = this.$axios.get('users', { params: this.params })
      p.then(res => {
        if (res.data.meta.status === 200) {
          this.userList = res.data.data.users
          this.total = res.data.data.total
        } else {
          return this.$message.error(res.data.meta.msg)
        }
      }, err => {
        console.log(err)
      })
    },
    // 监听pagesize页条数发生变化
    handleSizeChange (newSize) {
      this.params.pagesize = newSize
      this.getUserList()
    },
    // 监听pagenum页码发生变化
    handleCurrentChange (newNum) {
      this.params.pagenum = newNum
      this.getUserList()
    },
    // 更改用户状态
    async updateUserState (userList) {
      const { data } = await this.$axios.put(`users/${userList.id}/state/${userList.mg_state}`)
      if (data.meta.status !== 200) {
        userList.mg_state = !userList.mg_state
        return this.$message.error(data.meta.msg)
      }
      this.$message.success(data.meta.msg)
    },
    // 控制添加用户对话框显示隐藏
    isboolAddDialogVisible () {
      this.addDialogVisible = !this.addDialogVisible
    },
    // 监听dialog对话框关闭事件
    closeAddDialog () {
      this.$refs.addUserRuleForm.resetFields()
    },
    closeEditDialog () {
      this.$refs.editUserRuleForm.resetFields()
    },
    // 添加用户
    addUser () {
      this.$refs.addUserRuleForm.validate(async bool => {
        if (bool) {
          const { data } = await this.$axios.post('users', this.addUserData)
          this.addDialogVisible = !this.addDialogVisible
          this.$message.success(data.meta.msg)
          this.getUserList()
        } else {
          return this.$message.error('表单校验失败')
        }
      })
    },
    // 控制添加用户对话框显示隐藏
    isboolEditDialogVisible () {
      this.editDialogVisible = !this.editDialogVisible
    },
    // 查询用户信息
    async editUserInfo (id) {
      const { data } = await this.$axios.get(`users/${id}`)
      if (data.meta.status === 200) {
        // 获取用户信息成功
        this.editUserData = data.data
      } else {
        this.$message.error(data.meta.msg)
      }
      this.editDialogVisible = !this.editDialogVisible
    },
    // 修改用户
    editUser () {
      this.$refs.editUserRuleForm.validate(async bool => {
        if (bool) {
          const { data } = await this.$axios.put(`users/${this.editUserData.id}`, {
            email: this.editUserData.email,
            mobile: this.editUserData.mobile
          }
          )
          if (data.meta.status === 200) {
            // 弹出修改成功提示框
            this.$message.success(data.meta.msg)
            // 关闭修改对话框
            this.isboolEditDialogVisible()
            // 重新获取数据
            this.getUserList()
          } else {
            // 弹出修改失败提示框
            this.$message.error(data.meta.msg)
            // 关闭修改对话框
            this.isboolEditDialogVisible()
            // 重新获取数据
            this.getUserList()
          }
        } else {
          return this.$message.error('表单校验失败')
        }
      })
    },
    // 删除用户
    deleteUserInfo (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data } = await this.$axios.delete(`users/${id}`)
        this.$message.info(data.meta.msg)
        this.getUserList()
      }).catch(() => {
        this.$message.error('删除用户取消成功')
      })
    },
    // 显示分配角色显示对话框和数据
    async setRoleDialogData (rolesInfo) {
      this.selectRolesInfo = rolesInfo
      const { data } = await this.$axios.get('roles')
      if (data.meta.status !== 200) return this.$message.error(data.meta.msg)
      this.rolesInfo = data.data
      this.setRolesDialogVisible = true
    },
    // 分配角色
    async setRole () {
      if (!this.selectRolesId) {
        return this.$message.error('请选择要分配的角色')
      }
      const { data } = await this.$axios.put(`users/${this.selectRolesInfo.id}/role`, {
        rid: this.selectRolesId
      })
      if (data.meta.status !== 200) return this.$message.error('data.meta.msg')
      this.$message.success(data.meta.msg)
      this.getUserList()
      this.setRolesDialogVisible = false
      console.log(this.selectRolesInfo)
    },
    // 关闭对话框重置信息
    setRoleDialogClose () {
      this.selectRolesId = ''
      this.selectRolesInfo = []
    }
  }
}
</script>

<style scoped>

</style>
