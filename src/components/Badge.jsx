import React from 'react';

export default function Badge({ children, className = '' }) {
    return (
        <span className={`
      inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium
      bg-secondary-50 text-primary-700 border border-secondary-200
      ${className}
    `}>
            {children}
        </span>
    );
}
