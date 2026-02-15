import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, BarChart3, Users, Zap, Globe, Shield, Check, ArrowRight, Play } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';
import demoVideo from '../assets/videos/demo.mov';

const features = [
    {
        icon: MessageCircle,
        title: "Support Omni-Channel",
        description: "Atur chat WhatsApp, Instagram, Telegram, dan Email dari satu dashboard yang simpel."
    },
    {
        icon: Zap,
        title: "Respon AI Instan",
        description: "Latih AI pake data bisnismu sendiri buat jawab pertanyaan customer secara otomatis dalam hitungan detik."
    },
    {
        icon: BarChart3,
        title: "Analitik Canggih",
        description: "Dapetin insight lengkap tentang sentimen customer, performa agen, dan tren percakapan."
    },
    {
        icon: Users,
        title: "Oper ke Manusia Mulus",
        description: "Kalo AI gak ngerti, chat langsung dioper ke tim support kamu tanpa putus konteks."
    },
    {
        icon: Globe,
        title: "Multibahasa",
        description: "Otomatis terjemahin chat secara real-time, support lebih dari 80 bahasa."
    },
    {
        icon: Shield,
        title: "Keamanan Enterprise",
        description: "Data customer kamu aman dengan enkripsi tingkat bank dan standar keamanan GDPR."
    }
];

export default function Features() {
    return (
        <section id="features" className="py-24 bg-secondary-50 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-white blur-[120px] rounded-full pointer-events-none mix-blend-overlay" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Intro / Video Showcase */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 mb-24"
                >
                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                        <Badge className="mb-6">Fitur Unggulan</Badge>
                        <h2 className="text-4xl lg:text-6xl font-bold tracking-tight text-dark-950 mb-6 leading-tight">
                            Respon Cepat,<br />
                            <span className="text-primary-600">Pelanggan Puas</span>
                        </h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Lihat bagaimana Vlow.AI menangani percakapan dengan natural dan efisien.
                            Tidak kaku seperti robot, tapi secepat kilat.
                        </p>

                        <div className="space-y-4 mb-8">
                            {[
                                "Balas chat otomatis dalam hitungan detik",
                                "Bahasa natural & luwes (tidak kaku)",
                                "Follow-up otomatis ke leads potensial",
                                "Integrasi ke CRM & Database tanpa ribet"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 justify-center lg:justify-start">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                                        <Check className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-slate-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                            <Button size="lg" className="shadow-xl shadow-primary-500/20">
                                Mulai Sekarang <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                            <Button variant="outline" size="lg">
                                Konsultasi Sales
                            </Button>
                        </div>
                    </div>

                    {/* Video / Phone Mockup */}
                    <div className="flex-1 w-full max-w-[350px] lg:max-w-[400px] mx-auto">
                        <div className="relative">
                            {/* Phone Frame */}
                            <div className="relative rounded-[3rem] border-8 border-dark-950 bg-dark-950 overflow-hidden shadow-2xl shadow-slate-400/50">
                                {/* Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-dark-950 rounded-b-2xl z-20"></div>

                                {/* Video Content */}
                                <div className="relative aspect-[9/19.5] bg-slate-900">
                                    <video
                                        src={demoVideo}
                                        className="w-full h-full object-contain"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-20 -right-12 bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 hidden sm:block z-30"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                        <Play className="w-5 h-5 fill-current" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-medium">Demo Live</p>
                                        <p className="font-bold text-dark-950">Chat Experience</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Grid Divider / Intro */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto mb-16 pt-20 border-t border-slate-200"
                >
                    <h2 className="text-3xl md:text-5xl font-bold text-dark-950 mb-6">Semua yang kamu butuhin buat scale-up</h2>
                    <p className="text-lg text-slate-600">
                        Tools canggih buat bikin customer service kamu otomatis tapi tetep terasa manusiawi.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        show: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
                                }}
                            >
                                <Card className="h-full">
                                    <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-6">
                                        <Icon className="w-7 h-7 text-primary-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-dark-950 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
