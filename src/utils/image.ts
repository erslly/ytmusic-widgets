import axios from 'axios';
import { CONFIG } from '../config';

export const getBase64Image = async (url: string): Promise<string> => {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 3000
        });
        const buffer = Buffer.from(response.data, 'binary');
        const contentType = response.headers['content-type'] as string;
        return `data:${contentType};base64,${buffer.toString('base64')}`;
    } catch (e) {
        return CONFIG.DEFAULT_ALBUM_ART;
    }
};