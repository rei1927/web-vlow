import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import Button from '../../components/Button';
import Badge from '../../components/Badge';

export default function AdminPricing() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('pricing_plans')
            .select('*')
            .order('id', { ascending: true });

        if (error) console.error('Error fetching plans:', error);
        else setPlans(data || []);
        setLoading(false);
    };

    const openModal = (plan = null) => {
        setEditingPlan(plan);
        if (plan) {
            setValue('name', plan.name);
            setValue('price', plan.price);
            setValue('description', plan.description);
            setValue('features', plan.features.join('\n'));
            setValue('highlight', plan.highlight);
        } else {
            reset({ highlight: false });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPlan(null);
        reset();
    };

    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            features: data.features.split('\n').filter(f => f.trim() !== '')
        };

        if (editingPlan) {
            const { error } = await supabase
                .from('pricing_plans')
                .update(formattedData)
                .eq('id', editingPlan.id);
            if (error) alert('Error updating plan');
        } else {
            const { error } = await supabase
                .from('pricing_plans')
                .insert([formattedData]);
            if (error) alert('Error creating plan');
        }

        closeModal();
        fetchPlans();
    };

    const deletePlan = async (id) => {
        if (window.confirm('Yakin ingin menghapus paket ini?')) {
            const { error } = await supabase
                .from('pricing_plans')
                .delete()
                .eq('id', id);
            if (!error) fetchPlans();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark-950">Kelola Harga</h1>
                <Button onClick={() => openModal()} className="gap-2">
                    <Plus className="w-4 h-4" /> Tambah Paket
                </Button>
            </div>

            {loading ? (
                <p>Memuat data...</p>
            ) : (
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Nama Paket</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Harga</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Fitur Utama</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Highlight</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {plans.map((plan) => (
                                <tr key={plan.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-dark-950">{plan.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{plan.price}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm max-w-xs truncate">
                                        {plan.features.slice(0, 2).join(', ')}...
                                    </td>
                                    <td className="px-6 py-4">
                                        {plan.highlight ? (
                                            <Badge className="bg-primary-50 text-primary-600 border-primary-200">Yes</Badge>
                                        ) : (
                                            <span className="text-slate-400 text-sm">No</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button onClick={() => openModal(plan)} className="text-slate-400 hover:text-primary-600 transition-colors">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => deletePlan(plan.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {plans.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        Belum ada paket harga. Silakan buat baru.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/20 backdrop-blur-sm">
                    <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl relative">
                        <button onClick={closeModal} className="absolute top-6 right-6 text-slate-400 hover:text-dark-950">
                            <X className="w-6 h-6" />
                        </button>
                        <h2 className="text-2xl font-bold text-dark-950 mb-6">
                            {editingPlan ? 'Edit Paket' : 'Tambah Paket Baru'}
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Paket</label>
                                <input {...register('name', { required: true })} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="Contoh: Starter" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Harga (Teks Bebas)</label>
                                <input {...register('price', { required: true })} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" placeholder="Contoh: Rp 499rb" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
                                <textarea {...register('description')} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500" rows="2" placeholder="Deskripsi paket..." />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Fitur (Satu per baris)</label>
                                <textarea {...register('features', { required: true })} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 font-mono text-sm" rows="5" placeholder="1 AI Agent&#10;Support 24/7" />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input type="checkbox" {...register('highlight')} id="highlight" className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 border-gray-300" />
                                <label htmlFor="highlight" className="text-sm font-medium text-slate-700">Jadikan "Paling Laris"</label>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" onClick={closeModal} className="flex-1 justify-center">Batal</Button>
                                <Button type="submit" className="flex-1 justify-center gap-2"><Save className="w-4 h-4" /> Simpan</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
