import React from 'react';
import { motion } from 'framer-motion';

export default function Card({ children, className = '', ...props }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={`
        bg-white border border-slate-100 p-8 rounded-[2rem]
        shadow-xl shadow-slate-200/50
        hover:shadow-2xl hover:shadow-primary-500/10 hover:border-primary-100 transition-all duration-300
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.div>
    );
}
