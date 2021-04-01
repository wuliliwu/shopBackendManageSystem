<template>
        <el-container class="home_container">
            <el-header>
                <div>
                    <img src="../assets/img/logo.png" alt="">

                </div>
                <span>电商后台管理系统</span>
                <el-button type="info" @click="loginOut">退出</el-button>
            </el-header>
            <el-container>
                <el-aside :width="isCollapse ? '64px' : '200px'">
                    <div class="toggle_button" @click="toggleCollapse">
                        <i class="el-icon-s-operation"></i>
                    </div>
<!--                    侧边栏目-->
                    <el-menu
                            background-color="#333744"
                            text-color="#fff"
                            active-text-color="#409fff"
                            unique-opened
                            :collapse="isCollapse"
                            :collapse-transition="false"
                            :default-active="activePath"
                            router>
                        <el-submenu :index="item.id + ''"
                                    v-for="item in MenuList"
                                    :key="item.id">
                            <template slot="title">
                                <i :class="iconsObj[item.id]"></i>
                                <span>{{item.authName}}</span>
                            </template>
<!--                            二级菜单-->
<!--                            <el-menu-item-group>-->
                                <el-menu-item :index=" '/' + subItem.path"
                                              v-for="subItem in item.children"
                                              :key="subItem.id"
                                              @click="saveMenuState('/' + subItem.path)"
                                              >
                                    <template slot="title">
                                    <i class="el-icon-menu"></i>
                                    <span>{{subItem.authName}}</span>
                                    </template>
                                </el-menu-item>
<!--                            </el-menu-item-group>-->

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
    name: "Home",
    data() {
      return {
        // 左侧菜单数据
        MenuList : [],
        iconsObj: {
          '125': 'el-icon-s-custom',
          '103': 'el-icon-s-check',
          '101': 'el-icon-s-goods',
          '102': 'el-icon-s-claim',
          '145': 'el-icon-s-platform'

      },
        isCollapse: false,
        activePath: ''
      }
    },
    methods: {
      loginOut() {
        window.sessionStorage.clear()
        this.$router.push('/login')
        this.$message.error({
          message:'退出成功',
          duration:600
        })
      },
      async getMenuList() {
        const {data : res} = await this.$http.get('menus')
        if (res.meta.status !== 200)
          return this.$message.error('res.meta.msg')
        this.MenuList = res.data
        // console.log(res)

      },
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      saveMenuState(activePath) {
        // 保存链接的激活状态
        window.sessionStorage.setItem('activePath',activePath)
        this.activePath = activePath
      }
    },
    created() {
      // 获取所有菜单
        this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    }

  }
</script>

<style scoped>
    .home_container {
        height: 100%;
    }
    .el-header {
        display: flex;
        justify-content: space-between;
         background-color: #373d47;
        align-items: center;
    }
    .el-header img {
        /*margin-top: 10px;*/
        height: 40px;
        width: 40px;


        border-radius: 50%;
    }
    .el-header span {
        display: flex;
        align-items: flex-start;
        font-size: 20px;
        padding: 10px;
        margin-bottom: 10px;
        color: #fff;
    }
    .el-aside {
      background-color: #333744;
    }
    .el-menu {
        border-right: none;
    }
    .el-main {
        background-color: #eaedf1;
    }
    .toggle_button {
        background-color: #4A5064;
        font-size: 10px;
        line-height: 25px;
        color: #fff;
        text-align: center;
        letter-spacing: .2rem;
        cursor: pointer;
    }
    
    
</style>