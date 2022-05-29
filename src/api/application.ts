import request from '@/utils/request'

export function getList(data: any) {
  return request({
    url: '/cluster/application/list',
    method: 'post',
    data,
  })
}

export function getPublishList(data: any) {
  return request({
    url: '/cluster/apply/publish/list',
    method: 'post',
    data,
  })
}

export function getAppBranch(data: any) {
  return request({
    url: '/cluster/application/branch/' + data,
    method: 'get',
  })
}

export function publishAction(data: any) {
  return request({
    url: '/cluster/application/publish/' + data.aid + '/' + data.sid,
    method: 'get',
  })
}

export function publishStop(data: any) {
  return request({
    url: '/cluster/application/publish/stop/' + data.aid + '/' + data.sid,
    method: 'get',
  })
}

export function publishHistory(data: any) {
  return request({
    url: '/cluster/application/publish/' + data.env + '/' + data.sid,
    method: 'post',
    data,
  })
}

export async function doEdit(data: any) {
  return request({
    url: '/cluster/application/modify',
    method: 'put',
    data,
  })
}

export async function doSave(data: any) {
  return request({
    url: '/cluster/application/save',
    method: 'post',
    data,
  })
}

export function doDelete(id: string) {
  return request({
    url: '/cluster/application/delete/' + id,
    method: 'delete',
  })
}

export async function doAddConfig(data: any) {
  return request({
    url: '/cluster/application/add/config',
    method: 'post',
    data,
  })
}

export async function doEditConfig(data: any) {
  return request({
    url: '/cluster/application/modify/config',
    method: 'put',
    data,
  })
}

export async function doDeleteConfig(data: any) {
  return request({
    url: '/cluster/application/delete/config',
    method: 'delete',
    data,
  })
}
