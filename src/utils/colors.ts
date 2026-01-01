import Vibrant from 'node-vibrant';
import { ColorPalette } from '../types';

export const getDominantColors = async (imageUrl: string): Promise<ColorPalette> => {
    try {
        const palette = await Vibrant.from(imageUrl).getPalette();

        return {
            vibrant: palette.Vibrant?.getHex(),
            muted: palette.Muted?.getHex(),
            darkVibrant: palette.DarkVibrant?.getHex(),
            darkMuted: palette.DarkMuted?.getHex(),
            lightVibrant: palette.LightVibrant?.getHex(),
            lightMuted: palette.LightMuted?.getHex(),
        };
    } catch (error) {
        console.error('Error extracting colors:', error);
        return {};
    }
};