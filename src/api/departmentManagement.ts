import request from '@/utils/request'

export function getList(data: any) {
  return request({
    url: '/sys/group/list',
    method: 'post',
    data,
  })
}

export function getTree() {
  return request({
    url: '/sys/group/tree',
    method: 'get',
  })
}

export function doSave(data: any) {
  return request({
    url: '/sys/group/add',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/sys/group/modify',
    method: 'put',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/sys/group/delete',
    method: 'delete',
    data,
  })
}

export function doAddUser(data: any) {
  return request({
    url: '/sys/group/add/user',
    method: 'post',
    data,
  })
}

export function doDeleteUser(data: any) {
  return request({
    url: '/sys/group/delete/user',
    method: 'post',
    data,
  })
}
