import request from '@/utils/request'

export function getList(data: any) {
  return request({
    url: '/sys/roles/list',
    method: 'post',
    data,
  })
}

export function getTree() {
  return request({
    url: '/sys/roles/tree',
    method: 'get',
  })
}

export function doEdit(data: any) {
  return request({
    url: '/sys/roles/modify',
    method: 'put',
    data,
  })
}

export function doSave(data: any) {
  return request({
    url: '/sys/roles/add',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/sys/roles/delete',
    method: 'delete',
    data,
  })
}
