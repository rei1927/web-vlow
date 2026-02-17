import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Search, Calendar, MessageSquare, Download, Trash2, Edit2, X, Save, AlertTriangle } from 'lucide-react';
import Badge from '../../components/Badge';
import Button from '../../components/Button';
import { AnimatePresence, motion } from 'framer-motion';

export default function AdminLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // Delete State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const { data, error } = await supabase
                .from('leads')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setLeads(data || []);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.whatsapp.includes(searchTerm)
    );

    const exportToCSV = () => {
        const headers = ['Name', 'Email', 'WhatsApp', 'Chat Volume', 'Status', 'Created At'];
        const csvContent = [
            headers.join(','),
            ...filteredLeads.map(lead => [
                lead.name,
                lead.email,
                lead.whatsapp,
                lead.chat_volume,
                lead.status,
                new Date(lead.created_at).toISOString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `leads_vlow_ai_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    // --- Delete Logic ---
    const confirmDelete = (lead) => {
        setLeadToDelete(lead);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!leadToDelete) return;
        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from('leads')
                .delete()
                .eq('id', leadToDelete.id);

            if (error) throw error;

            setLeads(leads.filter(l => l.id !== leadToDelete.id));
            setIsDeleteModalOpen(false);
            setLeadToDelete(null);
        } catch (error) {
            console.error('Error deleting lead:', error);
            alert('Gagal menghapus lead.');
        } finally {
            setIsDeleting(false);
        }
    };

    // --- Edit Logic ---
    const openEditModal = (lead) => {
        setEditingLead({ ...lead });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('leads')
                .update({
                    name: editingLead.name,
                    email: editingLead.email,
                    whatsapp: editingLead.whatsapp,
                    chat_volume: editingLead.chat_volume,
                    status: editingLead.status
                })
                .eq('id', editingLead.id);

            if (error) throw error;

            setLeads(leads.map(l => l.id === editingLead.id ? editingLead : l));
            setIsEditModalOpen(false);
            setEditingLead(null);
        } catch (error) {
            console.error('Error updating lead:', error);
            alert('Gagal mengupdate lead.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-dark-950">Leads</h1>
                    <p className="text-slate-600 mt-1">Daftar calon pelanggan yang mengisi form konsultasi.</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 hover:text-dark-950 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 mb-1">Total Leads</p>
                    <p className="text-3xl font-bold text-dark-950">{leads.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 mb-1">Hari Ini</p>
                    <p className="text-3xl font-bold text-dark-950">
                        {leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 mb-1">Enterprise Potential</p>
                    <p className="text-3xl font-bold text-primary-600">
                        {leads.filter(l => l.chat_volume === '200+').length}
                    </p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama, email, atau WhatsApp..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Tanggal</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Nama Lengkap</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Kontak</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Estimasi Chat</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                        Belum ada data leads.
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                {new Date(lead.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-dark-950">{lead.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <span className="w-20 text-xs text-slate-400 uppercase tracking-wider">Email</span>
                                                    {lead.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <span className="w-20 text-xs text-slate-400 uppercase tracking-wider">WhatsApp</span>
                                                    <a href={`https://wa.me/${lead.whatsapp}`} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 hover:underline">
                                                        {lead.whatsapp}
                                                    </a>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={lead.chat_volume === '200+' ? 'primary' : 'default'} className="inline-flex">
                                                <MessageSquare className="w-3 h-3 mr-1" />
                                                {lead.chat_volume}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                                                ${lead.status === 'new' ? 'bg-blue-50 text-blue-700' :
                                                    lead.status === 'contacted' ? 'bg-yellow-50 text-yellow-700' :
                                                        lead.status === 'closed' ? 'bg-green-50 text-green-700' :
                                                            'bg-slate-100 text-slate-700'
                                                }`}>
                                                {lead.status === 'new' ? 'Baru' :
                                                    lead.status === 'contacted' ? 'Dihubungi' :
                                                        lead.status === 'closed' ? 'Selesai' : lead.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(lead)}
                                                    className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(lead)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsEditModalOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                                <h2 className="text-xl font-bold text-dark-950">Edit Lead</h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-dark-950">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                                    <input
                                        type="text"
                                        value={editingLead?.name || ''}
                                        onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editingLead?.email || ''}
                                        onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">WhatsApp</label>
                                    <input
                                        type="text"
                                        value={editingLead?.whatsapp || ''}
                                        onChange={(e) => setEditingLead({ ...editingLead, whatsapp: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                    <select
                                        value={editingLead?.status || 'new'}
                                        onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                                    >
                                        <option value="new">Baru</option>
                                        <option value="contacted">Dihubungi</option>
                                        <option value="closed">Selesai</option>
                                    </select>
                                </div>
                                <div className="pt-4 flex gap-3">
                                    <Button variant="outline" className="flex-1 justify-center" onClick={() => setIsEditModalOpen(false)} type="button">
                                        Batal
                                    </Button>
                                    <Button className="flex-1 justify-center" type="submit" disabled={isSaving}>
                                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Simpan'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setIsDeleteModalOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden p-6 text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-dark-950 mb-2">Hapus Lead?</h2>
                            <p className="text-slate-600 mb-6">
                                Apakah Anda yakin ingin menghapus data <strong>{leadToDelete?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
                            </p>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 justify-center" onClick={() => setIsDeleteModalOpen(false)}>
                                    Batal
                                </Button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-70"
                                >
                                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Hapus'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
