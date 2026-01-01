import { classicTheme } from '../themes/classic';
import { eliteTheme } from '../themes/elite';
import { glassTheme } from '../themes/glass';
import { SVGData } from '../types';

export const renderSVG = (themeName: string, data: SVGData) => {
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