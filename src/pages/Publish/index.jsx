import { useState, useRef, useEffect } from 'react'
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  Modal,
  message,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useSearchParams } from 'react-router-dom'
// 富文本编辑器
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { http } from '@/utils'
import './index.scss'

const { Option } = Select

// 文件转base64编码
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

const Publish = () => {
  const { channelStore } = useStore()
  const cacheImgList = useRef([]) // 暂存图片列表
  const [form] = Form.useForm()

  // 存放上传图片的列表
  const [fileList, setFileList] = useState([])
  // 上传成功回调
  const onUploadChange = (info) => {
    // 上传成功回调
    const fileList = info.fileList.map((file) => {
      if (file.response) {
        return {
          url: file.response.data.url,
        }
      }
      return file
    })
    setFileList(fileList)
    cacheImgList.current = fileList
  }

  // 编辑文章跳转过来的时候，会携带文章的id (有id就是编辑文章，没有id就是新发布文章)
  const [params] = useSearchParams()
  const articleId = params.get('id')
  useEffect(() => {
    // 如果是编辑文章，获取文章详情，进行数据的回显操作
    const getArticle = async () => {
      const res = await http.get(`/mp/articles/${articleId}`)
      const { cover, ...formValue } = res.data
      // 动态设置表单数据
      const type = cover.type > 1 ? 3 : cover.type
      form.setFieldsValue({ ...formValue, type })
      const imageList = cover.images.map((url) => ({ url }))
      setFileList(imageList)   // 设置图片
      setImgCount(type)  // 设置上传最大图片数量
      cacheImgList.current = imageList    // 缓存图片
    }
    if (articleId) {
      // 拉取数据回显
      getArticle()
    }
  }, [articleId, form])

  // 预览图片
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const onPreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    )
  }
  const handleCancel = () => setPreviewVisible(false)

  // 控制上传图片的数量
  const [imgCount, setImgCount] = useState(1)
  const changeType = (e) => {
    const count = e.target.value
    setImgCount(count)

    // 解决单张图片和三图切换的bug
    if (count === 1) {
      // 单图，只展示第一张
      const firstImg = cacheImgList.current[0]
      setFileList(!firstImg ? [] : [firstImg])
    } else if (count === 3) {
      // 三图，展示所有图片
      setFileList(cacheImgList.current)
    }
  }

  // 文章上传
  const finish = async (values) => {
    // 数据的二次处理 重点是处理cover字段
    const { channel_id, content, title, type } = values
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type,
        images: fileList.map((item) => item.url),
      },
    }
    try {
      if(articleId){
        // 编辑
        await http.put(`/mp/articles/${articleId}?draft=false`, params)
        message.success('文章编辑成功')
      }else{
        // 新增
        await http.post('/mp/articles?draft=false', params)
        message.success('文章发布成功')
      }
    } catch {
      message.error('文章操作失败')
    }
  }

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {articleId ? '修改文章' : '发布文章'}
            </Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          onFinish={finish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelStore.channelList.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                )
              })}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={changeType}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                maxCount={imgCount}
                onPreview={onPreview}
                onChange={onUploadChange}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            initialValue=""
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <ReactQuill
              theme="snow"
              className="publish-quill"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {articleId ? '修改文章' : '发布文章'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      {/* 图片预览弹窗 */}
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )
}

export default observer(Publish)
