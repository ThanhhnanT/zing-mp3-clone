import { post, get } from "../../utils";

export const setConfig = async (data) => {
    return await post("admin/config/set", data)
}

export const getConfig = async () => {
    return await get("admin/config")
}