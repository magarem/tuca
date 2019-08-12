import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://localhost:3000/dev-api/funcionarios',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: 'http://localhost:3000/dev-api/funcionario',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: 'http://localhost:3000/dev-api/funcionario',
    method: 'patch',
    data
  })
}

export function deleteItem(data) {
  return request({
    url: 'http://localhost:3000/dev-api/funcionario',
    method: 'delete',
    data
  })
}
