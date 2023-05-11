import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginStep from '../views/LoginStep/index';
import Login from '../views/Login/index';
import Dashboard from '../views/Dashboard/index';
import CreateAccount from '../views/CreateAccount/index';
import Secret from '../views/secret/index';
import { getSigner, getAlias } from "@/store";


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
        path: '/secret',
        name: 'secret',
        meta: {
            title: "secret",
        },
        component: Secret,
    },
    {
        path: '/',
        name: 'Login',
        meta: {
            title: "Login",
        },
        component: Login,
    },
    {
        path: '/LoginStep',
        name: 'LoginStep',
        meta: {
            title: "LoginStep",
        },
        component: LoginStep,
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: "login",
        },
        component: Login,
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: Dashboard,
    },
    {
        path: '/createAccount',
        name: 'createAccount',
        component: CreateAccount,
    },
];

const router = new VueRouter({
    mode: 'history', // 'hash'
    base: process.env.BASE_URL,
    routes,
});

router.beforeEach((to, from, next) => {
    if (to.path === '/secret') {
        return next()
    }
    if (to.path != '/' && to.path != '/LoginStep' && to.path != '/login') {
        if(!getAlias() || !getSigner()) {
            next('/')
        } else {
            next();
        }
    } else {
        next()
    }

});

export default router;
