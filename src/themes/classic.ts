const YTMusicLogo = (x: number, y: number) => `
<svg x="${x}" y="${y}" width="30" height="30" viewBox="0 0 176 176" xmlns="http://www.w3.org/2000/svg">
    <g>
        <circle fill="#FF0000" cx="88" cy="88" r="88"/>
        <path fill="#FFFFFF" d="M88,46c23.1,0,42,18.8,42,42s-18.8,42-42,42s-42-18.8-42-42S64.9,46,88,46 M88,42 c-25.4,0-46,20.6-46,46s20.6,46,46,46s46-20.6,46-46S113.4,42,88,42L88,42z"/>
        <polygon fill="#FFFFFF" points="72,111 111,87 72,65"/>
    </g>
</svg>`;

export const classicTheme = (data: {
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
    const progressBarWidth = 205 * (progress / 100);

    if (isOffline) {
        return `
    <svg width="520" height="180" xmlns="http://www.w3.org/2000/svg">
        <style>
            .message { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; font-size: 22px; font-weight: 500; fill: #fff; }
        </style>
        <rect x="10" y="10" width="500" height="160" rx="20" fill="#121212" stroke="#FF0000" stroke-width="4"/>
        ${YTMusicLogo(30, 30)}
        <text x="75" y="95" class="message">I'm currently offline</text>
    </svg>`;
    }

    return `
    <svg width="520" height="180" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <style>
            .song, .artist { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; }
            .song { font-size: 24px; font-weight: 600; fill: #fff; }
            .artist { font-size: 16px; fill: #D3D3D3; }
            .time { font-size: 12px; fill: #D3D3D3; }
        </style>
        <rect x="10" y="10" width="500" height="160" rx="20" fill="#121212" stroke="#FF0000" stroke-width="4"/>

        <defs>
            <clipPath id="rounded-image">
                <rect x="30" y="30" width="120" height="120" rx="10"/>
            </clipPath>
        </defs>

        <image x="30" y="30" width="120" height="120" xlink:href="${data.albumArt}" href="${data.albumArt}" clip-path="url(#rounded-image)"/>

        ${YTMusicLogo(460, 35)}

        <text x="170" y="60" class="song">${data.track.length > 20 ? data.track.slice(0, 18) + '...' : data.track}</text>
        <text x="170" y="85" class="artist">${data.artist}</text>

        <text x="170" y="135" class="time">${data.startTime || '0:00'}</text>
        <text x="480" y="135" class="time" text-anchor="end">${data.endTime || '0:00'}</text>

        <rect x="220" y="130" width="205" height="4" fill="#6a625e" rx="3"/>
        <rect x="220" y="130" width="${progressBarWidth}" height="4" fill="#fff" rx="3"/>
    </svg>`;
};
