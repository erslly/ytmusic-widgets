const YTMusicLogo = (x: number, y: number) => `
<svg x="${x}" y="${y}" width="30" height="30" viewBox="0 0 176 176" xmlns="http://www.w3.org/2000/svg">
    <g>
        <circle fill="#FF0000" cx="88" cy="88" r="88"/>
        <path fill="#FFFFFF" d="M88,46c23.1,0,42,18.8,42,42s-18.8,42-42,42s-42-18.8-42-42S64.9,46,88,46 M88,42 c-25.4,0-46,20.6-46,46s20.6,46,46,46s46-20.6,46-46S113.4,42,88,42L88,42z"/>
        <polygon fill="#FFFFFF" points="72,111 111,87 72,65"/>
    </g>
</svg>`;

import { SVGData } from '../types';

export const classicTheme = (data: SVGData) => {
    const isOffline = data.status === 'OFFLINE';
    const progress = data.progress || 0;
    const progressBarWidth = 205 * (progress / 100);
    const vibrant = data.palette?.vibrant || '#FF0000';
    const darkVibrant = data.palette?.darkVibrant || '#8B0000';
    const muted = data.palette?.muted || '#121212';

    if (isOffline) {
        return `
    <svg width="520" height="180" xmlns="http://www.w3.org/2000/svg">
        <style>
            .message { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; font-size: 22px; font-weight: 500; fill: #fff; }
        </style>
        <rect x="10" y="10" width="500" height="160" rx="20" fill="#121212" stroke="${vibrant}" stroke-width="4"/>
        ${YTMusicLogo(30, 30)}
        <text x="75" y="95" class="message">I'm currently offline</text>
    </svg>`;
    }

    return `
    <svg width="520" height="180" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
            <linearGradient id="border-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${vibrant};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${darkVibrant};stop-opacity:1" />
            </linearGradient>
            <filter id="inner-shadow">
                <feOffset dx="0" dy="2"/>
                <feGaussianBlur stdDeviation="3" result="offset-blur"/>
                <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
                <feFlood flood-color="black" flood-opacity="0.5" result="color"/>
                <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
                <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
            </filter>
            <clipPath id="rounded-image">
                <rect x="30" y="30" width="120" height="120" rx="15"/>
            </clipPath>
            <linearGradient id="classic-progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:${vibrant};stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:${vibrant};stop-opacity:1" />
            </linearGradient>
        </defs> 
        <style>
            .song, .artist { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"; }
            .song { font-size: 24px; font-weight: 800; fill: #fff; letter-spacing: -0.5px; }
            .artist { font-size: 18px; fill: #b3b3b3; font-weight: 500; }
            .time { font-size: 13px; fill: #a0a0a0; font-weight: 500; }
            .card-bg { fill: #0f0f0f; stroke: url(#border-gradient); stroke-width: 3; }
            .progress-bg { fill: rgba(255, 255, 255, 0.1); }
            .progress-fg { fill: url(#classic-progress-gradient); }
            .progress-knob { fill: ${vibrant}; filter: drop-shadow(0 0 5px ${vibrant}); }
        </style>

        <rect x="10" y="10" width="500" height="160" rx="25" class="card-bg" filter="url(#inner-shadow)"/>
        <g>
            <image x="30" y="30" width="120" height="120" xlink:href="${data.albumArt}" href="${data.albumArt}" clip-path="url(#rounded-image)"/>
            <rect x="115" y="115" width="35" height="35" rx="17.5" fill="#0f0f0f"/>
            ${YTMusicLogo(117.5, 117.5)}
        </g>

        <text x="170" y="65" class="song">${data.track.length > 25 ? data.track.slice(0, 23) + '...' : data.track}</text>
        <text x="170" y="95" class="artist">${data.artist}</text>

        <text x="170" y="145" class="time">${data.startTime || '0:00'}</text>
        <text x="480" y="145" class="time" text-anchor="end">${data.endTime || '0:00'}</text>

        <rect x="220" y="140" width="205" height="4" class="progress-bg" rx="2"/>
        <rect x="220" y="140" width="${progressBarWidth}" height="4" class="progress-fg" rx="2"/>
        <circle cx="${220 + progressBarWidth}" cy="142" r="4.5" class="progress-knob"/>
    </svg>`;
};
