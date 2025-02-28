import { post } from "../utils"

export const search =async (data) => {
    const result = await post("search/song", data);
    return result
}