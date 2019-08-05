/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table',
  name: 'Vendas',
  meta: {
    title: 'Vendas',
    icon: 'table'
  },
  children: [
    {
      path: 'balcao',
      component: () => import('@/views/table/balcao'),
      name: 'bacão',
      meta: { title: 'Balcão' }
    },
    {
      path: 'produtos',
      component: () => import('@/views/table/produtos'),
      name: 'Produtos',
      meta: { title: 'Produtos' }
    },
    {
      path: 'vendas',
      component: () => import('@/views/table/vendas'),
      name: 'Vendas_',
      meta: { title: 'Vendas' }
    }
  ]
}
export default tableRouter
