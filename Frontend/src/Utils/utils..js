import CryptoJS from "crypto-js";
import Cookies from "js-cookie"

export function decrypt() {
    const userCrypt = Cookies.get('user')

    if (userCrypt) {
        const bytes = CryptoJS.AES.decrypt(userCrypt, import.meta.env.VITE_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return decryptedData
    } else {
        return null
    }
}

export function dateFormat(date) {
    const dateObj = new Date(date)

    const formattedDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    })

    return formattedDate
}