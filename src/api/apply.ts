import request from '@/utils/request'

export function checkTask(data: any) {
  return request({
    url: '/v1/workflow/task/complete',
    method: 'post',
    data,
  })
}

export function publishComplete(data: any) {
  return request({
    url: '/cluster/apply/publish/complete/' + data,
    method: 'get',
  })
}

export function getList(data: any) {
  return request({
    url: '/cluster/apply/list',
    method: 'post',
    data,
  })
}

export async function doEdit(data: any) {
  return request({
    url: '/cluster/apply/modify',
    method: 'put',
    data,
  })
}

export async function doSave(data: any) {
  return request({
    url: '/cluster/apply/save',
    method: 'post',
    data,
  })
}

export function doDelete(id: string) {
  return request({
    url: '/cluster/apply/delete/' + id,
    method: 'delete',
  })
}
