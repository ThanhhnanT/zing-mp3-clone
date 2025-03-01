import { get, patch } from "../../utils";

export const getSongAdmin = async () => {
    return await get("admin/song")
}

export const changeStatus =async (data) => {
    return await patch("admin/song/change-status", data)
} 