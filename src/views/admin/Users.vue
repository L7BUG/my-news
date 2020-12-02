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
        <el-button type="success" icon="el-icon-search" plain size="mini">添加用户</el-button>
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
          <template slot-scope="scope">{{ scope.row.status }}</template>
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
              @click="editRow(scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
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
      const t = JSON.stringify(users)
      console.log(t)
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
