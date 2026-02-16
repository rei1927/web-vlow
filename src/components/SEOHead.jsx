import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function SEOHead() {
    const location = useLocation();
    const [seoData, setSeoData] = useState({
        title: 'Vlow.AI - Scale Bisnis Kamu dengan AI Agent',
        description: 'Otomatisasi support customer dengan Vlow.AI. AI agent cerdas yang handle WhatsApp, Instagram, dan lainnya 24/7.',
        keywords: 'AI agent, customer support automation, whatsapp bot, instagram bot',
        og_image_url: 'https://vlow-ai.com/og-image.jpg' // Default OG Image
    });

    useEffect(() => {
        const fetchSEO = async () => {
            const path = location.pathname;

            // Try to find exact match first
            const { data, error } = await supabase
                .from('seo_pages')
                .select('*')
                .eq('page_path', path)
                .single();

            if (data && !error) {
                setSeoData({
                    title: data.title || seoData.title,
                    description: data.description || seoData.description,
                    keywords: data.keywords || seoData.keywords,
                    og_image_url: data.og_image_url || seoData.og_image_url
                });
            }
        };

        fetchSEO();
    }, [location.pathname]);

    return (
        <Helmet>
            <title>{seoData.title}</title>
            <meta name="description" content={seoData.description} />
            <meta name="keywords" content={seoData.keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://vlow-ai.com${location.pathname}`} />
            <meta property="og:title" content={seoData.title} />
            <meta property="og:description" content={seoData.description} />
            <meta property="og:image" content={seoData.og_image_url} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={`https://vlow-ai.com${location.pathname}`} />
            <meta property="twitter:title" content={seoData.title} />
            <meta property="twitter:description" content={seoData.description} />
            <meta property="twitter:image" content={seoData.og_image_url} />

            <link rel="canonical" href={`https://vlow-ai.com${location.pathname}`} />
        </Helmet>
    );
}
