import { createContext, useContext, useState, useEffect } from "react";
import { getCookie } from "../helper/cookie";
import { userInfor } from "../service/user";
import PropTypes from "prop-types";
import { getConfig } from "../service/admin/config"; // 🔥 Sửa lỗi dấu `,`

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [adminToken, setAdminToken] = useState(null);
    const [openLogin, setOpenLogin] = useState(false);
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState([]);

    useEffect(() => {
        setAuthToken(getCookie("authToken"));
        setAdminToken(getCookie("adminToken"));

        const fetchConfig = async () => {
            try {
                const res = await getConfig();
                setTheme(res.data.config);
            } catch (error) {
                console.error("Error fetching config:", error);
            }
        };
        fetchConfig();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            if (!authToken) return; 
            try {
                const res = await userInfor();
                setUser(res.data.data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };
        fetchUser();
    }, [authToken]);


    return (
        <AuthContext.Provider
            value={{ setAdminToken, authToken, setAuthToken, theme, openLogin, setOpenLogin, user, adminToken }}
        >
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
