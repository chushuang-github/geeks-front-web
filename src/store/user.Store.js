import { makeAutoObservable } from 'mobx'
import { http } from '@/utils'

class UserStore {
  userInfo = {}
  constructor() {
    makeAutoObservable(this)
  }

  // 获取用户信息
  getUserInfo = async () => {
    const res = await http.get('/user/profile')
    this.userInfo = res.data
  }
}

export default UserStore