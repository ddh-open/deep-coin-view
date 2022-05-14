import request from '@/utils/request'

export function getList(data: any) {
  return request({
    url: '/sys/menu/list',
    method: 'post',
    data,
  })
}

export function doEdit(data: any) {
  return request({
    url: '/sys/menu/modify',
    method: 'put',
    data,
  })
}

export function doSave(data: any) {
  return request({
    url: '/sys/menu/add',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/sys/menu/delete',
    method: 'delete',
    data,
  })
}
