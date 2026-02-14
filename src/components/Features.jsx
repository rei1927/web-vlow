import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, BarChart3, Users, Zap, Globe, Shield } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';

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
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Badge className="mb-4">Fitur Unggulan</Badge>
                    <h2 className="text-3xl md:text-5xl font-bold text-dark-950 mb-6">Semua yang kamu butuhin buat scale-up</h2>
                    <p className="text-lg text-slate-600">
                        Tools canggih buat bikin customer service kamu otomatis tapi tetep terasa manusiawi.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card key={index} className="h-full">
                                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-6">
                                    <Icon className="w-7 h-7 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-bold text-dark-950 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
