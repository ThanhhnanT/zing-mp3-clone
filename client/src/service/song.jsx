import { get } from "../utils";

export const getSong = async(slug) => {
    const result = await get(`songs/${slug}`)
    return result
}