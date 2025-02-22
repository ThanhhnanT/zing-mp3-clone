import logo from "../../assets/logo-dark.svg"
import iconLogo from "../../assets/icon_zing_mp3_60.f6b51045.svg"
import { Menu, Layout } from 'antd'
import { SlidersOutlined, StockOutlined, AppstoreAddOutlined } from '@ant-design/icons'
import PropTypes from "prop-types"; 
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const LayoutSider = (props) => {
    const navigate = useNavigate()
    const {Sider} = Layout 
    const collapsed = props.collapsed
    const location = useLocation()

    const keyPath = {
        '/libary': "1",
        '/topic': "2",
        '/zing-chart': "3",
    }
    
    const currentKey = keyPath[location.pathname] || ""
    const [selectedKey, setSelectedKey] = useState(currentKey) 
    const handleSider = (key, path) => {
        setSelectedKey(key)
        navigate(path)
    }
    useEffect(() => {
       setSelectedKey(keyPath[location.pathname] || "")
    },[location.pathname])
    const sider = [
        {
            key: `1`,
            icon: <SlidersOutlined />,
            label: 'Thư viện',
            onClick: () => handleSider("1", "/libary")
        },
        {
            key: `2`,
            icon: <AppstoreAddOutlined />,
            label: 'Khám phá',
            onClick: () => handleSider("2", '/topic')
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
                        <img src={collapsed ? iconLogo : logo} alt='logo' />
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