import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function Efficiency() {
    return (
        <section id="efficiency" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-bold text-dark-950 mb-6">
                            Scale bisnis kamu <br />
                            <span className="text-primary-600">10x lebih cepet</span> pake AI
                        </h2>
                        <p className="text-lg text-slate-600 mb-8">
                            Jangan abisin waktu buat bales chat yang sama terus. Biarin Vlow.AI yang handle pertanyaan repetitif, tim kamu fokus ke hal yang lebih penting.
                        </p>

                        <div className="space-y-4">
                            {[
                                "Hemat biaya support sampe 70%",
                                "Respon chat 95% lebih cepet",
                                "Online 24/7 tanpa istirahat",
                                "Kualitas jawaban konsisten di semua channel"
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3.5 h-3.5 text-green-600" />
                                    </div>
                                    <span className="text-slate-700 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-6">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] col-span-2 sm:col-span-1"
                            >
                                <p className="text-slate-500 text-sm mb-2 font-medium">Waktu Respon</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-bold text-dark-950">0.2d</span>
                                    <span className="text-green-600 text-sm mb-1 font-semibold">vs 2j (Manusia)</span>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] col-span-2 sm:col-span-1"
                            >
                                <p className="text-slate-500 text-sm mb-2 font-medium">Biaya per Tiket</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-bold text-dark-950">Rp 500</span>
                                    <span className="text-green-600 text-sm mb-1 font-semibold">-92% hemat</span>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-primary-600 p-8 rounded-[2rem] col-span-2 relative overflow-hidden shadow-xl shadow-primary-500/20"
                            >
                                <div className="relative z-10">
                                    <p className="text-white/80 text-sm mb-2 font-medium">Skor Kepuasan (CSAT)</p>
                                    <p className="text-5xl font-bold text-white">4.9/5</p>
                                    <p className="text-white/80 text-sm mt-2">Dari 10rb+ percakapan</p>
                                </div>
                                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4 text-white">
                                    <svg width="200" height="200" viewBox="0 0 200 200" fill="currentColor">
                                        <path d="M100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0ZM92.5 142.5L57.5 107.5L68.25 96.75L92.5 121L131.75 81.75L142.5 92.5L92.5 142.5Z" />
                                    </svg>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
