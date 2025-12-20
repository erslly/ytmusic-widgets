import { classicTheme } from '../themes/classic';
import { eliteTheme } from '../themes/elite';

export const renderSVG = (themeName: string, data: {
    track: string;
    artist: string;
    albumArt: string;
    status: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
}) => {
    switch (themeName) {
        case 'elite':
            return eliteTheme(data);
        case 'classic':
        default:
            return classicTheme(data);
    }
};
