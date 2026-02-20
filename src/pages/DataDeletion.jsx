import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DataDeletion() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-6">Permintaan Penghapusan Data</h1>

                    <div className="prose prose-slate mx-auto text-slate-600">
                        <p className="text-lg leading-relaxed">
                            Untuk meminta penghapusan data Anda dari sistem Vlow Ai, silakan hubungi tim kami dengan mengirimkan email ke:
                        </p>
                        <p className="mt-4 font-semibold text-primary-600 text-xl">
                            support@vlow-ai.com
                        </p>
                        <p className="mt-6 text-sm text-slate-500">
                            Tim kami akan memproses permintaan Anda dalam waktu 24-48 jam kerja sesuai dengan kebijakan privasi kami.
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
