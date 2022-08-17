import { makeAutoObservable } from 'mobx'
import { http, getToken, setToken, clearToken } from '@/utils'

class LoginStore {
  token = getToken() || ''

  constructor() {
    // 将类里面定义的属性变成observable的，方法变成action的，get xxx 变成computed的
    makeAutoObservable(this)
  }

  // 登录
  login = async ({ mobile, code }) => {
    const res = await http.post('/authorizations', {
      mobile,
      code,
    })
    let token = res.data.token
    this.token = token
    setToken(token) // token持久化
  }

  // 退出登录
  loginOut = () => {
    this.token = ''
    clearToken()
  }
}

export default LoginStore
