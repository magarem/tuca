/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const cadastrosRouter = {
  path: '/cadastros',
  component: Layout,
  redirect: '/cadastros',
  name: 'Cadastros',
  meta: {
    title: 'Cadastros',
    icon: 'table'
  },
  children: [
    {
      path: 'clientes',
      component: () => import('@/views/cadastros/clientes'),
      name: 'Clientes',
      meta: { title: 'Clientes' }
    },
    {
      path: 'fornecedores',
      component: () => import('@/views/cadastros/fornecedores'),
      name: 'Fornecedores',
      meta: { title: 'Fornecedores' }
    }
  ]
}
export default cadastrosRouter
