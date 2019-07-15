import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'http://localhost:3000/dev-api/produtos',
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

export function createArticle(data) {
  return request({
    url: 'http://localhost:3000/dev-api/produto',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: 'http://localhost:3000/dev-api/produto',
    method: 'patch',
    data
  })
}
