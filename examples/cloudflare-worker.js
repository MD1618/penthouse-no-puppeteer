// Example using Cloudflare Puppeteer in a Worker
import puppeteer from '@cloudflare/puppeteer';
// Note: If using ES modules, you may need to import from the transpiled lib/ directory
// or configure your build system to handle the CommonJS module.exports
import penthouse from '../src/index.js';

export default {
    async fetch(request, env) {
        try {
            const { searchParams } = new URL(request.url);
            const url = searchParams.get('url');
            const cssString = searchParams.get('css') || 'body { margin: 0; padding: 0; }';

            if (!url) {
                return new Response('Please provide a ?url=https://example.com parameter', { status: 400 });
            }

            const criticalCss = await penthouse({
                url: url,
                cssString: cssString,
                puppeteer: {
                    getBrowser: () => puppeteer.launch(env.MYBROWSER), // Cloudflare Browser binding
                    keepBrowserOpen: true // Let Cloudflare manage browser lifecycle
                }
            });

            return new Response(criticalCss, {
                headers: {
                    'content-type': 'text/css',
                },
            });
        } catch (error) {
            return new Response('Error: ' + error.message, { status: 500 });
        }
    },
};
