<template id="login">
        <div class="login_container">
            <div class="login_box">
                <div class="avatar_box">
                    <img src="../assets/img/logo.png" alt="">
                </div>
                <!--            提示区-->
                <div class="tips">
                    <span>电商后台管理系统</span>
                </div>
                <!--            登录表单区域 -->
                <el-form class="login_form"
                         :model="loginForm"
                         :rules="loginFormRules"
                         ref="loginFormRef">
                    <!--                用户名-->
                    <el-form-item prop="username">
                        <el-input prefix-icon="el-icon-user-solid"
                                  placeholder="请输入用户名"
                                  v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <!--                    密码-->
                    <el-form-item prop="password">
                        <el-input prefix-icon="el-icon-lock"
                                  placeholder="请输入密码"
                                  v-model="loginForm.password"
                                  type="password"></el-input>
                    </el-form-item>

                    <el-form-item class="btn">
                        <span class="register">
                            <a href=""><span>没有账户？立即注册>></span></a>
                        </span>
                        <el-button type="primary" @click="login">登录</el-button>
                        <el-button type="info" @click="resetLoginForm">重置</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </div>
</template>
<script>
  export default {
    name: "Login",
    data() {
      return {
        // 这是登录表单的数据
        loginForm: {
          username: 'admin',
          password: '123456'

        },
        // 表单的验证规则
        loginFormRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入用户密码', trigger: 'blur' },
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      resetLoginForm() {
        this.$refs.loginFormRef.resetFields();
      },
      login() {
        this.$refs.loginFormRef.validate(async valid => {
          if (!valid) return
            const {data:res} = await this.$http.post('login',this.loginForm)
            if (res.meta.status !== 200) {
              this.$message.error('登录失败')
          }else {
              this.$message.success({
                message:'登录成功',
                duration:600
              })

              // 保存服务器返回的token
              // token只应该在网站打开期间生效，所以将token保存在sessionStroage中
              // 跳转到/home主页
              console.log(res)
              window.sessionStorage.setItem('token',res.data.token);
              this.$router.push('/home');

            }


        })
      }
    }
  }
</script>

<style scoped>

    .login_container {
        position: relative;
        height: 100%;
        background-color: #2b4b6b;

    }
    .login_box {
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 10px 10px 40px #000;
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%,-50%);
    }
    .tips {
        text-align: center;
        margin-top: 15%;
    }
    .tips span {
        font-size: 20px;
        color: #928f8f;
    }
    .avatar_box {
        height: 100px;
        width: 100px;
        border: 1px solid #ccc;
        border-radius: 50%;
        background-color: #ccc;
        box-shadow: 0 0 10px #ccc;
        position:absolute;
        left:50%;
        transform:translate(-50%,-50%);

    }
    .avatar_box img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
    }
    .register {
        margin: 10px;
    }
    .register a {
        text-decoration: none;
        color: #4c3f3f;
    }
    .btn {
        display: flex;
        justify-content: flex-end;
    }
    .login_form {
        margin-bottom: -10px;
        position: absolute;
        bottom: 0;
        width: 90%;
        padding: 20px;
        /*box-sizing: border-box;*/
    }

</style>