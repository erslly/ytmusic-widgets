import Fastify from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import { getPresenceStatus, getYTMusicActivity } from './api';
import { renderSVG } from './svg/renderer';
import { renderErrorSVG } from './svg/error-svg';
import { validateUserId, validateTheme, sanitizeInput } from './utils/validation';
import { APIError, ErrorType } from './types';
import { CONFIG } from './config';
import { getBase64Image } from './utils/image';
import { formatTime } from './utils/format';
import { getDominantColors } from './utils/colors';

const fastify = Fastify({
    logger: true,
    disableRequestLogging: true
});

fastify.register(fastifyCors, { origin: '*' });
fastify.register(fastifyHelmet, { crossOriginResourcePolicy: false });

fastify.get('/widgets/:id?', async (request, reply) => {
    let { id } = request.params as { id?: string };
    const query = request.query as any;
    let theme = query.theme || 'classic';

    if (!id && query.id) {
        id = query.id;
    }

    if (id && id.includes('&theme=')) {
        const parts = id.split('&theme=');
        id = parts[0];
        theme = parts[1];
    }

    id = sanitizeInput(id || '');
    theme = sanitizeInput(theme);

    reply.header('Content-Type', 'image/svg+xml');
    reply.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
    reply.header('Content-Security-Policy', "default-src 'none'; img-src * data:; style-src 'unsafe-inline'");
    reply.header('Pragma', 'no-cache');
    reply.header('Expires', '0');
    reply.header('Surrogate-Control', 'no-store');
    reply.header('Connection', 'close');

    if (!id) {
        return reply.status(400).send(renderErrorSVG(theme, {
            type: ErrorType.INVALID_USER_ID,
            message: 'User ID is required'
        }));
    }

    if (!validateUserId(id)) {
        return reply.status(400).send(renderErrorSVG(theme, {
            type: ErrorType.INVALID_USER_ID,
            message: 'Invalid user ID format'
        }));
    }

    if (!validateTheme(theme)) {
        theme = 'classic';
    }

    try {
        const status = await getPresenceStatus(id);
        const activity = getYTMusicActivity(status);

        if (!activity) {
            const svgContent = renderSVG(theme, {
                track: 'Not Listening',
                artist: 'YouTube Music',
                albumArt: CONFIG.DEFAULT_ALBUM_ART,
                status: 'OFFLINE'
            });
            return reply.status(200).send(svgContent.replace('</svg>', `<!-- ${Date.now()} --></svg>`));
        }

        const { start, end } = activity.timestamps || {};
        const elapsed = start ? Date.now() - start : 0;
        const total = (start && end) ? end - start : 0;
        const progress = total ? Math.min(100, Math.max(0, (elapsed / total) * 100)) : 0;

        let albumArt = activity.assets?.large_url || (activity.assets?.large_image?.startsWith('mp:external')
            ? `https://media.discordapp.net/external/${activity.assets.large_image.split('external/')[1]}`
            : (activity.assets?.large_image
                ? `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`
                : CONFIG.DEFAULT_ALBUM_ART));

        const rawAlbumArt = albumArt;
        albumArt = await getBase64Image(albumArt);
        const palette = await getDominantColors(rawAlbumArt);

        const svgContent = renderSVG(theme, {
            track: activity.details || 'Unknown Track',
            artist: activity.state || 'Unknown Artist',
            albumArt,
            status: 'LISTENING',
            progress,
            startTime: formatTime(elapsed),
            endTime: formatTime(total),
            palette
        });

        return reply.status(200).send(svgContent.replace('</svg>', `<!-- ${Date.now()} --></svg>`));
    } catch (error) {
        if (error instanceof APIError) {
            return reply.status(error.statusCode || 500).send(renderErrorSVG(
                theme,
                {
                    type: error.type,
                    message: error.message,
                    details: error.details
                }
            ));
        }
        return reply.status(500).send(renderErrorSVG(
            theme,
            {
                type: ErrorType.GENERIC_ERROR,
                message: 'An unexpected error occurred'
            }
        ));
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: CONFIG.PORT, host: '0.0.0.0' });
        console.log(`Server running on http://localhost:${CONFIG.PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();