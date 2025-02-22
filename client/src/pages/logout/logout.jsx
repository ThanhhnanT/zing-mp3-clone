import { useNavigate } from "react-router-dom";
import { deleteAllcookies } from "../../helper/cookie";
import { useEffect } from "react";

function Logout() {
    const navigate = useNavigate();
    
    useEffect(() => {
        deleteAllcookies();  
        navigate("/"); 
    }, [navigate]);

    return null;
}

export default Logout;
