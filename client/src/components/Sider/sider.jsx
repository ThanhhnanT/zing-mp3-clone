
import { Menu, Layout } from 'antd'
import { SlidersOutlined, StockOutlined, AppstoreAddOutlined } from '@ant-design/icons'
import PropTypes from "prop-types";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/authContext";

const LayoutSider = (props) => {
    const { authToken, setOpenLogin } = useAuth()
    const navigate = useNavigate()
    const { Sider } = Layout
    const collapsed = props.collapsed
    const location = useLocation()

    const keyPath = {
        '/library': "1",
        '/topic': "2",
        '/zing-chart': "3",
    }
    const {theme} = useAuth()

    const currentKey = keyPath[location.pathname] || ""
    const [selectedKey, setSelectedKey] = useState(currentKey)
    const handleSider = (key, path) => {
        if (authToken) {
            setSelectedKey(key)
            navigate(path)
        }
        else{
            setOpenLogin(true)
        }
    }
    useEffect(() => {
        setSelectedKey(keyPath[location.pathname] || "")
    }, [location.pathname])
    const sider = [
        {
            key: `1`,
            icon: <SlidersOutlined />,
            label: 'Thư viện',
            onClick: () => handleSider("1", "/library")
        },
        {
            key: `2`,
            icon: <AppstoreAddOutlined />,
            label: 'Khám phá',
            onClick: () => navigate('/topic')
        },
        {
            key: `3`,
            icon: <StockOutlined />,
            label: 'Zing chart',
            onClick: () => handleSider("3", '/zing-chart')
        },
    ]
    return (
        <>
            <Sider className="sider" trigger={null} collapsible collapsed={collapsed}>
                <Link to="/">
                    <div className="logo">
                        <img src={collapsed ? theme.icon : theme.avatar } alt='logo' />
                    </div>
                </Link>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={selectedKey}
                    items={sider}
                >
                </Menu>
            </Sider>
        </>
    )
}

LayoutSider.propTypes = {
    collapsed: PropTypes.bool.isRequired, // Bắt buộc phải có và là boolean
};

export default LayoutSider