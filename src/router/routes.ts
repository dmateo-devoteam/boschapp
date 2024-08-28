import { RouteRecordRaw } from 'vue-router';
import TabsPage from '@/views/TabsPage.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/inicio',
    meta: {requiresLogin: false}
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/inicio',
        meta: {requiresLogin: false}
      },
      {
        path: 'inicio',
        component: () => import('@/views/Inicio.vue'),
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        meta: {requiresLogin: false}
      },
      {
        path: 'formacion',
        component: () => import('@/views/Formacion.vue'),
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        meta: {requiresLogin: true}
      },
      {
        path: 'mas',
        component: () => import('@/views/Mas.vue'),
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        meta: {requiresLogin: true}
      },
      {
        path: 'contactos',
        component: () => import('@/views/Contactos.vue'),
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        meta: {requiresLogin: true}
      },
      {
        path: 'noticias',
        component: () => import('@/views/Noticias.vue'),
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        meta: {requiresLogin: true},
      },
      {
        path: '/familias/:id',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/Familias.vue'),
      },
      {
        path: '/potencias/:id',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/Potencias.vue')
      },
      {
        path: '/productos/:idPower',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/Productos.vue')
      }, {
        path: '/producto/:idProduct',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/Producto.vue')
      },
      {
        path: '/noticia-detalle/:id',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/NoticiaDetalle.vue')
      },
      {
        path: '/buscar-averias/:productId/:powerId/:familyId/:categoryId',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/BuscarAverias.vue')
      },
      {
        path: '/averias/:productId/:powerId/:familyId/:categoryId',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/Averias.vue')
      },
      {
        path: '/videos/:id',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/Videos.vue')
      },
      {
        path: '/qr',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/Qr.vue')
      },
      {
        path: '/buscar/:reference?',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/Buscar.vue')
      },
      {
        path: '/buscar-averias',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/BuscarAverias.vue')
      },
      {
        path: '/averia-detalle/:id',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/AveriaDetalle.vue')
      },
      {
        path: '/tutorial',
        meta: {requiresLogin: false},
        component: () => import('@/views/Tutorial.vue')
      },
      {
        path: '/images/:productId/:powerId/:familyId/:categoryId/:imageType',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/Images.vue')
      },
      {
        path: '/image/:productId/:powerId/:familyId/:categoryId/:imageType/:imageName?',
        meta: {requiresLogin: true},
        beforeEnter: (to, from, next) => checkIsAuthorizedToGo(to, from, next),
        component: () => import('@/views/Image.vue')
      }
    ]
  }
]
//TODO es posible refactorizar, llevarla a un archivo de utilidades y todavía está en WIP
function checkIsAuthorizedToGo(to: any, from: any, next: any) {
  const isAuth = localStorage.getItem('token') || null
  if (to.meta.requiresLogin && !isAuth) {
    next({path: '/'})
    location.reload()
  } else next()
}

export default routes