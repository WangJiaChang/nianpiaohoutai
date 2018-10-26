import Vue from 'vue'
import Router from 'vue-router'
import shanghuguanli from '@/components/shanghuguanli'
import login from '@/components/login'
import password from '@/components/password'
import chanpinguanli from '@/components/chanpinguanli'
import dingdanguanli from '@/components/dingdanguanli'
import hexiaojilu from '@/components/hexiaojilu'
import tixianguanli from '@/components/tixianguanli'
import nianpiaoguanli from '@/components/nianpiaoguanli'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',//默认页面
      component: login
    },{
      path: '/login',//登陆页面
      name: 'login',
      component: login
    },{
      path:'/password',//修改密码页面
      name:'password',
      component:password
    },{
      path:'/chanpinguanli',//产品管理
      name:'chanpinguanli',
      component:chanpinguanli
    },{
      path:'/shanghuguanli',//商户管理
      name:'shanghuguanli',
      component:shanghuguanli
    },{
      path: '/dingdanguanli',//订单管理
      name: 'dingdanguanli',
      component: dingdanguanli
    },{
      path:'/hexiaojilu',//核销记录
      name:'hexiaojilu',
      component:hexiaojilu
    },{
      path:'/tixianguanli',//提现管理
      name:'tixianguanli',
      component:tixianguanli
    },{
      path:'/nianpiaoguanli',//年票管理
      name:'nianpiaoguanli',
      component:nianpiaoguanli
    }
  ]
})
