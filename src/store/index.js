import React from 'react'
import LoginStore from './login.Store'

class RootStore {
  constructor() {
    this.loginStore = new LoginStore()
  }
}

let rootStore = new RootStore()
let Context = React.createContext(rootStore)
let useStore = () => React.useContext(Context)
export { useStore }
