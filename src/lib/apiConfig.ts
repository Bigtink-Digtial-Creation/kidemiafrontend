
import { ApiSDK } from "../sdk";

export const configureAPI = () => {
    // Set base URL
    ApiSDK.OpenAPI.BASE = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
    ApiSDK.OpenAPI.WITH_CREDENTIALS = true;
    ApiSDK.OpenAPI.CREDENTIALS = 'include';

    // Safe token handler - prevents "undefined" JSON error
    ApiSDK.OpenAPI.TOKEN = async () => {
        try {
            const token = localStorage.getItem('access_token'); // or 'token' - check your key

            // Handle invalid values
            if (!token || token === 'undefined' || token === 'null') {
                return undefined;
            }

            // If it's JSON, parse it
            if (token.startsWith('{') || token.startsWith('[')) {
                return JSON.parse(token);
            }

            // Return plain string token (most common for JWTs)
            return token;
        } catch (error) {
            console.error('Error getting token:', error);
            localStorage.removeItem('access_token'); // Clear bad token
            return undefined;
        }
    };

    // Debug logging (remove in production)
    console.log('API configured:', {
        BASE: ApiSDK.OpenAPI.BASE,
        WITH_CREDENTIALS: ApiSDK.OpenAPI.WITH_CREDENTIALS,
    });
};