import { Popover, Layout, Button, Modal, Form, Input, message, Avatar, Steps } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined, LoginOutlined, UserAddOutlined, UserOutlined, SearchOutlined, AudioOutlined } from '@ant-design/icons';
import { checkLogin, checkRegister, checkEmailReset, checkOTP, resetPass } from "../../service/user";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getCookie } from "../../helper/cookie"
import { useAuth } from "../../auth/authContext";
import './header.scss'
import { search } from "../../service/search";
const { Header } = Layout;

const LayoutHeader = (props) => {
    const navigate = useNavigate()
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleResendEmail = async () => {
        if (countdown === 0) {
            try {
                const email = sessionStorage.getItem("email")
                const data = {
                    email: email
                }
                const response = await checkEmailReset(data);
                if (response && response.status == 200) {
                    messageApi.success("Email xác minh đã được gửi lại!");
                    setCountdown(60)
                    return
                }
                setCountdown(60)
                messageApi.error(response.message)
            } catch (error) {
                setCountdown(60)
                console.error("Lỗi validateFields:", error);
                messageApi.error("Vui lòng nhập đúng email trước khi tiếp tục!");
                setConfirm(false)
            }

        }
    };

    const [form] = Form.useForm();
    const { authToken, setAuthToken, openLogin, setOpenLogin, user } = useAuth();
    const location = useLocation();
    useEffect(() => {
        setAuthToken(getCookie("authToken"));
    }, [location]);
    const popover = (
        <>
            <div className="avatar__popup">
                <p onClick={() => navigate("/user-detail")}>Cập nhật thông tin</p>
                <p>Cài đặt</p>
                <Link to="/logout">
                    <p>Đăng xuất</p>
                </Link>
            </div>
        </>
    )
    const { collapsed, setCollapsed } = props;
    const [confirmLoading, setConfirm] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const [openForgotPass, setOpenForgotPass] = useState(false)
    const [openRegister, setOpenRegister] = useState(false)
    const [current, setCurrent] = useState(0);
    const sendEmail = async () => {
        try {
            setConfirm(true)
            const data = form.getFieldValue()
            const response = await checkEmailReset(data);
            if (response && response.status == 200) {
                messageApi.success("Email xác minh đã được gửi!");
                sessionStorage.setItem("email", data.email)
                setCurrent(current + 1);
                form.resetFields();
                setConfirm(false);
                setCountdown(60)
                return
            }
            setConfirm(false)
            messageApi.error(response.message)
        } catch (error) {
            console.error("Lỗi validateFields:", error);
            messageApi.error("Vui lòng nhập đúng email trước khi tiếp tục!");
            setConfirm(false)
        }
    };

    const sendOTP = async () => {
        try {
            setConfirm(true)
            const data = {
                email: sessionStorage.getItem("email"),
                otp: form.getFieldValue().otp
            }
            const response = await checkOTP(data)
            if (!response || response.status !== 200) {
                messageApi.error(response.message)
                setConfirm(false)
                return
            }
            messageApi.success("Xác minh OTP thành công!");
            setCurrent(current + 1);
            form.resetFields();
            setConfirm(false)
        } catch (e) {
            messageApi.error("Mã OTP không chính xác");
            console.log(e.message)
            setConfirm(false)
        }
    }

    const reset = async () => {
        try {
            setConfirm(true)
            const data = {
                email: sessionStorage.getItem("email"),
                password: form.getFieldValue().password
            }
            const response = await resetPass(data)
            if (!response || response.status !== 200) {
                messageApi.error(response.message)
                setConfirm(false)
                return
            }
            messageApi.success("Cập nhật mật khẩu mới thành công");
            setOpenForgotPass(false)
            setAuthToken(getCookie("authToken"));
            form.resetFields();
            setConfirm(false)
        } catch (e) {
            messageApi.error("Cập nhật mật khẩu thất bại");
            console.log(e.message)
            setConfirm(false)
        }
    }

    const steps = [
        {
            content: (
                <>
                    <Form form={form} layout="vertical" >
                        <Form.Item
                            label="Nhập email xác minh"
                            name="email"
                            style={
                                {
                                    marginTop: "15px"
                                }
                            }
                            rules={[
                                { required: true, message: "Vui lòng nhập email!" },
                                { type: "email", message: "Email không hợp lệ!" }
                            ]}
                        >
                            <Input placeholder="abc@gmail.com" />
                        </Form.Item>

                        <Form.Item className="email__reset">

                            <Button loading={confirmLoading} type="primary" onClick={sendEmail} >
                                Tiếp
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            )
        },
        {
            content: (
                <>
                    <span>Không nhận được email?</span>
                    <Button onClick={handleResendEmail} style={{ marginTop: "15px", marginLeft: '5px' }} disabled={countdown > 0}>
                        {countdown ? countdown : ""} Gửi lại email
                    </Button>
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Nhập mã OTP"
                            name="otp"
                            style={
                                {
                                    marginTop: "10px"
                                }
                            }
                            rules={[
                                { required: true, message: "Vui lòng nhập otp" }
                            ]}
                        >
                            <Input placeholder="Mã OTP" />
                        </Form.Item>
                        <Form.Item className="email__reset">
                            <Button loading={confirmLoading} type="primary" onClick={sendOTP} >
                                Tiếp
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            )
        },
        {
            content: (
                <>
                    <Form form={form} layout="vertical">
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            style={
                                {
                                    marginTop: "15px"
                                }
                            }
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu!" },
                                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                            ]}
                            hasFeedback
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Xác nhận mật khẩu"
                            name="confirmPassword"
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                                { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Mật khẩu không khớp!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item className="email__reset">
                            <Button loading={confirmLoading} type="primary" onClick={reset} >
                                Cập nhật mật khẩu
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            )
        },
    ]
    const item = steps.map((_, index) => ({
        key: index,
    }))

    const openModelForgot = () => {
        setCurrent(0)
        setOpenLogin(false)
        setOpenForgotPass(true)
    }
    const closeModelForgot = () => {
        form.resetFields()
        setOpenForgotPass(false)
    }
    const openModelLogin = () => {
        setOpenLogin(true);
    };
    const openModalRegister = () => {
        setOpenRegister(true);
    };

    const closeModelLogin = () => {
        setOpenLogin(false);
    };
    const closeModalRegister = () => {
        setOpenRegister(false);
    };

    const fetchRegister = async () => {
        try {
            setConfirm(true);
            const data = await form.validateFields();
            const response = await checkRegister(data);
            if (response && response.status === 200) {
                messageApi.success("Đăng ký thành công!");
                setAuthToken(getCookie("authToken"));
                setOpenRegister(false);
                form.resetFields()
            } else {
                messageApi.error(response?.message || "Đăng ký thất bại!");
            }
        } catch (e) {
            console.log(e)
            messageApi.error("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setConfirm(false);
        }
    }

    const fetchLogin = async () => {
        try {
            setConfirm(true);
            const data = await form.getFieldValue();
            const response = await checkLogin(data);

            if (response && response.status === 200) {
                messageApi.success("Đăng nhập thành công!");
                setAuthToken(getCookie("authToken"));
                setOpenLogin(false);
                form.resetFields()
            } else {
                messageApi.error(response?.message || "Đăng nhập thất bại!");
            }
        } catch (e) {
            console.log(e)
            messageApi.error("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setConfirm(false);
        }
    };
    const [searchValue, setSearchValue] = useState("");
    const [dataSearch, setDataSearch] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (searchValue.trim() === "") {
            setDataSearch([]);
            return;
        }

        const fetchData = async () => {
            const response = await search({ keyword: searchValue });
            if (response && response.status === 200) {
                setDataSearch(response.data.data);
                setOpen(true);
            }
        };

        fetchData();
    }, [searchValue, search]);

    const handleChangeSearch = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSelectSong = (slug) => {
        navigate(`/songs/${slug}`);
        setSearchValue("");
        setDataSearch([]);
        setOpen(false);
    };

    const handleSearch = () => {
        navigate(`/search?keyword=${searchValue}`);
        setSearchValue("");
        setOpen(false);
    };

    const contentSearch = (
        <>
            {
                dataSearch?.map((item) => (
                    <div
                        onClick={() => handleSelectSong(item.slug)}
                        key={item.id}
                        className="total__search"
                        style={{ display: "flex", alignItems: "center", padding: "8px", cursor: "pointer" }}
                    >
                        <Avatar src={item.avatar} size={50} alt={item.title} shape="square" />
                        <div style={{ marginLeft: "10px" }}>
                            <p style={{ margin: 0 }}>{item.title}</p>
                            <span>
                                <AudioOutlined /> {item?.listSinger.map(singer => (
                                    <span key={singer.id}>{singer.fullName}</span>
                                ))}
                            </span>
                        </div>
                    </div>
                ))}
        </>
    );
    return (
        <>
            {contextHolder}

            <Header className="layout__header">
                <div className="layout__header--left">
                    <Button
                        className="button-collapsed"
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                    />
                    <Popover
                        trigger="click"
                        content={<><div className="popover-content">{contentSearch}</div></>}
                        arrow={false}
                        open={open} // Kiểm soát Popover bằng state
                        onOpenChange={setOpen} // Cập nhật trạng thái Popover khi mở/tắt
                    >
                        <Input
                            prefix={<SearchOutlined />}
                            className="layout__header--search"
                            placeholder="Tìm kiếm"
                            value={searchValue}
                            onChange={handleChangeSearch}
                            onPressEnter={handleSearch}
                        />
                    </Popover>
                </div>
                <div className="layout__header--right">
                    {authToken ?
                        (
                            <>
                                <Popover arrow={false}
                                    placement="bottomRight" content={popover} trigger="click">
                                    {user?.avatar ? (
                                        <Avatar className="avatar" size={60} src={user.avatar} alt="Avatar" />
                                    ) : (
                                        <Avatar className="avatar" size={60} icon={<UserOutlined />} />
                                    )}
                                </Popover>
                            </>
                        ) :
                        (
                            <>
                                <Button onClick={openModelLogin} className="button__login" icon={<LoginOutlined />} type="primary">
                                    Đăng nhập
                                </Button>
                                <Button onClick={openModalRegister} className="button__register" icon={<UserAddOutlined />}>
                                    Đăng ký
                                </Button>
                            </>
                        )}
                </div>
            </Header>

            <Modal
                key="login"
                confirmLoading={confirmLoading}
                closable={false}
                centered
                title="Đăng nhập"
                open={openLogin}
                onCancel={closeModelLogin}
                footer={[
                    <Button loading={confirmLoading} key="submit" type="primary" onClick={fetchLogin}>
                        Đăng nhập
                    </Button>,
                    <Button key="cancel" onClick={closeModelLogin}>
                        Hủy
                    </Button>
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" }
                        ]}
                    >
                        <Input type="email" placeholder="abc@gmail.com" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
                <span onClick={openModelForgot} className="forgot__password">Quên mật khẩu?</span>
            </Modal>

            <Modal
                key='register'
                confirmLoading={confirmLoading}
                closable={false}
                centered
                title="Đăng ký tài khoản"
                open={openRegister}
                onCancel={closeModalRegister}
                footer={[
                    <Button loading={confirmLoading} key="submit" type="primary" onClick={fetchRegister}>
                        Tạo tài khoản
                    </Button>,
                    <Button key="cancel" onClick={closeModalRegister}>
                        Hủy
                    </Button>
                ]}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Họ và tên"
                        name="fullName"
                        rules={[
                            { required: true, message: "Vui lòng không bỏ trống dòng này" },
                        ]}
                    >
                        <Input placeholder="Nguyễn Văn A" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Vui lòng nhập email!" },
                            { type: "email", message: "Email không hợp lệ!" },
                        ]}
                    >
                        <Input placeholder="abc@gmail.com" />
                    </Form.Item>

                    <Form.Item
                        label="Mật khẩu"
                        name="password"
                        rules={[
                            { required: true, message: "Vui lòng nhập mật khẩu!" },
                            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue("password") === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error("Mật khẩu không khớp!"));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                key="forgot"
                confirmLoading={confirmLoading}
                closable={false}
                centered
                open={openForgotPass}
                onCancel={closeModelForgot}
                footer={
                    []
                }
            >
                <Steps current={current} items={item} />
                {steps[current].content}
            </Modal>
        </>
    );
};

LayoutHeader.propTypes = {
    collapsed: PropTypes.bool.isRequired,
    setCollapsed: PropTypes.func.isRequired
};

export default LayoutHeader;
