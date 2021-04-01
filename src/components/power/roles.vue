<template>
    <div class="roles">
        <!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-button type="primary" @click="addDialog">添加角色</el-button>
                </el-col>
            </el-row>
<!--            添加角色用户的对话框-->
            <el-dialog
                    title="添加角色"
                    :visible.sync="dialogVisible"
                    width="50%"
                    @close="addDialogClose">
            <span>
                <el-form :model="roleForm" :rules="addRolerules" ref="roleFormRef" label-width="70px" >
                  <el-form-item label="角色名称" label-width="100px" prop="roleName">
                    <el-input v-model="roleForm.roleName" ></el-input>
                  </el-form-item>

                    <el-form-item label="角色描述" label-width="100px">
                    <el-input v-model="roleForm.roleDesc"></el-input>
                  </el-form-item>

                </el-form>
            </span>
                <!--            底部区域-->
                <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false" >取 消</el-button>
            <el-button type="primary" @click="addrole">确 定</el-button>
          </span>
            </el-dialog>

<!--            角色列表区-->
            <el-table :data="roleList" border stripe>
<!--                权限展开的地方-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['vcenter','bdbottom', i1 === 0 ? 'bdtop' : '']"
                                v-for="(item1 , i1) in scope.row.children" :key="item1.id">
<!--                            一级权限-->
                            <el-col :span="5">
                                <el-tag closable
                                        @close="removeRightbyId(scope.row,item1.id)">
                                    {{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
<!--                            二级和三级-->
                            <el-col :span="19">
<!--                                通过循环渲染-->
                                <el-row :class="['vcenter', i2 === 0 ? '': 'bdtop']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable
                                                @close="removeRightbyId(scope.row,item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                                <el-tag
                                                        type="warning" v-for="(item3,i3) in item2.children"
                                                        :key="item3.id"
                                                        closable
                                                        @close="removeRightbyId(scope.row,item3.id)">
                                                    {{item3.authName}}
                                                </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>

                        </el-row>
                    </template>
                </el-table-column>
<!--                索引列表-->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-search"
                                   size="mini" @click="editRole(scope.row.id)">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete"
                                   size="mini" @click="removeRole(scope.row.id)">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting"
                                   size="mini" @click="showSetRightDialog(scope.row)">分配角色</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-card>

        <!--        修改角色的对话框-->
        <el-dialog
                title="修改用户"
                :visible.sync="EditdialogVisible"
                width="50%"
                >
            <span>
               <el-form :model="editForm" :rules="addRolerules" ref="editFormRef" label-width="100px" >
                    <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                  </el-form-item><el-form-item label="角色描述">
                    <el-input v-model="editForm.roleDesc"></el-input>
                  </el-form-item>
                </el-form>
            </span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="EditdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEditTable">确 定</el-button>
  </span>
        </el-dialog>
<!--        分配权限的对话框-->
        <el-dialog
                title="分配权限"
                :visible.sync="rightsdialogVisible"
                width="50%"
                @close="setRightDialogClose"
                >
            <span>
               <el-tree :data="rightsList" :props="defaultProps"
                        show-checkbox node-key="id"
                        ref="TreeRef"
                        :default-checked-keys="defKeys"></el-tree>
            </span>
            <span slot="footer" class="dialog-footer">
        <el-button @click="rightsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allocateRights">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
  import rights from "./rights";

  export default {
    name: "roles",
    data() {
      return {
        // 所有角色列表数据
        roleList: [],
        dialogVisible:false,
        EditdialogVisible:false,
        // 控制权限弹框的显示隐藏
        rightsdialogVisible:false,
        roleForm: {
          roleName: '',
          roleDesc: '',

        },
        editForm: {
          roleId: '',
          roleName: '',
          roleDesc: '',
        },
        // 权限列表数据
        rightsList: [],
        defaultProps: {
          children: 'children',
          label: 'authName'
        },
        defKeys:[],
        // 即将分配权限的id
        roleId:'',
        // 表单验证规则
        addRolerules: {
          roleName: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 2, max: 12, message: '角色名称长度在 3 到 12 个字符之间', trigger: 'blur' }
          ],

        }

      }
    },
    methods: {
      addDialog() {
        this.dialogVisible = true
      },
      async getRoleList() {
        const {data: res} = await this.$http.get('roles')
        if (res.meta.status !== 200)
          return this.$message.error('角色列表获取失败！')
        this.roleList = res.data
        // console.log(this.roleList)
      },
      // 关闭对话框之前的函数
      addDialogClose() {
        this.$refs.roleFormRef.resetFields()
      },
      // 确认添加角色用户
      async addrole() {

        this.$refs.roleFormRef.validate(async valid => {
          if (!valid) return
          // 发起添加用户的请求
          const {data: res} = await this.$http.post('roles', this.roleForm)
          if (res.meta.status !== 201) {
            this.$message.error(
              {
                message: '添加角色失败！',
                duration: 800
              })
          }
          this.$message.success({
            message: '添加角色成功！',
            duration: 800
          })
          // 隐藏对话框
          this.dialogVisible = false
          // 重新获取用户列表
          await this.getRoleList()
        })

      },
      async removeRole(id) {
        const config = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (config === 'confirm') {
          if (!id) return this.$message.error('删除失败！请重试！')
          const {data: res} = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            this.$message.error(
              {
                message: '删除角色失败！',
                duration: 800
              })
          }
          this.$message.success({
            message: '删除角色成功！',
            duration: 800
          })
          await this.getRoleList()
        }
      },
      async editRole(id) {
        this.EditdialogVisible = true
        const {data: res} = await this.$http.get('roles/' + id)
        // console.log(res)
        if (res.meta.status !== 200)
          return this.$message.error('用户列表获取失败！')
        // console.log(res)
        this.editForm = res.data
        // console.log(id)
        // console.log(this.editForm)
      },
      // 确认编辑
      async sureEditTable() {
        // console.log(this.editForm.roleId)
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return
          const {data: res} = await this.$http.put('roles/'+ this.editForm.roleId,this.editForm)
          if (res.meta.status !== 200){
            this.$message.error(
              {
                message: '修改角色信息失败！',
                duration: 800
              })
          }
          this.$message.success({
            message: '修改角色信息成功！',
            duration: 800
          })
          this.EditdialogVisible = false
          await this.getRoleList()

        })

      },
      // 根据id删除对应的权限
      async removeRightbyId(role,rightId) {
        // 弹框提示
        const config = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (config === 'confirm') {
          // console.log('删除')
        const {data : res} =  await this.$http.delete
        (`roles/${role.id}/rights/${rightId}`)
          if (res.meta.status !== 200){
            this.$message.error(
              {
                message: '删除权限失败！',
                duration: 800
              })
          }
          this.$message.success({
            message: '删除权限成功！',
            duration: 800
          })
          role.children = res.data
        }
      },
      async showSetRightDialog(role) {
        this.roleId = role.id
        this.rightsdialogVisible = true
        const {data : res} = await this.$http.get('rights/tree')
        if (res.meta.status !== 200){
          this.$message.error(
            {
              message: '获取权限失败！',
              duration: 800
            })
        }else{
          this.rightsList = res.data
          this.getLeafKeys(role,this.defKeys)
          // console.log(this.rightsList)
        }


      },
      // 递归获取角色下所有三级权限的id
      getLeafKeys(node,arr) {
        if (!node.children){
          return arr.push(node.id)
        }
        node.children.forEach(item => {
          this.getLeafKeys(item,arr)
        })
      },
      setRightDialogClose() {
        this.defKeys = []
      },
      // 为角色分配权限
      async allocateRights(){
        const keys = [
          ...this.$refs.TreeRef.getCheckedKeys(),
          ...this.$refs.TreeRef.getHalfCheckedNodes()
        ]
        const strKeys = keys.join(',')
        const {data :res} = await this.$http.post
        (`roles/${this.roleId}/rights`,{rids : strKeys})
        if (res.meta.status !== 200){
          this.$message.error(
            {
              message: '分配权限失败！',
              duration: 800
            })
        }else{
          this.$message.success(
            {
              message: '分配权限成功！',
              duration: 800
            })
          await this.getRoleList()
          this.rightsdialogVisible = false
        }

      }

    },

    created() {
      this.getRoleList()
    }
  }
</script>

<style scoped>
    .el-table {
        margin-top: 20px;
    }
    .el-tag {
        margin: 10px;
    }
    .bdtop {
        border-top: 1px solid #ccc;
    }
    .bdbottom {
        border-bottom: 1px solid #ccc;
    }
    .vcenter {
        display: flex;
        align-items: center;
    }
</style>