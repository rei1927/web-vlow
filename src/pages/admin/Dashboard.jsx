import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark-950 mb-6">Dashboard</h1>
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                <p className="text-lg text-slate-600">
                    Selamat datang, <span className="font-semibold text-primary-600">{user?.email}</span>!
                </p>
                <p className="text-slate-500 mt-2">
                    Gunakan menu di sebelah kiri untuk mengelola konten website.
                </p>
            </div>
        </div>
    );
}
