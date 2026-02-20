import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Footer() {
    return (
        <footer className="bg-dark-950 border-t border-slate-900 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <img src={logo} alt="Vlow.AI Logo" className="h-8 w-auto grayscale brightness-200" />
                            <span className="font-bold text-2xl text-white tracking-tight">Vlow.AI</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            Revolusi interaksi pelanggan dengan AI agent cerdas. Scale bisnis kamu 10x lebih cepet dengan platform otomatisasi kami.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-6">Produk</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">Fitur</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Integrasi</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Harga</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Log Perubahan</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-6">Perusahaan</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><a href="#" className="hover:text-white transition-colors">Tentang Kami</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Karir</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-white mb-6">Legal</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><a href="/privacy-policy" className="hover:text-white transition-colors">Kebijakan Privasi</a></li>
                            <li><a href="/terms-and-conditions" className="hover:text-white transition-colors">Syarat & Ketentuan</a></li>
                            <li><a href="/data-deletion" className="hover:text-white transition-colors">Hapus Data</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-500 text-sm">© 2024 Vlow.AI. Hak cipta dilindungi.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
