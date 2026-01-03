import AxiosInstance from './../AxiosInstance';

export const getChatsList = async () => {
    try {
        const response = await AxiosInstance.get("/chat/list")
        return response;
    } catch (error) {

    }
}

export const getChatConversion = async (chatId, page = 1) => {
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

export const createGroupAPI = async (data) => {
    try {
        const response = await AxiosInstance.post("/chat/group/create", data);
        return response.data;
    } catch (error) {
        console.error("Error creating group", error);
        return { success: false, message: error.response?.data?.message || "Failed to create group" };
    }
}

export const getGroupDetailsAPI = async (groupId) => {
    try {
        const response = await AxiosInstance.get(`/chat/group/${groupId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching group details", error);
        return { success: false, message: "Failed to fetch details" };
    }
}

export const addGroupMemberAPI = async (data) => {
    try {
        const response = await AxiosInstance.post("/chat/group/add-member", data);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to add member" };
    }
}

export const removeGroupMemberAPI = async (data) => {
    try {
        const response = await AxiosInstance.post("/chat/group/remove-member", data);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Failed to remove member" };
    }
}