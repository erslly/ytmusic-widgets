import { classicTheme } from '../themes/classic';
import { eliteTheme } from '../themes/elite';
import { glassTheme } from '../themes/glass';

export const renderSVG = (themeName: string, data: {
    track: string;
    artist: string;
    albumArt: string;
    status: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
}) => {
    switch (themeName?.toLowerCase()) {
        case 'elite':
            return eliteTheme(data);
        case 'glass':
            return glassTheme(data);
        case 'classic':
        default:
            return classicTheme(data);
    }
};
