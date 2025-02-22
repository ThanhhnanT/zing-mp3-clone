export const getCookie = (key) => {
    const arrCookie = document.cookie.split(";")
    for (const item of arrCookie){
        const [keys, value] = item.trim().split("=")
        if (key === keys.trim()){
            return value
        }
    }
    return null
}

// Hàm xóa hết Cookies
export function deleteAllcookies(){
    const cookies = document.cookie.split(";");
    for (let i =0; i<cookies.length; i++){
        const cookie = cookies[i]
        const eqPos = cookies.indexOf("=")
        const name = eqPos > -1 ? cookie.substr(0,eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}