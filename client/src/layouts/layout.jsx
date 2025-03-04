import { Outlet } from "react-router-dom";
import { Layout } from 'antd'

import { useState } from 'react'
import { ConfigProvider } from 'antd'
import './layout.scss'
import LayoutSider from "../components/Sider/sider";
import LayoutHeader from "../components/Header/header";
import { useAuth } from "../auth/authContext";

const { Content } = Layout;
const LayoutDefault = () => {
    const {theme} = useAuth()
    const themeConfig = {
        token: {
            colorPrimary: `${theme.colorTheme}`,
            borderRadius: 8,
            colorText: `${theme.colorTheme}`, 
            fontSize: 16, 
        },
    };
    const [collapsed, setCollapsed] = useState(false)

    
    return (
        <>
            <ConfigProvider theme={themeConfig}>
                <Layout>
                    <LayoutSider collapsed ={collapsed}/>
                    <Layout>
                        <LayoutHeader collapsed={collapsed} setCollapsed={setCollapsed} />
                        <Content className="layout__content">
                            <Outlet />
                        </Content>
                    </Layout>
                </Layout>
            </ConfigProvider>
        </>
    );
};

export default LayoutDefault;