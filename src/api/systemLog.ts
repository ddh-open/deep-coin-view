import request from '@/utils/request'

export function getList(data: any) {
  return request({
    url: '/sys/operation/list',
    method: 'post',
    data,
  })
}
