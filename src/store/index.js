import React from 'react'
import LoginStore from './login.Store'
import UserStore from './user.Store'
import ChannelStore from './channel.Store'

class RootStore {
  constructor() {
    this.loginStore = new LoginStore()
    this.userStore = new UserStore()
    this.channelStore = new ChannelStore()
  }
}

// useStore函数封装，页面里面可以通过useStore函数获取mobx仓库里面的状态
let rootStore = new RootStore()
let Context = React.createContext(rootStore)
let useStore = () => React.useContext(Context)
export { useStore }
