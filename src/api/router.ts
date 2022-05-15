import request from '@/utils/request'

export function getTree() {
  return request({
    url: '/sys/menu/get/tree',
    method: 'get',
  })
}

export function getUserMenuTree() {
  return request({
    url: '/sys/menu/user',
    method: 'get',
  })
}
