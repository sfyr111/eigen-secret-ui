import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login/index';
import Dashboard from '../views/Dashboard/index';




// cache origin push method
const originalPush = VueRouter.prototype.push
const originalReplace = VueRouter.prototype.replace

// rewrite push method
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject)
  }
  return originalPush.call(this, location).catch((err) => {
    if (VueRouter.isNavigationFailure(err)) {
      return err
    }
    
    return Promise.reject(err)
  })
}

VueRouter.prototype.replace = function (location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject)
  }
  return originalReplace.call(this, location).catch((err) => {
    if (VueRouter.isNavigationFailure(err)) {
      return err
    }
    return Promise.reject(err)
  })
}

Vue.use(VueRouter);

const routes = [
  /* {
    path: '/',
    name: 'tlogin',
    meta: {
      title: "thirdLogin",
      hideHeader: true,
    },
    component: ThirdLogin,
  }, */
  {
    path: '/',
    name: 'login',
    meta: {
      title: "login",
    },
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: {
      title: "dashboard",
    },
    component: Login,
  },
  
];

const router = new VueRouter({
  mode: 'history', // 'hash'
  base: process.env.BASE_URL,
  routes,
});

export default router;
