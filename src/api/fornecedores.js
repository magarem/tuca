import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://localhost:3000/dev-api/fornecedores',
    method: 'get',
    params: query
  })
}

export function fetchList_vendaItens(query) {
  return request({
    url: 'http://localhost:3000/dev-api/vendaItens',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: 'http://localhost:3000/dev-api/produto',
    method: 'delete',
    params: { pv }
  })
}

export function create(data) {
  return request({
    url: 'http://localhost:3000/dev-api/fornecedor',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: 'http://localhost:3000/dev-api/fornecedor',
    method: 'patch',
    data
  })
}

export function deleteItem(data) {
  return request({
    url: 'http://localhost:3000/dev-api/fornecedor',
    method: 'delete',
    data
  })
}
