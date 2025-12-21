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
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
            </filter>
            <linearGradient id="overlay-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style="stop-color:rgba(0,0,0,0.4);stop-opacity:1" />
                <stop offset="100%" style="stop-color:rgba(0,0,0,0.85);stop-opacity:1" />
            </linearGradient>
            <clipPath id="rounded-card">
                <rect width="720" height="180" rx="20"/>
            </clipPath>
        </defs>
        <style>
            @keyframes pan-bg {
                0% { transform: scale(1.1) translate(0, 0); }
                50% { transform: scale(1.2) translate(-10px, -5px); }
                100% { transform: scale(1.1) translate(0, 0); }
            }
            .main { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; }
            .bg-image { animation: pan-bg 20s infinite ease-in-out; }
            .song { font-size: 30px; font-weight: 800; fill: #fff; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); letter-spacing: -0.5px; }
            .artist { font-size: 18px; fill: #e0e0e0; font-weight: 500; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5)); }
            .time { font-size: 14px; fill: #d1d1d1; font-weight: 500; }
            .progress-bg { fill: rgba(255, 255, 255, 0.15); }
            .progress-fg { fill: url(#progress-gradient); filter: drop-shadow(0 0 8px rgba(255,255,255,0.4)); }
            .progress-knob { fill: #fff; filter: drop-shadow(0 0 10px rgba(255,255,255,0.8)); }
        </style>

        <g clip-path="url(#rounded-card)">
            <g class="bg-image">
                <image xlink:href="${data.albumArt}" href="${data.albumArt}" width="720" height="180" preserveAspectRatio="xMidYMid slice" filter="url(#blur-effect)" />
            </g>
            <rect width="720" height="180" fill="url(#overlay-gradient)" />

            <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.8" />
                    <stop offset="100%" style="stop-color:#ffffff;stop-opacity:1" />
                </linearGradient>
            </defs>

            ${YTMusicLogo(345, 15)}

            <text x="50%" y="85" text-anchor="middle" class="main song">${data.track}</text>
            <text x="50%" y="115" text-anchor="middle" class="main artist">${data.artist}</text>

            <text x="55" y="145" class="main time">${data.startTime || '0:00'}</text>
            <text x="665" y="145" text-anchor="end" class="main time">${data.endTime || '0:00'}</text>

            <rect x="115" y="140" width="485" height="3" class="progress-bg" rx="1.5"/>
            <rect x="115" y="140" width="${progressBarWidth}" height="3" class="progress-fg" rx="1.5"/>
            <circle cx="${115 + progressBarWidth}" cy="141.5" r="5" class="progress-knob"/>
        </g>
    </svg>`;
};