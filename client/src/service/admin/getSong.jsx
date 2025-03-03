import { get, patch, upImage, post } from "../../utils";

export const getSongAdmin = async () => {
    return await get("admin/song")
}

export const changeStatus =async (data) => {
    return await patch("admin/song/change-status", data)
} 

export const createSong = async (data) => {
    return await upImage("admin/song/create-song", data)
}

export const allSinger = async() => {
    return await get("admin/song/singer")
}
export const allTopic = async() => {
    return await get("admin/song/topic")
}

export const createSong2 = async (data) => {
    return await post("admin/song/create-song-2", data)
}

