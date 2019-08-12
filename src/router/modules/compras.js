/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const comprasRouter = {
  path: '/compras',
  component: Layout,
  redirect: '/compras',
  name: 'Compras',
  meta: {
    title: 'Compras',
    icon: 'table'
  },
  children: [
    {
      path: 'compras',
      component: () => import('@/views/compras/compras'),
      name: 'Compras',
      meta: { title: 'Compras' }
    },
    {
      path: 'entrada',
      component: () => import('@/views/compras/entradas'),
      name: 'Entradas',
      meta: { title: 'Entradas' }
    }
  ]
}
export default comprasRouter
