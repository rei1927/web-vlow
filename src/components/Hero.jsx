import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { ArrowRight, Bot, MessageSquare, Zap } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import defaultHeroImage from '../assets/hero.png';

export default function Hero() {
    const [heroImage, setHeroImage] = useState(defaultHeroImage);

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('hero_image_url')
                    .eq('id', 1)
                    .single();

                if (!error && data?.hero_image_url) {
                    setHeroImage(data.hero_image_url);
                }
            } catch (err) {
                console.error("Error loading hero image:", err);
            }
        }
        fetchSettings();
    }, []);

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            {/* Background Gradients - Light Mode */}
            <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-blue-50 to-white pointer-events-none" />
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary-100/40 blur-[120px] rounded-full mix-blend-multiply pointer-events-none animate-blob" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary-100/40 blur-[120px] rounded-full mix-blend-multiply pointer-events-none animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-50/40 blur-[120px] rounded-full mix-blend-multiply pointer-events-none animate-blob animation-delay-4000" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Badge className="mb-6">Baru: AI Agent V2.0 udah live! 🚀</Badge>

                            <motion.h1
                                className="text-5xl lg:text-7xl font-bold tracking-tight text-dark-950 mb-6 leading-tight"
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: { transition: { staggerChildren: 0.1 } }
                                }}
                            >
                                {["Tingkatin", "Support", "Bisnis", "Kamu", "pake"].map((word, i) => (
                                    <motion.span
                                        key={i}
                                        className="inline-block mr-3"
                                        variants={{
                                            hidden: { y: 20, opacity: 0 },
                                            visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
                                        }}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                                <br className="hidden lg:block" />
                                <motion.span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-500 to-primary-600 bg-300% animate-gradient inline-block"
                                    variants={{
                                        hidden: { scale: 0.8, opacity: 0 },
                                        visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: "backOut" } }
                                    }}
                                >
                                    Vlow.AI
                                </motion.span>
                            </motion.h1>
                            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                Otomatisin 80% chat customer pake AI agent yang pinter.
                                Hemat biaya, respon lebih cepet, dan bikin customer happy 24/7.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-primary-500/20">
                                    Coba Gratis Sekarang <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                                    Lihat Demo
                                </Button>
                            </div>

                            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-slate-500 text-sm font-medium">
                                <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary-600" /> Setup cuma 5 menit</span>
                                <span className="flex items-center gap-2"><Bot className="w-4 h-4 text-primary-600" /> Gak perlu coding</span>
                                <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-primary-600" /> Support 24/7</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Hero Image */}
                    <div className="flex-1 w-full max-w-lg lg:max-w-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative"
                        >
                            {/* Soft glow behind image */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-[2.5rem] blur-2xl opacity-40 -z-10" />

                            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 border border-white/50 bg-white">
                                <img src={heroImage} alt="Vlow.AI Dashboard Interface" className="w-full h-auto" />

                                {/* Floating Elements - Light Mode */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute top-10 -right-8 bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hidden sm:block"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-sm"><Bot /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Status AI Agent</p>
                                            <p className="font-bold text-dark-950">Aktif & Belajar</p>
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -bottom-6 -left-6 bg-white p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hidden sm:block"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm"><MessageSquare /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-medium">Chat selesai</p>
                                            <p className="font-bold text-dark-950">1,248 hari ini</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
