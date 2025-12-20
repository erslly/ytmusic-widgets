const YTMusicLogo = (x: number, y: number) => `
<svg x="${x}" y="${y}" width="30" height="30" viewBox="0 0 176 176" xmlns="http://www.w3.org/2000/svg">
    <g>
        <circle fill="#FF0000" cx="88" cy="88" r="88"/>
        <path fill="#FFFFFF" d="M88,46c23.1,0,42,18.8,42,42s-18.8,42-42,42s-42-18.8-42-42S64.9,46,88,46 M88,42 c-25.4,0-46,20.6-46,46s20.6,46,46,46s46-20.6,46-46S113.4,42,88,42L88,42z"/>
        <polygon fill="#FFFFFF" points="72,111 111,87 72,65"/>
    </g>
</svg>`;

export const eliteTheme = (data: {
    track: string;
    artist: string;
    albumArt: string;
    status: string;
    progress?: number;
    startTime?: string;
    endTime?: string;
}) => {
    const isOffline = data.status === 'OFFLINE';
    const progress = data.progress || 0;
    const progressBarWidth = 485 * (progress / 100);

    if (isOffline) {
        return `
    <svg width="720" height="180" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <clipPath id="rounded-card">
                <rect width="720" height="180" rx="15"/>
            </clipPath>
        </defs>
        <style>
            .message {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
                font-size: 26px;
                font-weight: 600;
                fill: #fff;
            }
        </style>
        <g clip-path="url(#rounded-card)">
            <rect width="720" height="180" fill="#121212"/>
            ${YTMusicLogo(345, 30)}
            <text x="50%" y="105" text-anchor="middle" class="message">I'm currently offline</text>
        </g>
    </svg>`;
    }

    return `
    <svg width="720" height="180" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
            <filter id="blur-effect">
                <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <clipPath id="rounded-card">
                <rect width="720" height="180" rx="15"/>
            </clipPath>
        </defs>
        <style>
            .main { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; }
            .song { font-size: 28px; font-weight: 700; fill: #fff; }
            .artist { font-size: 16px; fill: #D3D3D3; }
            .time { font-size: 14px; fill: #D3D3D3; }
        </style>

        <g clip-path="url(#rounded-card)">
            <image xlink:href="${data.albumArt}" href="${data.albumArt}" width="720" height="180" preserveAspectRatio="xMidYMid slice" filter="url(#blur-effect)" />
            <rect width="720" height="180" fill="rgba(0, 0, 0, 0.6)" />

            ${YTMusicLogo(345, 20)}

            <text x="50%" y="80" text-anchor="middle" class="main song">${data.track}</text>
            <text x="50%" y="110" text-anchor="middle" class="main artist">${data.artist}</text>

            <text x="55" y="135" class="main time">${data.startTime || '0:00'}</text>
            <text x="665" y="135" text-anchor="end" class="main time">${data.endTime || '0:00'}</text>

            <rect x="115" y="130" width="485" height="4" fill="#6a625e" rx="3"/>
            <rect x="115" y="130" width="${progressBarWidth}" height="4" fill="#fff" rx="3"/>
        </g>
    </svg>`;
};