import Vue from 'vue'
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css';
// import Login from '../components/Login'

// 这是路由的懒加载方式
const Login = () => import('components/Login')
const Home =() => import('components/Home')
const Welcome = ()=> import('components/Welcome')
const  User= ()=> import('components/user/User')
const  Rights= ()=> import('components/power/rights')
const  Roles= ()=> import('components/power/roles')
const  Cate= ()=> import('components/goods/cate')
const  GoodsList= ()=> import('components/goods/goodsList')
const  Params= ()=> import('components/goods/params')
const  Order= ()=> import('components/order/order')


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'Login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: User
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles

      },
      {
        path: '/categories',
        component: Cate

      },
      {
        path: '/goods',
        component: GoodsList

      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/orders',
        component: Order
      }
    ]
  }


]
const router = new VueRouter({
  routes,
  mode: 'history'
})

// 挂在路由导航守卫
router.beforeEach((to, from, next) => {

  // to表示将要访问的路径
  // from代表从哪个路径而来
  // next表示放行， next（/login），强制跳转
  if(to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()


})




export default router
