const YTMusicLogo = (x: number, y: number) => `
<svg x="${x}" y="${y}" width="24" height="24" viewBox="0 0 176 176" xmlns="http://www.w3.org/2000/svg">
    <g>
        <circle fill="#FFFFFF" fill-opacity="0.8" cx="88" cy="88" r="88"/>
        <path fill="#FF0000" d="M88,46c23.1,0,42,18.8,42,42s-18.8,42-42,42s-42-18.8-42-42S64.9,46,88,46 M88,42 c-25.4,0-46,20.6-46,46s20.6,46,46,46s46-20.6,46-46S113.4,42,88,42L88,42z"/>
        <polygon fill="#FF0000" points="72,111 111,87 72,65"/>
    </g>
</svg>`;

export const glassTheme = (data: {
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
    const progressBarWidth = 295 * (progress / 100);

    if (isOffline) {
        return `
    <svg width="600" height="160" xmlns="http://www.w3.org/2000/svg">
        <style>
            .msg { font-family: 'Segoe UI', system-ui, sans-serif; font-size: 20px; fill: #fff; font-weight: 500; }
        </style>
        <rect width="600" height="160" rx="20" fill="#1a1a1a"/>
        <text x="50%" y="85" text-anchor="middle" class="msg">I'm currently offline</text>
    </svg>`;
    }

    return `
    <svg width="600" height="160" viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
            <clipPath id="rect-clip">
                <rect width="600" height="160" rx="30"/>
            </clipPath>
            <filter id="glass-blur" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
            </filter>
            <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:white;stop-opacity:0.2" />
                <stop offset="100%" style="stop-color:white;stop-opacity:0.05" />
            </linearGradient>
        </defs>

        <style>
            .content { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
            .track { font-size: 24px; font-weight: 700; fill: #fff; }
            .artist { font-size: 16px; fill: rgba(255,255,255,0.7); font-weight: 500; }
            .time { font-size: 12px; fill: rgba(255,255,255,0.5); font-weight: 500; }
            .glass-panel { fill: url(#glass-grad); stroke: rgba(255,255,255,0.2); stroke-width: 1; }
            .progress-bg { fill: rgba(255, 255, 255, 0.1); }
            .progress-fg { fill: #fff; filter: drop-shadow(0 0 3px rgba(255,255,255,0.5)); }
        </style>

        <g clip-path="url(#rect-clip)">
            <image href="${data.albumArt}" x="-50" y="-50" width="700" height="260" preserveAspectRatio="xMidYMid slice" filter="url(#glass-blur)" opacity="0.6"/>
            <rect width="600" height="160" fill="rgba(0,0,0,0.4)"/>
            <rect x="15" y="15" width="570" height="130" rx="25" class="glass-panel"/>

            <g class="content">
                <g>
                    <image href="${data.albumArt}" x="40" y="35" width="90" height="90" rx="20" clip-path="inset(0% round 20px)"/>
                        <rect x="105" y="100" width="30" height="30" rx="15" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
                    ${YTMusicLogo(108, 103)}
                </g>

                <text x="150" y="65" class="track">${data.track.length > 30 ? data.track.slice(0, 28) + '...' : data.track}</text>
                <text x="150" y="92" class="artist">${data.artist}</text>

                <text x="145" y="125" class="time">${data.startTime || '0:00'}</text>
                <text x="555" y="125" class="time" text-anchor="end">${data.endTime || '0:00'}</text>

                <rect x="200" y="121" width="295" height="2.5" class="progress-bg" rx="1.25"/>
                <rect x="200" y="121" width="${progressBarWidth}" height="2.5" class="progress-fg" rx="1.25"/>
                <circle cx="${200 + progressBarWidth}" cy="122.25" r="3.5" fill="#fff"/>
            </g>
        </g>
    </svg>`;
};
