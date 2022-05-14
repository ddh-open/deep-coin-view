import request from '@/utils/request'
import { base64Data } from '@/utils/encrypt'

export function getList(data: any) {
  return request({
    url: '/user/list',
    method: 'post',
    data,
  })
}

export async function doEdit(data: any) {
  data = Object.assign({}, data)
  data.password = await base64Data(data.password)
  return request({
    url: '/user/modify',
    method: 'put',
    data,
  })
}

export async function doSave(data: any) {
  data = Object.assign({}, data)
  data.password = await base64Data(data.password)
  return request({
    url: '/user/add',
    method: 'post',
    data,
  })
}

export function doDelete(data: any) {
  return request({
    url: '/user/delete',
    method: 'delete',
    data,
  })
}
