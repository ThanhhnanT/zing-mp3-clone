import { useAuth } from "../../../auth/authContext";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Admin() {
    const navigate = useNavigate();
    const { adminToken } = useAuth();

    useEffect(() => {
        if (!adminToken) {
            navigate("/admin/login");
        }
    }, [adminToken, navigate]);

    return adminToken ? <Outlet /> : null;
}

export default Admin;
