import { Form, Input, Row, Col, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import "./adminLogin.scss"
import { adminLogin } from '../../../service/admin/admin'
import { useAuth } from '../../../auth/authContext'
import { getCookie } from '../../../helper/cookie'
function AdminLogin() {
    const navigate = useNavigate()
    const { setAdminToken } = useAuth()
    const [form] = Form.useForm()
    const handleLogin = async (e) => {
        const response = await adminLogin(e);
        if (response) {
            setAdminToken(getCookie("adminToken"))
            navigate("/admin")
        }
    }
    return (
        <>
            <Row >
                <Col className='login__modal' offset={8} span={8} >
                    <h1>Đăng nhập Admin</h1>
                    <Form onFinish={handleLogin} layout='vertical' form={form}>
                        <Form.Item
                            label="Tên tài khoản"
                            name='email'
                        >
                            <Input placeholder='Nhập email của bạn' />
                        </Form.Item>
                        <Form.Item
                            label="Mật khẩu"
                            name='password'
                        >
                            <Input.Password />
                        </Form.Item>
                        <Button className='button__login--admin' htmlType='submit' type='primary'>
                            Đăng nhập
                        </Button>
                    </Form>

                </Col>
            </Row>
        </>
    )
}

export default AdminLogin