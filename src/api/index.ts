import axios, { AxiosError } from 'axios';
import { PresenceResponse, APIError, ErrorType } from '../types';

const API_TIMEOUT = 5000;
const MAX_RETRIES = 1;
const RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getPresenceStatus = async (userId: string, retryCount = 0): Promise<PresenceResponse> => {
    try {
        const { data } = await axios.get<PresenceResponse>(
            `https://api.erslly.dev/api/presence/${userId}`,
            {
                timeout: API_TIMEOUT,
                headers: {
                    'User-Agent': 'ytmusic-widgets/1.0'
                }
            }
        );
        if (!data || !data.data || !data.data.presence) {
            throw new APIError(
                'Invalid response from API',
                ErrorType.API_ERROR,
                200,
                'Response missing required fields'
            );
        }

        return data;
    } catch (error) {
        const axiosError = error as AxiosError;

        if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
            if (retryCount < MAX_RETRIES) {
                await sleep(RETRY_DELAY * (retryCount + 1));
                return getPresenceStatus(userId, retryCount + 1);
            }

            throw new APIError(
                'Request timeout',
                ErrorType.TIMEOUT,
                undefined,
                'API request took too long'
            );
        }

        if (axiosError.response?.status === 404) {
            throw new APIError(
                'User not found',
                ErrorType.USER_NOT_FOUND,
                404,
                'User does not exist or is not in the Discord server'
            );
        }

        if (axiosError.response?.status === 429) {
            throw new APIError(
                'Rate limited',
                ErrorType.RATE_LIMIT,
                429,
                'Too many requests to the API'
            );
        }

        if (axiosError.code === 'ENOTFOUND' || axiosError.code === 'ECONNREFUSED') {
            throw new APIError(
                'Network error',
                ErrorType.NETWORK_ERROR,
                undefined,
                'Unable to connect to the API'
            );
        }
        if (axiosError.response) {
            throw new APIError(
                'API error',
                ErrorType.API_ERROR,
                axiosError.response.status,
                axiosError.response.statusText
            );
        }

        throw new APIError(
            'Unknown error occurred',
            ErrorType.GENERIC_ERROR,
            undefined,
            (error as Error).message
        );
    }
};

export const getYTMusicActivity = (response: PresenceResponse) => {
    const activities = response.data.presence.activities;
    return activities.find(
        (a) => a.name === 'YouTube Music' || a.application_id === '1452296227810054305' || a.application_id === '463151177836658699'
    );
};