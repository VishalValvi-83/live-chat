import AxiosInstance from './../AxiosInstance';

export const getChatsList = async () => {
    try {
        const response = await AxiosInstance.get("/chat/list")
        return response;
    } catch (error) {

    }
}

export const getChatConversion = async(chatId, page = 1) => {
    try {
        const response = await AxiosInstance.get(`/chat/${chatId}?page=${page}&limit=20`)
        return response.data;
    } catch (error) {
        console.error("Error fetching conversion", error);
        return { success: false, data: [] };
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