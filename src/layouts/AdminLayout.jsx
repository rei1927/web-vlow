import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, DollarSign, List, Home, Settings, Globe, Users } from 'lucide-react';

export default function AdminLayout() {
    const { signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await signOut();
        navigate('/cmsadmin');
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Users, label: 'Leads', path: '/admin/leads' },
        { icon: DollarSign, label: 'Harga', path: '/admin/pricing' },
        { icon: List, label: 'Fitur', path: '/admin/features' },
        { icon: Globe, label: 'SEO', path: '/admin/seo' },
        { icon: Settings, label: 'Pengaturan', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-secondary-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-100">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-dark-950">
                        <span className="text-primary-600">Vlow</span>Admin
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-primary-50 text-primary-600 font-medium'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-dark-950'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 space-y-1">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-dark-950 transition-all"
                    >
                        <Home className="w-5 h-5" />
                        Lihat Website
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all text-left"
                    >
                        <LogOut className="w-5 h-5" />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
