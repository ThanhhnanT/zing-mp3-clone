import { createContext, useContext, useState, useEffect } from "react";
import { getCookie } from "../helper/cookie";
import { userInfor } from "../service/user";
import PropTypes from "prop-types";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [adminToken, setAdminToken] = useState(null);
    const [openLogin, setOpenLogin] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        setAuthToken(getCookie("authToken"));
        setAdminToken(getCookie("adminToken"))
        console.log("adminToken từ cookie:", getCookie("adminToken"));
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await userInfor();
            setUser(res.data.data)
        }
        fetchUser()
    }, [authToken])

    return (
        <AuthContext.Provider value={{ setAdminToken,authToken, setAuthToken, openLogin, setOpenLogin, user, adminToken }}>
            {children}
        </AuthContext.Provider>
    );
};
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
