import { get, patch } from "../utils";

export const getSong = async(slug) => {
    const result = await get(`songs/get/${slug}`)
    return result
}

export const getTop = async() => {
    const result = await get(`songs/find-top`)
    return result
}

export const addListen = async (id) => {
    const result = await patch(`songs/add-listen`, id)
    return result
}