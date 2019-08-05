import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://localhost:3000/dev-api/compras',
    method: 'get',
    params: query
  })
}

export function fetchList_compraItens(query) {
  return request({
    url: 'http://localhost:3000/dev-api/compraItens',
    method: 'get',
    params: query
  })
}
