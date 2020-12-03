<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <h2>老陆头条管理系统</h2>
      </div>
      <el-button type="info">退出</el-button>
    </el-header>
    <el-container>
<!--      侧边栏-->
      <el-aside :width="collWidth">
<!--        折叠-->
        <div class="taggle-button" @click="toggleCollapse">|||</div>
<!--        collapse折叠-->
        <el-menu
          router
          :collapse = "isToggleCollapse"
          :collapse-transition="false"
          unique-opened
          background-color="#34495e"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu :index="item.index" v-for="item in AsideListDate" :key="item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item :index="sonItem.path" v-for="sonItem in item.children" :key="sonItem.id" >
              <template slot="title">
                <i :class="sonItem.icon"></i>
                <span>{{ sonItem.title }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 是否折叠菜单
      isToggleCollapse: false,
      // 左侧菜单列表数据
      AsideListDate: [
        {
          index: '1',
          icon: 'el-icon-setting',
          title: '系统管理',
          children: [
            {
              icon: 'el-icon-s-check',
              title: '角色管理',
              path: 'role'
            },
            {
              icon: 'el-icon-edit',
              title: '修改密码',
              path: 'password'
            }
          ]
        },
        {
          index: '2',
          icon: 'el-icon-s-custom',
          title: '用户管理',
          children: [
            {
              icon: 'el-icon-user',
              title: '用户列表',
              path: 'users'
            }
          ]
        },
        {
          index: '3',
          icon: 'el-icon-notebook-2',
          title: '新闻管理',
          children: [
            {
              icon: 'el-icon-collection-tag',
              title: '类别管理',
              path: ''
            },
            {
              icon: 'el-icon-files',
              title: '查看新闻',
              path: ''
            }
          ]
        },
        {
          index: '4',
          icon: 'el-icon-chat-line-square',
          title: '评论管理',
          children: [
            {
              icon: 'el-icon-chat-square',
              title: '查看评论',
              path: ''
            }
          ]
        },
        {
          index: '5',
          icon: 'el-icon-document-copy',
          title: '文章管理',
          children: [
            {
              icon: 'el-icon-collection',
              title: '我发布的',
              path: ''
            },
            {
              icon: 'el-icon-edit',
              title: '发布文章',
              path: ''
            }
          ]
        }
      ]
      // 图标
      // iconObj: {
      //   1: 'iconfont icon-yonghuguanli',
      //   2: 'iconfont icon-quanxian',
      //   3: 'iconfont icon-shangpinguanli',
      //   4: 'iconfont icon-logooo_huabanfuben',
      //   5: 'iconfont icon-shuju'
      // }
    }
  },
  methods: {
    // 点击按钮折叠菜单
    toggleCollapse () {
      this.isToggleCollapse = !this.isToggleCollapse
    }
  },
  computed: {
    collWidth () {
      return this.isToggleCollapse ? '64px' : '200px'
    }
  }
}
</script>

<style lang="less" scoped>
.home_container{
  height: 100%;
}
.el-header{
  //padding-left: 0px;
  background-color: #2c3e50;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ecf0f1;
}
.el-aside{
  background-color: #34495e;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #ecf0f1;
}
.iconfont{
  margin-right: 10px;
}
//折叠样式
.taggle-button{
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor:pointer;
}
</style>
