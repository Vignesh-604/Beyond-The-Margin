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

export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };