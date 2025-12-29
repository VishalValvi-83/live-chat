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

export const getUserProfileAPI = async (userID) => {
    try {
        if (userID) {
            const payload = {
                id: userID
            }
            const response = await axiosInstance.post("/user/profile", payload);
            return response.data;
        }
        const response = await axiosInstance.get("/user/profile");
        return response.data;
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || "Failed to fetch profile" };
    }
};

export const updateUserProfileAPI = async (data) => {
    try {
        const response = await axiosInstance.patch("/user/profile", data);
        return response.data;
    } catch (error) {
        return { success: false, message: error?.response?.data?.message || "Update failed" };
    }
};

export const updateProfileImageAPI = async (data) => {
    try {
        const response = await axiosInstance.put("/user/profile-image", data);
        return response.data;
    } catch (error) {
        return { success: false, message: error.response?.data?.message || "Image update failed" };
    }
};