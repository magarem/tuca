import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://localhost:3000/dev-api/clientes',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: 'http://localhost:3000/dev-api/cliente',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: 'http://localhost:3000/dev-api/cliente',
    method: 'patch',
    data
  })
}

export function deleteItem(data) {
  return request({
    url: 'http://localhost:3000/dev-api/cliente',
    method: 'delete',
    data
  })
}
