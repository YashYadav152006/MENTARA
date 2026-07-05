

// src/utils/api.js
const BASE_URL = "http://localhost:8000/api";

export const apiRequest = async (endpoint, method = "GET", data = null) => {
    try {
        const headers = {
            "Content-Type": "application/json",
        };

        const config = {
            method,
            headers,
        };

        if (data) {
            config.body = JSON.stringify(data);
        }

        const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
        const response = await fetch(`${BASE_URL}${cleanEndpoint}`, config);

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "API error");
        }

        return result;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
};