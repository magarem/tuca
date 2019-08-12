/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const estoqueRouter = {
  path: '/estoque',
  component: Layout,
  redirect: '/estoque',
  name: 'Estoque',
  meta: {
    title: 'Estoque',
    icon: 'table'
  },
  children: [
    {
      path: 'movimentacoes',
      component: () => import('@/views/estoque/movimentacoes'),
      name: 'Movimentações',
      meta: { title: 'Movimentações' }
    }
  ]
}
export default estoqueRouter
