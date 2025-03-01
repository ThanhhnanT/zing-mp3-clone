import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Layout, Menu, Button, ConfigProvider } from "antd";
import { getCookie } from "../../../helper/cookie";
import logo from "../../../assets/logo-dark.svg";
import Loading from "../../../components/Loading/Loading";
import "./main.scss";

const { Header, Content } = Layout;

function Admin() {
    const navigate = useNavigate();
    const location = useLocation();

    const [state, setState] = useState({
        loading: true,
        adminToken: null
    });

    const themeConfig = {
        token: {
            colorPrimary: "#009DDC",
            borderRadius: 8,
            colorText: "#009DDC",
            fontSize: 16,
            
        },
    };
    useEffect(() => {
        const token = getCookie("adminToken");
        if (!token) {
            navigate("/admin/login");
        } else {
            setState({ loading: false, adminToken: token });
        }
    }, []);

    if (state.loading) {
        return (
            <Loading />
        );
    }

    // Danh sách menu
    const items = [
        { key: "/admin", label: "Quản lý bài hát" },
        { key: "/admin/topics", label: "Quản lý chủ đề" },
    ];

    return (
        <ConfigProvider theme={themeConfig}>
            <Layout>
                <Header>
                    <div className="header">
                        <div className="header__logo">
                            <img src={logo} alt="logo" />
                        </div>
                        <div className="header__menu">
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                selectedKeys={[location.pathname]} // 🚀 Đảm bảo menu item được selected đúng
                                items={items}
                                onClick={(e) => navigate(e.key)} // Điều hướng khi click menu
                            />
                        </div>
                        <div className="header__admin">
                            <Button type='primary'>
                                User
                            </Button>
                        </div>
                    </div>
                </Header>
                <Content>
                    <Outlet />
                </Content>
            </Layout>
        </ConfigProvider>

    );
}

export default Admin;
