import request from '@/utils/request'

export function getTree() {
  return request({
    url: '/sys/menu/get/tree',
    method: 'get',
  })
}
