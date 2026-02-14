import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock } from 'lucide-react';
import Button from '../components/Button';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { error } = await signIn({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/admin');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
            <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-8 border border-slate-100">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                        <Lock className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-dark-950">Admin Login</h2>
                    <p className="text-slate-500 mt-2">Masuk untuk mengelola konten website</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full justify-center mt-2"
                        disabled={loading}
                    >
                        {loading ? 'Memuat...' : 'Masuk'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
