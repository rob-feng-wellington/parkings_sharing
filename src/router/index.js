import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Signup from '@/components/Signup'
import Dashboard from '@/components/Dashboard'
import Request from '@/components/Request'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/request',
      name: 'Request',
      component: Request
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    }
  ]
})
