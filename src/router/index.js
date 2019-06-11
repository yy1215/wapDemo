import Vue from 'vue'
import VueRouter from 'vue-router'
import index from '@/components/index'
import details from '@/components/details'
import search from '@/components/search'
import shoppingCart from '@/components/shoppingCart'
import userCenter from '@/components/userCenter'

Vue.use(VueRouter)


var router = new VueRouter({
  routes: [
    { path: '/', redirect: '/index' },
    {
      path: '/index',
      name: 'index',
      component: index
    },
    {
      path: '/details',
      name: 'details',
      component: details
    },
    {
      path: '/search',
      name: 'search',
      component: search
    },
    {
      path: '/shoppingCart',
      name: 'shoppingCart',
      component: shoppingCart
    },
    {
      path: '/userCenter',
      name: 'userCenter',
      component: userCenter
    }
  ],
  linkActiveClass:'mui-active'  //覆盖默认的路由高亮的类
})

export default router