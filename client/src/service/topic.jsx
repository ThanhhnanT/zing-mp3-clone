import { get } from "../utils";

export const getTopic = async () => {
    const result = await get("topics");
    return result
}


export const getSongTopic = async (slug) => {
    const result = await get(`topics/${slug}`);
    return result
}