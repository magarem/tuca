/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const vendasRouter = {
  path: '/vendas',
  component: Layout,
  redirect: '/vendas',
  name: 'Vendas',
  meta: {
    title: 'Vendas',
    icon: 'table'
  },
  children: [
    {
      path: 'vendas',
      component: () => import('@/views/vendas/vendas'),
      name: 'Vendas_',
      meta: { title: 'Vendas' }
    },
    {
      path: 'balcao',
      component: () => import('@/views/vendas/balcao'),
      name: 'bacão',
      meta: { title: 'Balcão' }
    }
  ]
}
export default vendasRouter
