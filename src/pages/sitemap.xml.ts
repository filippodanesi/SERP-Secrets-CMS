import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import siteConfig from '../data/site-config';

export const GET: APIRoute = async ({ site }) => {
    const blog = await getCollection('blog');
    const pages = await getCollection('pages');
    const staticPaths = [
        ...siteConfig.headerNavLinks?.map(link => link.href) || [],
        ...siteConfig.footerNavLinks?.filter(link => !link.href.startsWith('http')).map(link => link.href) || []
    ];

    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${staticPaths.map(path => `
                <url>
                    <loc>${site?.origin}${path}</loc>
                    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
                </url>
            `).join('')}
            ${blog.map(post => `
                <url>
                    <loc>${site?.origin}/blog/${post.slug}</loc>
                    <lastmod>${post.data.lastUpdated?.toISOString().split('T')[0] || post.data.publishDate?.toISOString().split('T')[0]}</lastmod>
                </url>
            `).join('')}
            ${pages.map(page => `
                <url>
                    <loc>${site?.origin}/${page.slug}</loc>
                    <lastmod>${page.data.lastUpdated?.toISOString().split('T')[0]}</lastmod>
                </url>
            `).join('')}
        </urlset>`.trim();

    return new Response(xmlString, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=3600'
        }
    });
}