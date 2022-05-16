import request from '@/utils/request'

export function getList(data: any) {
  return request({
    url: '/sys/api/list',
    method: 'post',
    data,
  })
}

export function getApiTree() {
  return request({
    url: '/sys/api/tree',
    method: 'get',
  })
}

export function doApiRoleSave(data: any) {
  return request({
    url: '/sys/api/role',
    method: 'post',
    data,
  })
}

export async function doEdit(data: any) {
  return request({
    url: '/sys/api/modify',
    method: 'put',
    data,
  })
}

export async function doSave(data: any) {
  return request({
    url: '/sys/api/add',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/sys/api/delete',
    method: 'delete',
    data,
  })
}
