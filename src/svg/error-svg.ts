import { ErrorType, ErrorSVGData } from '../types';

const getErrorMessage = (type: ErrorType): { title: string; subtitle: string } => {
    switch (type) {
        case ErrorType.INVALID_USER_ID:
            return {
                title: 'Invalid User ID',
                subtitle: 'Please provide a valid Discord User ID'
            };
        case ErrorType.USER_NOT_FOUND:
            return {
                title: 'User Not Found',
                subtitle: 'Make sure you\'re in the Discord server'
            };
        case ErrorType.API_ERROR:
            return {
                title: 'API Error',
                subtitle: 'Unable to fetch presence data'
            };
        case ErrorType.TIMEOUT:
            return {
                title: 'Request Timeout',
                subtitle: 'The request took too long to complete'
            };
        case ErrorType.RATE_LIMIT:
            return {
                title: 'Rate Limited',
                subtitle: 'Too many requests, please try again later'
            };
        case ErrorType.NETWORK_ERROR:
            return {
                title: 'Network Error',
                subtitle: 'Unable to connect to the API'
            };
        case ErrorType.GENERIC_ERROR:
        default:
            return {
                title: 'Something Went Wrong',
                subtitle: 'Please try again later'
            };
    }
};

export const renderErrorSVG = (theme: string, errorData: ErrorSVGData): string => {
    const { title, subtitle } = getErrorMessage(errorData.type);
    if (theme === 'classic') {
        return `
    <svg width="520" height="180" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="error-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#FF4444;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#CC0000;stop-opacity:1" />
            </linearGradient>
        </defs>
        <style>
            .error-title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 24px; font-weight: 700; fill: #fff; }
            .error-subtitle { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 16px; fill: #ffcccc; font-weight: 400; }
            .error-icon { fill: #ff6666; }
        </style>
        <rect x="10" y="10" width="500" height="160" rx="20" fill="#1a0000" stroke="url(#error-gradient)" stroke-width="3"/>
        <circle cx="70" cy="90" r="30" class="error-icon"/>
        <text x="70" y="105" text-anchor="middle" style="font-size: 48px; font-weight: 900; fill: #1a0000;">!</text>
        
        <text x="120" y="80" class="error-title">${title}</text>
        <text x="120" y="110" class="error-subtitle">${subtitle}</text>
    </svg>`;
    }

    if (theme === 'elite') {
        return `
    <svg width="720" height="180" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="elite-error-bg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:rgba(40,0,0,0.9);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgba(20,0,0,1);stop-opacity:1" />
            </linearGradient>
            <clipPath id="elite-error-clip">
                <rect width="720" height="180" rx="20"/>
            </clipPath>
        </defs>
        <style>
            .elite-error-title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 30px; font-weight: 800; fill: #ff6666; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
            .elite-error-subtitle { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 18px; fill: #ffaaaa; font-weight: 500; }
        </style>
        <g clip-path="url(#elite-error-clip)">
            <rect width="720" height="180" fill="url(#elite-error-bg)"/>

            <circle cx="360" cy="60" r="25" fill="#ff4444" opacity="0.3"/>
            <text x="360" y="75" text-anchor="middle" style="font-size: 40px; font-weight: 900; fill: #ff6666;">⚠</text>
            
            <text x="50%" y="120" text-anchor="middle" class="elite-error-title">${title}</text>
            <text x="50%" y="150" text-anchor="middle" class="elite-error-subtitle">${subtitle}</text>
        </g>
    </svg>`;
    }

    return `
    <svg width="600" height="160" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="glass-error-clip">
                <rect width="600" height="160" rx="30"/>
            </clipPath>
            <linearGradient id="glass-error-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#ff4444;stop-opacity:0.2" />
                <stop offset="100%" style="stop-color:#cc0000;stop-opacity:0.1" />
            </linearGradient>
        </defs>
        <style>
            .glass-error-title { font-family: 'Segoe UI', Roboto, sans-serif; font-size: 24px; font-weight: 700; fill: #fff; }
            .glass-error-subtitle { font-family: 'Segoe UI', Roboto, sans-serif; font-size: 16px; fill: rgba(255,255,255,0.7); font-weight: 500; }
        </style>
        <g clip-path="url(#glass-error-clip)">
            <rect width="600" height="160" fill="#2a0000"/>
            <rect x="15" y="15" width="570" height="130" rx="25" fill="url(#glass-error-grad)" stroke="rgba(255,100,100,0.3)" stroke-width="1"/>
            
            <circle cx="80" cy="80" r="28" fill="rgba(255,68,68,0.2)" stroke="#ff4444" stroke-width="2"/>
            <text x="80" y="95" text-anchor="middle" style="font-size: 42px; font-weight: 900; fill: #ff6666;">!</text>
            
            <text x="130" y="70" class="glass-error-title">${title}</text>
            <text x="130" y="95" class="glass-error-subtitle">${subtitle}</text>
        </g>
    </svg>`;
};
