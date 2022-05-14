import request from '@/utils/request'

export function getIconList(data: any) {
  return request({
    url: '/sys/icon/list',
    method: 'post',
    data,
  })
}
