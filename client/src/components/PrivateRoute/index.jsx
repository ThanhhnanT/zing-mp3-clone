import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/authContext";
import { getCookie } from "../../helper/cookie";

function PrivateRouter() {
    const navigate = useNavigate();
    const [login, setLogin] = useState(false); 
    const { setOpenLogin } = useAuth();

    useEffect(() => {
        const authToken = getCookie("authToken");
        if (authToken) {
            setLogin(true);
        } else {
            setOpenLogin(true);  
            navigate(-1);        
        }
    }, [navigate, setOpenLogin]); 

    return login ? <Outlet /> : null; 
}

export default PrivateRouter;
