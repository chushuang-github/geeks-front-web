import { useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import './index.scss'

const { Header, Sider } = Layout

const GeekLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { userStore, loginStore, channelStore } = useStore()

  useEffect(() => {
    userStore.getUserInfo()
    channelStore.getChannel()
  }, [userStore, channelStore])

  const items = [
    { label: <Link to="/">数据概览</Link>, icon: <HomeOutlined />, key: '/' }, // 菜单项务必填写 key
    { label: <Link to="/article">内容管理</Link>, icon: <DiffOutlined />, key: '/article' },
    { label: <Link to="/publish">发布文章</Link>, icon: <EditOutlined />, key: '/publish' },
  ];

  // 退出登录
  const confirm = () => {
    loginStore.loginOut()
    navigate('/login')
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm
              title="是否确认退出？"
              okText="退出"
              cancelText="取消"
              placement="bottomRight"
              onConfirm={confirm}
            >
              <LogoutOutlined /> 退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[location.pathname]}
            defaultSelectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
          >
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 路由占位组件 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
  )
}

export default observer(GeekLayout)
