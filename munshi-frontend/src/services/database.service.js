import axiosInstance from "../configs/axios.config";

async function saveUserData(data) {
    try {
        const response = await axiosInstance.post("/profile", data);
        return response.data.profile;
    } catch (error) {
        console.error('Error saving user:', error);
        return false;
    }
}


async function getUserData(userId) {
    try {
        const response = await axiosInstance.get("/profile");
        return response.data.profile;
    } catch (error) {
        console.error('Error retrieving user:', error);
        return false
    }
}


export async function fetchUserTransactions(userId) {
    try {
        const response = await axiosInstance.get("/transactions");
        return response.data.transactions;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return false;
    }
}

export const addTransaction = async (transactionData, userId) => {
    try {
        const response = await axiosInstance.post("/transactions", transactionData);
        return response.data.transaction;
    } catch (error) {
        console.error("Error adding transaction:", error);
        return false
    }
};

export const updateUserBalance = async (documentId, balance) => {
    try {
        const response = await axiosInstance.patch("/profile/balance", { balance });
        return response.data.profile;
    } catch (error) {
        console.error("Error updating balance:", error);
        return error
    }
};

export const addMessageToChatHistory = async (messageData, userId) => {
    try {
        const response = await axiosInstance.post("/chat-history", messageData);
        return response.data.message;
    } catch (error) {
        console.error("Error adding message to chatHistory:", error);
        return false;
    }
};

export const addStockInvestment = async (stockData, userId) => {
    try {
        const response = await axiosInstance.post("/stocks", stockData);
        return response.data.stock;
    } catch (error) {
        console.error("Error adding stock investment:", error);
        return false;
    }
};

export async function fetchUserInvestments(userId) {
    try {
        const response = await axiosInstance.get("/stocks");
        return response.data.stocks;
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return false;
    }
}



export { saveUserData, getUserData };