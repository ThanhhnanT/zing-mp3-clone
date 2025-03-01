import {  post } from "../../utils";

export const adminLogin =async (data) => {
    return await post("admin/setLogin", data)
} 