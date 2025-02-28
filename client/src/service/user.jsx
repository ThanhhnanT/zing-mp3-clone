import { post, patch, get, upImage } from "../utils";

export const checkLogin = async(data) => {
    const result = await post("users/login", data)
    return result
}

export const checkRegister = async(data) => {
    const result = await post("users/register", data)
    return result
}


export const checkEmailReset = async (data) => {
    return await post("users/createOTP", data)
}

export const checkOTP = async (data) => {
    return await post("users/receiveOTP", data)
}

export const resetPass = async (data) => {
    return await patch("users/resetPass", data)
}

export const userInfor = async () => {
    return await get("users/infor")
} 

export const upAvatar = async (data) => {
    return await upImage("users/upload-avatar", data)
}

export const updateInfor = async (data) => {
    return await patch("users/infor", data)
}

