<template>
    <div class="cate">
<!--        面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
<!--        卡片-->
        <el-card>
            <el-row :gutter="20">
                <el-col :span="9">
                    <el-button type="primary" @click="addCategories">添加分类</el-button>
                </el-col>
            </el-row>
            <!--            角色列表区-->
           <tree-table class="tree_table" :data="categoriesList" :columns="columns"
                       :selection-type="false" :expand-type="false"
                        show-index border>
<!--               是否有效-->
               <template slot="isOk" slot-scope="scope">
                   <i class="el-icon-success"
                   v-if="scope.row.cat_deleted === false"
                   style="color: darkseagreen"></i>
                   <i class="error" v-else></i>
               </template>
<!--               排序模板-->
               <template slot="order" slot-scope="scope">
                   <el-tag size="mini"
                   v-if="scope.row.cat_level===0">一级</el-tag>
                   <el-tag size="mini" type="success"
                   v-else-if="scope.row.cat_level===0">二级</el-tag>
                   <el-tag size="mini" type="warning"
                   v-else>三级</el-tag>
               </template>
<!--               操作模板-->
               <template slot-scope="scope" slot="option">
                   <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                   <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
               </template>

           </tree-table>
            <!--               分页功能-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5,10]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

        </el-card>
        <!--            添加分类的对话框-->
        <el-dialog
                title="分配权限"
                :visible.sync="addCatedialogVisible"
                width="50%"
                @close="addCatedialogClose">
            <el-form :model="addCateForm" :rules="addCateRules" ref="RefForm" label-width="100px">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" >
                    <el-cascader
                            change-on-select
                            clearable
                            v-model="selectedKeys"
                            :props="cascaderProps"
                            :options="parentCateList"
                            expand-trigger="hover"
                            @change="handleChange">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button @click="addCatedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddCate">确 定</el-button>
      </span>
        </el-dialog>

    </div>
</template>

<script>
  export default {
    name: "cate",
    data() {
      return {
        // 商品分类数据列表
        categoriesList: [],
        // 查询字符串
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        // 总数据条数
        total: 0,
        columns:[
          {
            label:'分类名称',
            prop:'cat_name'
          },
          {
            label: '是否有效',
            type: 'template',
            template: 'isOk'
          },
          {
            label: '排序',
            type: 'template',
            template: 'order'
          },
          {
            label: '操作',
            type: 'template',
            template: 'option'
          }
        ],
        // 控制分类对话框
        addCatedialogVisible : false,
        addCateForm: {
          cat_name:'',
          cat_pid:'0',
          // 默认一级分类
          cat_level:'0'

        },
        // 父级分类的列表
        parentCateList:[],
        cascaderProps: {
          // 看到的
          value:'cat_id',
          label:'cat_name',
          children:'children'
        },
        // 选中了父级分类的id数组
        selectedKeys:[],

        addCateRules:{
          cat_name:[
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ]
        }
      }
    },
    methods: {
      // 获取商品分类方法
      async getCategoriesList() {
      const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
        if (res.meta.status !== 200){
          return this.$message.error('获取商品列表失败！')
        }
        // 赋值
        this.categoriesList = res.data.result
        this.total = res.data.total

      },
      addCategories() {
        this.getParentCateList()

        this.addCatedialogVisible = true
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getCategoriesList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCategoriesList()
      },
      // 获取父级分类的列表
     async getParentCateList(){
       const {data: res} =await this.$http.get('categories',
         {params:{type: 2}})
       if (res.meta.status !== 200){
         return this.$message.error('获取分类列表失败！')
       }
       // console.log(res.data)
       this.parentCateList = res.data
      },
      // 选择项发生变化
      handleChange() {
        // console.log(this.selectedKeys)
        // 判断数组长度是否大于0
        if (this.selectedKeys.length > 0){
          this.addCateForm.cat_pid = this.selectedKeys[
            this.selectedKeys.length-1
            ]
          this.addCateForm.cat_level = this.selectedKeys.length
        }else{
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        }
      },
      // 确定添加新的分类
      // 关闭对话框重置表单
      addCatedialogClose(){
        this.$refs.RefForm.resetFields()
        this.selectedKeys = []
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0

      },
      // 添加分类
      sureAddCate() {

        this.$refs.RefForm.validate(async valid => {
          if (!valid) return
         const {data:res} = await this.$http.post
         ('categories',this.addCateForm)
          if (res.meta.status !== 201){
            return this.$message.error('添加分类失败')
          }
          return this.$message.success('添加分类成功')

        })
        this.getCategoriesList()

        this.addCatedialogVisible = false
      }
    },
    created() {
      this.getCategoriesList()
    }
  }
</script>

<style scoped>
    .tree_table {
        margin-top: 20px;
        margin-bottom: 20px;
    }
</style>