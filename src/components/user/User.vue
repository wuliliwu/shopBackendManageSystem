<template>
    <div class="user">
<!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片-->
        <el-card class="box-card">
<!--            搜索-->
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable  @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="9">
                    <el-button type="primary" @click="addDialog">添加用户</el-button>
                </el-col>
            </el-row>

                <el-button slot="append" icon="el-icon-search"></el-button>
<!--            </el-input>-->
            <!--        用户列表区-->

            <el-table :data="userList"  stripe border >
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态" prop="mg_state">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.mg_state"
                                @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="" width="200px">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark"
                                    content="编辑" placement="top"
                                    :enterable="false"
                                    >
                            <el-button type="primary" icon="el-icon-edit" circle
                                       @click="getUserInfo(scope.row.id)">

                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete"
                                       circle @click="deleteUserInfo(scope.row.id)">

                            </el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="设置" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <!--            分页区域-->
            </el-table>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[4,10]"
                    :page-size="4"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

<!--        添加用户对话框-->
        <el-dialog
                title="添加用户"
                :visible.sync="dialogVisible"
                width="50%"
                @close="addDialogClose">
            <span>
                <el-form :model="addForm" :rules="addUserrules" ref="addFormRef" label-width="70px" >
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                  </el-form-item>
                    <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                  </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                  </el-form-item><el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                  </el-form-item>
                </el-form>
            </span>
<!--            底部区域-->
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible1" >取 消</el-button>
            <el-button type="primary" @click="adduser">确 定</el-button>
          </span>
        </el-dialog>
<!--        修改用户的对话框-->
        <el-dialog
                title="修改用户"
                :visible.sync="EditdialogVisible"
                width="50%">
            <span>
               <el-form :model="editForm" :rules="addUserrules" ref="editFormRef" label-width="70px" >
                  <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                  </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                  </el-form-item><el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                  </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="EditdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEditTable()" >确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: "User",
    data() {
      var checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          // console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
      return{
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 4
        },
        userList:[

        ],
        total: 0,
        // 控制添加用户的对话框
        dialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          username: '',
          password: '',
          email: '',
          mobile:''
        },
        // 修改用户信息的数据
        editForm: {
          username:'',
          id: '',
          email:'',
          mobile:''
        },
        // 控制修改用户信息的弹框
        EditdialogVisible:false,
        addUserrules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 12, message: '用户名长度在 3 到 12 个字符之间', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '用户名长度在 6 到 15 个字符之间', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          mobile: [
            {required:true, validator:checkPhone, trigger: ['blur', 'change'] }
          ]
        }


      }
    },
    methods: {
      async getUserList(){
        const {data : res} =await this.$http.get('users',{params: this.queryInfo})
        // console.log(res)
        if (res.meta.status !== 200)
          return this.$message.error('用户列表获取失败！')
        this.userList = res.data.users
        this.total = res.data.total

      },
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.queryInfo.pagesize = newSize
        this.getUserList()
      },
      handleCurrentChange(newPage) {
        // console.log(newPage)
        this.queryInfo.pagenum = newPage
        this.getUserList()
      },
      async userStateChange(userInfo) {
        const {data:res}= await this.$http.put
        (`users/${userInfo.id}/state/${userInfo.mg_state}`)
        // console.log(res)
        if (res.meta.status !== 200){
          userInfo.mg_state = !userInfo.mg_state
          return this.$message.error(
            {
            message: '更新用户状态失败！',
              duration: 800
          })
        }
        return this.$message.success({
          message: '更新用户状态成功！',
          duration: 800
        })

      },
      addDialog() {
        this.dialogVisible = true
      },
      dialogVisible1() {
        this.dialogVisible = false
      },
      // 重置表单
      addDialogClose() {
        this.$refs.addFormRef.resetFields()
      },
      adduser() {
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return
          // 发起添加用户的请求
          const {data : res} = await this.$http.post('users',this.addForm)
          if (res.meta.status !== 201){
            this.$message.error(
              {
                message: '添加用户失败！',
                duration: 800
              })
          }
          this.$message.success({
            message: '添加用户成功！',
            duration: 800
          })
          // 隐藏对话框
          this.dialogVisible = false
          // 重新获取用户列表
          await this.getUserList()
        })
      },
      // 根据id获取修改用户信息
      async getUserInfo(id) {
        this.EditdialogVisible = true
        // console.log(id)
        const {data: res} = await this.$http.get('users/' + id)
        console.log(res)
        if (res.meta.status !== 200)
          return this.$message.error('用户列表获取失败！')
        this.editForm = res.data
      },
      // 确定修改用户信息，并且刷新页面
      sureEditTable() {
        this.$refs.editFormRef.validate( async valid => {
          if (!valid) return
          const {data: res} = await this.$http.put('users/'+ this.editForm.id,this.editForm)
          if (res.meta.status !== 200){
            this.$message.error(
              {
                message: '修改用户失败！',
                duration: 800
              })
          }
          this.$message.success({
            message: '修改用户成功！',
            duration: 800
          })
          this.EditdialogVisible = false
          await this.getUserList()

        })
      },
      // 删除用户的操作id
      async deleteUserInfo(id) {
        // console.log()
        const config = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (config === 'confirm'){
          if(!id) return this.$message.error('删除失败！请重试！')
          const {data: res} = await this.$http.delete('users/'+id)
          if (res.meta.status !== 200){
            this.$message.error(
              {
                message: '删除用户失败！',
                duration: 800
              })
          }
          this.$message.success({
            message: '删除用户成功！',
            duration: 800
          })
          await this.getUserList()
        }


      }
    // 则是methos的大括号
    },
    created() {
      this.getUserList()
    }
  }
</script>

<style scoped>
    .el-table {
        font-size: 13px;
        margin-top: 20px;
        border-radius: 5px;
    }
    .el-pagination {
        margin-top: 20px;
    }
</style>