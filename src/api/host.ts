import request from '@/utils/request'

export function getGroupTree() {
  return request({
    url: '/cmdb/host/group/tree',
    method: 'get',
  })
}

export function getHostList(data: any) {
  return request({
    url: '/cmdb/host/list',
    method: 'post',
    data,
  })
}
