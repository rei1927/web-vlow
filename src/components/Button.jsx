import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    icon: Icon,
    href,
    ...props
}) {
    const variants = {
        primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-lg shadow-primary-500/30",
        secondary: "bg-white text-dark-950 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
        outline: "bg-transparent border border-primary-200 text-primary-600 hover:bg-primary-50",
        ghost: "bg-transparent text-slate-600 hover:text-primary-600 hover:bg-primary-50/50"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg font-semibold"
    };

    const Component = href ? motion.a : motion.button;

    return (
        <Component
            href={href}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
        inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
            {...props}
        >
            {children}
            {Icon && <Icon className="w-5 h-5" />}
        </Component>
    );
}
