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
    },
    {
      path: 'funcionarios',
      component: () => import('@/views/cadastros/funcionarios'),
      name: 'Funcionarios',
      meta: { title: 'Funcionários' }
    },
    {
      path: 'produtos',
      component: () => import('@/views/cadastros/produtos'),
      name: 'Produtos',
      meta: { title: 'Produtos' }
    }
  ]
}
export default cadastrosRouter
