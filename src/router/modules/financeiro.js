/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const financeiroRouter = {
  path: '/financeiro',
  component: Layout,
  redirect: '/financeiro',
  name: 'Financeiro',
  meta: {
    title: 'Financeiro',
    icon: 'table'
  },
  children: [
    {
      path: 'caixa',
      component: () => import('@/views/financeiro/caixa'),
      name: 'Caixa',
      meta: { title: 'Caixa' }
    }
  ]
}
export default financeiroRouter
