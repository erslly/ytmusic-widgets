import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import axios from 'axios';
import { getPresenceStatus, getYTMusicActivity } from './api';
import { renderSVG } from './svg/renderer';

const app = express();
app.use(cors({ origin: '*' }));
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json());
app.disable('x-powered-by');
app.set('etag', false);
const PORT = process.env.PORT || 3000;

const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
};

const getBase64Image = async (url: string) => {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');
        const contentType = response.headers['content-type'] as string;
        return `data:${contentType};base64,${buffer.toString('base64')}`;
    } catch (e) {
        return url;
    }
};

app.get('/widgets/:id?', async (req, res) => {
    let { id } = req.params;
    let theme = (req.query.theme as string) || 'classic';
    if (!id && req.query.id) {
        id = req.query.id as string;
    }
    if (id && id.includes('&theme=')) {
        const parts = id.split('&theme=');
        id = parts[0];
        theme = parts[1];
    }

    if (!id) return res.status(400).send('Discord User ID is required');

    try {
        const status = await getPresenceStatus(id as string);
        const activity = getYTMusicActivity(status);

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
        res.setHeader('Content-Security-Policy', "default-src 'none'; img-src * data:; style-src 'unsafe-inline'");
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
        res.setHeader('Connection', 'close');

        if (!activity) {
            const svgContent = renderSVG(theme as string, {
                track: 'Not Listening',
                artist: 'YouTube Music',
                albumArt: 'https://cdn.discordapp.com/emojis/847043868216524811.png',
                status: 'OFFLINE'
            });
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

        const svgContent = renderSVG(theme as string, {
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
        console.error(error);
        res.status(500).send('Error fetching data');
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
