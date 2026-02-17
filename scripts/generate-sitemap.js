
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local first, then .env if needed
dotenv.config({ path: '.env.local' });
dotenv.config();

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const EXTERNAL_DATA_URL = 'https://vlow-ai.com';

async function generateSitemap() {
    console.log('Generating sitemap...');

    // 1. Static Pages
    const staticPages = [
        '/',
        '/cmsadmin',
        // Add other static routes here if they exist in App.jsx but not in DB
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages
    staticPages.forEach(page => {
        sitemap += `  <url>
    <loc>${EXTERNAL_DATA_URL}${page}</loc>
    <changefreq>daily</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>
`;
    });

    // 2. Dynamic Pages from Database
    const { data: pages, error } = await supabase
        .from('seo_pages')
        .select('page_path, updated_at');

    if (error) {
        console.error('Error fetching pages from Supabase:', error);
    } else if (pages) {
        pages.forEach(page => {
            // Avoid duplicating static pages if they are also in DB
            if (!staticPages.includes(page.page_path)) {
                sitemap += `  <url>
    <loc>${EXTERNAL_DATA_URL}${page.page_path}</loc>
    <lastmod>${new Date(page.updated_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
            }
        });
    }

    sitemap += `</urlset>`;

    const publicDir = path.resolve('public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap generated successfully at public/sitemap.xml');
}

generateSitemap();
