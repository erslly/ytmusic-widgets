import axios from 'axios';
import { PresenceResponse } from '../types';

export const getPresenceStatus = async (userId: string): Promise<PresenceResponse> => {
    const { data } = await axios.get(`https://api.erslly.dev/api/presence/${userId}`);
    return data;
};

export const getYTMusicActivity = (response: PresenceResponse) => {
    const activities = response.data.presence.activities;
    return activities.find(
        (a) => a.name === 'YouTube Music' || a.application_id === '1452296227810054305' || a.application_id === '463151177836658699'
    );
};