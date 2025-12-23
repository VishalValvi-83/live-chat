import AxiosInstance from './../AxiosInstance';

export const getChatsList = async () => {
    try {
        const response = await AxiosInstance.get("/chat/list")
        return response;
    } catch (error) {

    }
}

export const getChatConversion = async (chatId) => {
    try {
        const response = await AxiosInstance.get(`/chat/${chatId}`)
        console.log("conversion response: ", response)
        return response.data;
    } catch (error) {

    }
}

export const sendMessageAPI = async (data) => {
    try {
        const response = await AxiosInstance.post("/messages/send", data);
        return response.data;
    } catch (error) {
        console.error("Error sending message", error);
        return { success: false, error };
    }
}