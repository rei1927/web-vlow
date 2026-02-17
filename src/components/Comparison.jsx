import React from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle, ArrowDown } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';

export default function Comparison() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <Badge className="mb-4">Perbandingan</Badge>
                    <h2 className="text-3xl md:text-5xl font-bold text-dark-950 mb-6">
                        Kenapa harus pindah ke <span className="text-primary-600">Cara Baru?</span>
                    </h2>
                    <p className="text-lg text-slate-600">
                        Lihat bagaimana Vlow.AI mengubah cara kerja bisnis dalam menangani pelanggan.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                    {/* Cara Lama */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="bg-red-50/50 rounded-[2.5rem] p-8 border border-red-100 h-full">
                            <div className="text-center mb-8">
                                <div className="inline-block px-6 py-2 rounded-full bg-red-100 text-red-700 font-bold text-lg mb-2">
                                    Cara Lama
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 shadow-sm border border-red-50 mb-8 opacity-80 grayscale-[0.5]">
                                {/* Mockup Chat Lama */}
                                <div className="space-y-4">
                                    <div className="flex justify-end">
                                        <div className="bg-red-50 text-red-800 p-3 rounded-2xl rounded-tr-none text-sm max-w-[80%]">
                                            Mohon tunggu sebentar ya kak...
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="bg-slate-100 text-slate-600 p-3 rounded-2xl rounded-tl-none text-sm max-w-[80%]">
                                            Kok lama banget balesnya? 😡
                                        </div>
                                    </div>
                                    <div className="text-center text-xs text-slate-400 mt-2">
                                        Cost per transaksi: <span className="text-red-600 font-bold">Rp150K ↑</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { title: "Kehilangan 30%+ Leads Baru", desc: "Karena Slow Respond dan kabur ke kompetitor" },
                                    { title: "Buang 120+ jam per bulan", desc: "Menjawab pertanyaan yang sama dan leads yang ghosting" },
                                    { title: "Ribet training admin baru", desc: "Terlalu banyak informasi dan SOP untuk tim admin" },
                                    { title: "Data Pelanggan yang berantakan", desc: "Hilang potensi ratusan juta per bulan dari CRM dan remarketing" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                <XCircle className="w-5 h-5 text-red-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-dark-950 text-lg">{item.title}</h4>
                                            <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Cara Baru */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="bg-blue-50/50 rounded-[2.5rem] p-8 border border-blue-100 h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                            <div className="text-center mb-8 relative z-10">
                                <div className="inline-block px-6 py-2 rounded-full bg-blue-100 text-blue-700 font-bold text-lg mb-2">
                                    Cara Baru
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-blue-100 border border-blue-50 mb-8 relative z-10">
                                {/* Mockup Chat Baru */}
                                <div className="space-y-4">
                                    <div className="flex justify-end gap-2">
                                        <div className="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none text-sm max-w-[80%] shadow-lg shadow-blue-200">
                                            Halo kak! Ada yang bisa Vlow bantu? 😊
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-blue-600 font-medium">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        Dijawab AI dalam 2 detik
                                    </div>
                                    <div className="text-center text-xs text-slate-400 mt-2">
                                        Cost per transaksi: <span className="text-blue-600 font-bold">Rp40K ↓ (Hemat 73%)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {[
                                    { title: "Respon Pintar, Instant, 24/7", desc: "Langsung layani pelanggan saat mereka siap beli" },
                                    { title: "Filter Ribuan Chat dengan AI", desc: "AI menjawab pertanyaan umum, menghemat waktu admin" },
                                    { title: "Closing Rate Melonjak 30%+", desc: "Dengan Automatic AI Follow-up" },
                                    { title: "Training AI hanya dalam 10 menit", desc: "Dashboard yang mudah dan intuitif" }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <CheckCircle className="w-5 h-5 text-blue-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-dark-950 text-lg">{item.title}</h4>
                                            <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
