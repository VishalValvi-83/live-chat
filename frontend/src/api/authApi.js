import api from "./AxiosInstance";

export const registerUser = async (payload) => {
    try {
        const response = await api.post('/auth/register', payload)
        // console.log("register response: ", response)
        return response;
    } catch (error) {
        if (error.response.data) {
            console.error("register error:", error.response.data.message)
            return error.response
        }
        console.error("something went wrong", error)
    }
}

export const loginUser = async (payload) => {
    try {
        const response = await api.post("/auth/login", payload)
        // console.log("login response : ", response)
        if (response && response.status === 200) {
            sessionStorage.setItem("authToken", response.data.token)
        }
        return response;
    } catch (error) {
        if (error.response.data) {
            console.error("login error:", error.response.data.message)
            return error.response
        }
        console.error("something went wrong", error.message || error.erro || error)
    }
}