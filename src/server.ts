import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import axios from 'axios';
import { getPresenceStatus, getYTMusicActivity } from './api';
import { renderSVG } from './svg/renderer';
import { renderErrorSVG } from './svg/error-svg';
import { validateUserId, validateTheme, sanitizeInput } from './utils/validation';
import { APIError, ErrorType } from './types';

const app = express();
app.use(cors({ origin: '*' }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.disable('x-powered-by');
app.set('etag', false);
const PORT = process.env.PORT || 3000;

const REQUEST_TIMEOUT = 10000;

const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
};

const getBase64Image = async (url: string): Promise<string> => {
    try {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            timeout: 3000
        });
        const buffer = Buffer.from(response.data, 'binary');
        const contentType = response.headers['content-type'] as string;
        return `data:${contentType};base64,${buffer.toString('base64')}`;
    } catch (e) {
        return 'https://cdn.discordapp.com/emojis/847043868216524811.png';
    }
};

app.get('/widgets/:id?', async (req, res) => {
    const startTime = Date.now();

    const timeoutId = setTimeout(() => {
        if (!res.headersSent) {
            res.setHeader('Content-Type', 'image/svg+xml');
            res.status(504).send(renderErrorSVG('classic', {
                type: ErrorType.TIMEOUT,
                message: 'Request timeout'
            }));
        }
    }, REQUEST_TIMEOUT);

    try {
        let { id } = req.params;
        let theme = (req.query.theme as string) || 'classic';
        const clientIp = req.ip || req.socket.remoteAddress;
        if (!id && req.query.id) {
            id = req.query.id as string;
        }
        if (id && id.includes('&theme=')) {
            const parts = id.split('&theme=');
            id = parts[0];
            theme = parts[1];
        }
        id = sanitizeInput(id || '');
        theme = sanitizeInput(theme);
        if (!id) {
            clearTimeout(timeoutId);
            res.setHeader('Content-Type', 'image/svg+xml');
            return res.status(400).send(renderErrorSVG(theme, {
                type: ErrorType.INVALID_USER_ID,
                message: 'User ID is required'
            }));
        }

        if (!validateUserId(id)) {
            clearTimeout(timeoutId);
            res.setHeader('Content-Type', 'image/svg+xml');
            return res.status(400).send(renderErrorSVG(theme, {
                type: ErrorType.INVALID_USER_ID,
                message: 'Invalid user ID format'
            }));
        }

        if (!validateTheme(theme)) {
            theme = 'classic';
        }

        const status = await getPresenceStatus(id);
        const activity = getYTMusicActivity(status);

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
        res.setHeader('Content-Security-Policy', "default-src 'none'; img-src * data:; style-src 'unsafe-inline'");
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
        res.setHeader('Connection', 'close');

        if (!activity) {
            const svgContent = renderSVG(theme, {
                track: 'Not Listening',
                artist: 'YouTube Music',
                albumArt: 'https://cdn.discordapp.com/emojis/847043868216524811.png',
                status: 'OFFLINE'
            });
            clearTimeout(timeoutId);
            return res.status(200).send(svgContent.replace('</svg>', `<!-- ${Date.now()} --></svg>`));
        }

        const { start, end } = activity.timestamps || {};
        const elapsed = start ? Date.now() - start : 0;
        const total = (start && end) ? end - start : 0;
        const progress = total ? Math.min(100, Math.max(0, (elapsed / total) * 100)) : 0;

        let albumArt = activity.assets?.large_url || (activity.assets?.large_image?.startsWith('mp:external')
            ? `https://media.discordapp.net/external/${activity.assets.large_image.split('external/')[1]}`
            : (activity.assets?.large_image
                ? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
                : 'https://cdn.discordapp.com/emojis/847043868216524811.png'));

        albumArt = await getBase64Image(albumArt);

        const svgContent = renderSVG(theme, {
            track: activity.details || 'Unknown Track',
            artist: activity.state || 'Unknown Artist',
            albumArt,
            status: 'LISTENING',
            progress,
            startTime: formatTime(elapsed),
            endTime: formatTime(total)
        });
        // Add a hidden timestamp inside SVG to bypass persistent caching
        return res.status(200).send(svgContent.replace('</svg>', `<!-- ${Date.now()} --></svg>`));
    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof APIError) {
            res.setHeader('Content-Type', 'image/svg+xml');
            return res.status(error.statusCode || 500).send(renderErrorSVG(
                (req.query.theme as string) || 'classic',
                {
                    type: error.type,
                    message: error.message,
                    details: error.details
                }
            ));
        }
        res.setHeader('Content-Type', 'image/svg+xml');
        res.status(500).send(renderErrorSVG(
            (req.query.theme as string) || 'classic',
            {
                type: ErrorType.GENERIC_ERROR,
                message: 'An unexpected error occurred'
            }
        ));
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
