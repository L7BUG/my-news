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
        <el-button type="success" icon="el-icon-search" plain size="mini" @click="dialogAddNew = true">增加新闻</el-button>
        <el-button type="warning" icon="el-icon-delete" plain size="mini" @click="deleteNews()">删除新闻</el-button>
      </el-row>
      <!--      搜索区域-->
      <el-row>
        <el-form :inline="true" :model="selectTemp" class="demo-form-inline">
          <el-form-item label="新闻名">
            <el-input v-model="selectTemp.title" placeholder="新闻名" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="用户id">
            <el-input type="number" v-model="selectTemp.user.id" placeholder="用户id" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="新闻类别">
            <el-select v-model="selectTemp.category.id" clearable placeholder="请选择" size="mini">
              <el-option
                v-for="item in categorys"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
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
    <!--      添加新闻弹框-->
    <el-dialog title="添加用户" :visible.sync="dialogAddNew">
      <el-form :model="addForm" :rules="addRules" ref="addForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属类别" prop="category.id">
          <el-select v-model="addForm.category.id" clearable placeholder="请选择">
            <el-option
              v-for="item in categorys"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户id" prop="user.id">
          <el-input v-model="addForm.user.id" clearable></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="addForm.content" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddNew = false">取 消</el-button>
        <el-button type="primary" @click="addNew()">确 定</el-button>
      </div>
    </el-dialog>
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
      ],
      selection: null,
      dialogAddNew: false,
      addForm: {
        title: null,
        category: {
          id: null
        },
        user: {
          id: null
        },
        content: null
      },
      addRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
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
      }
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
    selectClick () {
      this.selectForm.title = this.selectTemp.title
      this.selectForm.category = this.selectTemp.category
      this.selectForm.user = this.selectTemp.user
      console.log(this.selectForm)
      this.select(this.selectForm)
    },
    setPageShowNumber (val) {
      this.selectForm.pageShowNumber = val
      this.select(this.selectForm)
    },
    handleCurrentChange (val) {
      this.tableData.page = val
      this.select(this.selectForm)
    },
    // 用户勾选单选框的事件
    selectionChange (selection) {
      this.selection = selection
      console.log(selection)
    },
    editRow (row) {

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
                this.select(this.selectForm)
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
    deleteNews () {
      if (!this.selection) return
      console.log(this.selection)
      this.$confirm('是否删除？此操作会删除相关评论信息', '警告！')
        .then(_ => {
          this.$axios.delete('new/delete', {
            data: this.selection
          })
            .then(resp => {
              if (resp.data.code === 200) {
                this.$notify.success({
                  title: '删除成功' + resp.data.code,
                  message: resp.data.message
                })
                this.select(this.selectForm)
              } else {
                this.$notify.warning({
                  title: '删除失败' + resp.data.code,
                  message: resp.data.message
                })
              }
              this.selection = null
              this.select(this.selectForm)
            })
        })
        .catch(_ => {
          this.$notify.info({
            title: '取消删除'
          })
        })
    },
    addNew () {
      this.$refs.addForm.validate(bool => {
        if (bool) {
          this.$axios.post('new/add', this.addForm)
            .then(resp => {
              if (resp.data.code === 200) {
                this.$notify.success({
                  title: '新增成功:' + resp.data.code,
                  message: resp.data.message
                })
                this.$refs.addForm.resetFields()
                this.select(this.selectForm)
              } else {
                this.$notify.warning({
                  title: '新增失败:' + resp.data.code,
                  message: resp.data.message
                })
              }
            })
          this.dialogAddNew = false
        } else {
          this.$message.error('请正确输入')
        }
      })
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

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
