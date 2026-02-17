
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useConsultation } from '../context/ConsultationContext';
import Button from './Button';
import { supabase } from '../lib/supabase';

export default function ConsultationModal() {
    const { isModalOpen, closeModal } = useConsultation();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // Save to Supabase
            const { error } = await supabase
                .from('leads')
                .insert([
                    {
                        name: data.name,
                        email: data.email,
                        whatsapp: data.whatsapp,
                        chat_volume: data.chatVolume
                    }
                ]);

            if (error) throw error;

            // Redirect to WhatsApp
            const phoneNumber = "6287885487671";
            const message = `Hallo, Kak. Saya dapat informasi dari Hompage Vlow.Ai. Jelasin dong apa itu Vlow.AI?
Nama : ${data.name}
Email : ${data.email}
No. WA : ${data.whatsapp}
Jumlah chat : ${data.chatVolume}`;

            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

            window.open(whatsappUrl, '_blank');
            closeModal();
            reset();
        } catch (error) {
            console.error('Error saving lead:', error);
            alert('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isModalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeModal}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden relative"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <div>
                                    <h2 className="text-xl font-bold text-dark-950">Konsultasi Dengan Kami</h2>
                                    <p className="text-sm text-slate-500 mt-1">Isi detail dibawah untuk mendapatkan free Demo</p>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-dark-950"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama</label>
                                    <input
                                        {...register("name", { required: "Nama wajib diisi" })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                                        placeholder="Nama Lengkap"
                                    />
                                    {errors.name && <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                                    <input
                                        {...register("email", {
                                            required: "Email wajib diisi",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Format email tidak valid"
                                            }
                                        })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                                        placeholder="email@perusahaan.com"
                                    />
                                    {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nomor WhatsApp</label>
                                    <input
                                        {...register("whatsapp", { required: "Nomor WhatsApp wajib diisi" })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
                                        placeholder="081234567890"
                                        type="tel"
                                    />
                                    {errors.whatsapp && <span className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-3">Jumlah chat bisnis per hari</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {["< 30", "30-200", "200+"].map((option) => (
                                            <label key={option} className="relative cursor-pointer">
                                                <input
                                                    type="radio"
                                                    value={option}
                                                    {...register("chatVolume", { required: "Pilih estimasi jumlah chat" })}
                                                    className="peer sr-only"
                                                />
                                                <div className="w-full py-2.5 text-center text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg peer-checked:bg-primary-50 peer-checked:border-primary-500 peer-checked:text-primary-700 hover:border-primary-200 transition-all">
                                                    {option}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.chatVolume && <span className="text-red-500 text-xs mt-1">{errors.chatVolume.message}</span>}
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" disabled={isSubmitting} className="w-full justify-center py-3 text-base shadow-lg shadow-primary-500/25 disabled:opacity-70 disabled:cursor-not-allowed">
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Memproses...
                                            </>
                                        ) : (
                                            <>
                                                Konsultasi Gratis Sekarang! <ArrowRight className="w-5 h-5 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                    <p className="text-center text-xs text-slate-400 mt-4">
                                        Dengan mendaftar, Anda setuju dengan Syarat & Ketentuan kami.
                                    </p>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
