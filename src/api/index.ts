import axios from 'axios';
import { LanyardResponse } from '../types';

export const getLanyardStatus = async (userId: string): Promise<LanyardResponse> => {
    const { data } = await axios.get(`https://api.lanyard.rest/v1/users/${userId}`);
    return data;
};

export const getYTMusicActivity = (response: LanyardResponse) => {
    const activities = response.data.activities;
    return activities.find(
        (a) => a.name === 'YouTube Music' || a.application_id === '1231711920231546962'
    );
};