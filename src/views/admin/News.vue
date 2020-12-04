<template>
  <div>
    <!--  面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>查看新闻</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-button type="success" icon="el-icon-search" plain size="mini">增加新闻</el-button>
        <el-button type="warning" icon="el-icon-delete" plain size="mini">删除新闻</el-button>
      </el-row>
      <!--      搜索区域-->
      <el-row>
        <el-form :inline="true" :model="selectForm" class="demo-form-inline">
          <el-form-item label="新闻名">
            <el-input v-model="selectForm.title" placeholder="新闻名" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="用户id">
            <el-input type="number" v-model="selectForm.user.id" placeholder="用户id" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="新闻类别">
            <el-select v-model="selectForm.category.id" clearable placeholder="请选择" size="mini">
              <el-option
                v-for="item in categorys"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="succ ess" size="mini" icon="el-icon-search" plain @click="select(selectForm)">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-row>

      <el-table
        border
        ref="multipleTable"
        @selection-change="this.selectionChange"
        :data="tableData.data"
        tooltip-effect="dark"
        style="width: 100%">

        <el-table-column
          type="selection"
          width="55">
        </el-table-column>

        <el-table-column
          prop="id"
          label="新闻id"
          width="70">
        </el-table-column>

        <el-table-column
          label="新闻标题"
          width="120">
          <template slot-scope="scope">{{ scope.row.title }}</template>
        </el-table-column>
        <el-table-column
          label="新闻内容">
          <template slot-scope="scope">{{ scope.row.content }}</template>
        </el-table-column>

        <el-table-column
          label="所属类别"
          width="120">
          <template slot-scope="scope">{{ scope.row.category.name}}</template>
        </el-table-column>

        <el-table-column
          label="发表用户"
          width="120">
          <template slot-scope="scope">{{ scope.row.user.username }}</template>
        </el-table-column>

        <el-table-column
          label="访问量"
          width="120">
          <template slot-scope="scope">{{ scope.row.clicks }}</template>
        </el-table-column>

        <el-table-column
          label="状态"
          width="120">
          <template slot-scope="scope">{{ scope.row.publishStatus === '1' ? '发布' : '删除' }}</template>
        </el-table-column>

        <el-table-column
          prop="publishTime"
          width="120"
          label="发布时间">
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
  name: 'news',
  data () {
    return {
      tableData: {
        data: [

        ],
        // 当前页
        page: 1,
        // 总数
        maxPageNumber: 1000
      },
      // 查询条件
      selectForm: {
        title: null,
        category: {
          id: null
        },
        user: {
          id: null
        },
        pageShowNumber: 5
      },
      // 临时查询条件 最后会赋值给 selectForm
      selectTemp: {
        title: null,
        category: {
          id: null
        },
        user: {
          id: null
        }
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
    select (selectForm) {
      this.$axios.post('new/query/' + this.tableData.page, selectForm)
        .then(resp => {
          if (resp.data.code === 200) {
            const data = resp.data
            console.log(data)
            this.tableData.data = data.data.data
            this.tableData.maxPageNumber = data.data.maxPageNumber
          }
        })
    },
    setPageShowNumber (val) {
      this.selectForm.pageShowNumber = val
    },
    handleCurrentChange (val) {
      this.tableData.page = val
    },
    // 用户勾选单选框的事件
    selectionChange (selection) {
      console.log(selection)
    },
    editRow (row) {

    },
    deleteRow (row) {

    }
  },
  created () {
    // 查询所有类别
    this.$axios.get('category/queryAll')
      .then(resp => {
        if (resp.data.code === 200) {
          this.categorys = resp.data.data
        }
      })
    this.select(this.selectForm)
  }
}
</script>

<style scoped>

</style>
