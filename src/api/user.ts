import request from '@/utils/request'
import { encryptedData, base64Data } from '@/utils/encrypt'
import { loginRSA, loginBase64 } from '@/config'

export async function login(data: any) {
  if (loginRSA) {
    data = await encryptedData(data)
  } else if (loginBase64) {
    data = Object.assign({}, data)
    data.password = await base64Data(data.password)
  }
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}

export async function socialLogin(data: any) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/user/socialLogin',
    method: 'post',
    data,
  })
}

export function getUserInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get',
  })
}

export function register(data: any) {
  return request({
    url: '/user/register',
    method: 'post',
    data,
  })
}
