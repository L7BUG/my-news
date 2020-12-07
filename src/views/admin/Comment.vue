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
        <el-button type="success" icon="el-icon-search" plain size="mini">增加评论</el-button>
        <el-button type="warning" icon="el-icon-delete" plain size="mini">删除评论</el-button>
      </el-row>
      <!--      搜索区域-->
      <el-row>
        <el-form :inline="true" :model="selectTemp" class="demo-form-inline">
          <el-form-item label="评论内容">
            <el-input v-model="selectTemp.content" placeholder="内容" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="新闻id">
            <el-input type="number" v-model="selectTemp.mNew.id" placeholder="新闻id" size="mini" clearable></el-input>
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
        mNew: {
          id: null
        },
        user: {
          id: null
        },
        pageShowNumber: 5
      },
      // 临时查询条件 最后会赋值给 selectForm
      selectTemp: {
        content: null,
        mNew: {
          id: null
        },
        user: {
          id: null
        }
      }

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
      console.log(selection)
    },
    editRow (row) {
      console.log(row)
    },
    deleteRow (row) {
      console.log(row)
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
      console.log('搜索')
    }
  },
  created () {
    this.select(this.selectForm)
  }
}
</script>

<style scoped>

</style>
