import axios from "axios"

export const category = async () => {
    const res = await axios.get("/api/category")
    const data = res.data.data
    return data
}
  