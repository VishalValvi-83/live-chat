import axiosInstance from "./AxiosInstance";

export const searchUsersAPI = async (query) => {
    try {
        const response = await axiosInstance.get(`/user/search?query=${query}`);
        return response.data;
    } catch (error) {
        console.error("Error searching users:", error);
        return { success: false, message: error.response?.data?.message || "Search failed" };
    }
};