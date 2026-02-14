import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from './Button';
import logo from '../assets/logo.png';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-primary-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
                        <img src={logo} alt="Vlow.AI Logo" className="h-10 w-auto" />
                        <span className="font-bold text-2xl tracking-tight text-dark-950">Vlow.AI</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-10">
                        <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Fitur</a>
                        <a href="#efficiency" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Efisiensi</a>
                        <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Harga</a>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-sm font-medium text-slate-900 hover:text-primary-600">Masuk</a>
                            <Button size="sm" className="rounded-full px-6">Coba Gratis</Button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 hover:text-primary-600">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2shadow-xl">
                            <a href="#features" className="block px-3 py-2 text-slate-600 hover:text-primary-600 hover:bg-secondary-50 rounded-lg">Fitur</a>
                            <a href="#efficiency" className="block px-3 py-2 text-slate-600 hover:text-primary-600 hover:bg-secondary-50 rounded-lg">Efisiensi</a>
                            <a href="#pricing" className="block px-3 py-2 text-slate-600 hover:text-primary-600 hover:bg-secondary-50 rounded-lg">Harga</a>
                            <div className="pt-4 flex flex-col gap-3">
                                <Button variant="outline" className="w-full justify-center">Masuk</Button>
                                <Button className="w-full justify-center">Coba Gratis</Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
