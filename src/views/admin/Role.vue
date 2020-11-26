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
        <el-button type="success">添加角色</el-button>
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
          prop="remarks"
          label="角色备注">
        </el-table-column>
        <el-table-column
          width="210"
          label="角色操作"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="info"
              @click="viewRow(scope.row)">查看</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="editRow(scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Role',
  data () {
    return {
      tableData: [
        {
          id: 1,
          name: 'admin',
          remarks: '反正就是啥都能干'
        }
      ],
      multipleSelection: []
    }
  },

  methods: {
    viewRow (row) {
      console.log(row)
    },
    editRow (row) {
      console.log(row)
    },
    deleteRow (row) {
      console.log(row)
    }
  }
}
</script>

<style scoped>

</style>
