import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
    const posts = await getCollection('blog');
    
    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>${site?.origin}/</loc>
                <priority>1.0</priority>
            </url>
            ${posts.map(post => `
                <url>
                    <loc>${site?.origin}/blog/${post.slug}/</loc>
                    <lastmod>${post.data.publishDate.toISOString()}</lastmod>
                    <priority>0.7</priority>
                </url>
            `).join('')}
        </urlset>`,
        {
            headers: {
                'Content-Type': 'application/xml'
            }
        }
    );
}