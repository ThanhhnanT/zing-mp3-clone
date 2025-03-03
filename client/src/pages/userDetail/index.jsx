import { Image, Upload, Button, Row, Col, Form, Checkbox, Input, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/authContext'
import ImgCrop from 'antd-img-crop'
import "./userDetail.scss"
import { upAvatar, updateInfor } from '../../service/user'

function UserDetail() {
    const [messageApi, contextHolder] = message.useMessage()
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader()
            console.log(reader)
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = (error) => reject(error)
        })

    const [form] = Form.useForm()
    const [change, setChange] = useState(true)
    const [previewOpen, setPreviewOpen] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [fileList, setFileList] = useState([])
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()
    useEffect(() => {
        if (user) {
            const userData = user
            form.setFieldsValue(userData)

            // Nếu có avatar từ API, hiển thị nó
            if (userData.avatar) {
                setFileList([
                    {
                        uid: '-1',
                        name: 'avatar.png',
                        status: 'done',
                        url: userData.avatar, // URL ảnh từ API
                    },
                ])
            }
        }
    }, [user])

const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList.slice(-1)) // Chỉ giữ lại 1 ảnh
}

const onPreview = async (file) => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
}

const changeInfor = async (values) => {
    try {
        setLoading(true)
        let avatarUrl = fileList[0]?.url || '' // Nếu không có ảnh mới, giữ ảnh cũ
        // Nếu có ảnh mới, gửi lên backend
        if (fileList[0]?.originFileObj) {
            const formData = new FormData()
            formData.append('avatar', fileList[0].originFileObj) // 'avatar' phải trùng với backend
            const uploadResponse = await upAvatar(formData)
            avatarUrl = uploadResponse.data.avatar
        }

        // Gửi dữ liệu cập nhật user lên backend
        const userData = { ...values, avatar: avatarUrl }
        await updateInfor(userData)

        messageApi.success('Cập nhật thành công!')
    } catch (error) {
        setLoading(true)
        console.error('Lỗi cập nhật thông tin:', error)
        messageApi.error('Có lỗi xảy ra, vui lòng thử lại!')
    } finally{
        setLoading(false)
    }
}

return (
    <>
        {contextHolder}
        <h1>Trang cá nhân</h1>
        <Checkbox
            checked={!change}
            onChange={(e) => setChange(!e.target.checked)}
            className='checkbox'
        >
            Chỉnh sửa
        </Checkbox>
        <Form
            form={form}
            disabled={change}
            layout="vertical"
            onFinish={changeInfor}
        >
            <Row gutter={[20, 20]}>
                <Col className='change' span={12}>
                    <div className='change__name'>
                        <Form.Item label="Họ và tên" name="fullName">
                            <Input />
                        </Form.Item>
                    </div>
                    <div className='change__email'>
                        <Form.Item label="Email" name="email">
                            <Input />
                        </Form.Item>
                    </div>
                    <Button loading={loading} htmlType='submit' type='primary'>
                        Cập nhật
                    </Button>
                </Col>
                <Col span={10} className='change__avatar'>
                    <ImgCrop rotationSlider>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={onPreview}
                            onChange={onChange}
                            maxCount={1} // Giới hạn 1 ảnh
                        >
                            {fileList.length >= 1 ? null : (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Cập nhật avatar</div>
                                </div>
                            )}
                        </Upload>
                    </ImgCrop>

                    {previewImage && (
                        <Image
                            wrapperStyle={{ display: 'none' }}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}
                </Col>
            </Row>
        </Form>
    </>
)
}

export default UserDetail
