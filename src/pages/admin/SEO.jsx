import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { Save, Plus, Trash2, Edit2, Upload, Search, Globe, Image as ImageIcon } from 'lucide-react';
import Button from '../../components/Button';

export default function AdminSEO() {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const currentOgImage = watch('og_image_url');

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('seo_pages')
            .select('*')
            .order('page_path', { ascending: true });

        if (data) setPages(data);
        setLoading(false);
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const payload = {
                page_path: data.page_path,
                title: data.title,
                description: data.description,
                keywords: data.keywords,
                og_image_url: data.og_image_url,
                updated_at: new Date()
            };

            if (editingId) {
                const { error } = await supabase
                    .from('seo_pages')
                    .update(payload)
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('seo_pages')
                    .insert(payload);
                if (error) throw error;
            }

            setShowModal(false);
            reset();
            setEditingId(null);
            fetchPages();
        } catch (error) {
            alert('Error saving SEO data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (page) => {
        setEditingId(page.id);
        setValue('page_path', page.page_path);
        setValue('title', page.title);
        setValue('description', page.description);
        setValue('keywords', page.keywords);
        setValue('og_image_url', page.og_image_url);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this SEO setting?')) return;

        const { error } = await supabase.from('seo_pages').delete().eq('id', id);
        if (!error) fetchPages();
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `seo-og-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);
            setValue('og_image_url', data.publicUrl);
        } catch (error) {
            alert('Error uploading image: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const openNewModal = () => {
        setEditingId(null);
        reset();
        setShowModal(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark-950">SEO Management</h1>
                <Button onClick={openNewModal}>
                    <Plus className="w-4 h-4 mr-2" /> Add New Page
                </Button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Path</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Title</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Description</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.map((page) => (
                            <tr key={page.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-sm font-medium text-primary-600">{page.page_path}</td>
                                <td className="p-4 text-sm text-slate-700 max-w-xs truncate">{page.title}</td>
                                <td className="p-4 text-sm text-slate-500 max-w-xs truncate">{page.description}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(page)} className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                        <button onClick={() => handleDelete(page.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {pages.length === 0 && !loading && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-slate-400">No SEO settings found. Click "Add New Page" to start.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-dark-950">{editingId ? 'Edit SEO' : 'Add New SEO Page'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-dark-950">&times;</button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Page Path</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        {...register('page_path', { required: true })}
                                        placeholder="/pricing"
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    />
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Example: <code>/</code> for home, <code>/pricing</code> for pricing page.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                                <input
                                    {...register('title', { required: true })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    placeholder="Page Title | Brand Name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                                <textarea
                                    {...register('description')}
                                    rows="3"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    placeholder="Brief description for search engines..."
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Keywords</label>
                                <input
                                    {...register('keywords')}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                                    placeholder="keyword1, keyword2, keyword3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Social Share Image (OG Image)</label>
                                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                                    {currentOgImage && (
                                        <img src={currentOgImage} alt="OG Preview" className="h-32 object-cover rounded-lg mb-4 border border-slate-200" />
                                    )}
                                    <div className="flex gap-4 items-center">
                                        <input
                                            {...register('og_image_url')}
                                            placeholder="https://..."
                                            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-sm"
                                        />
                                        <label className={`cursor-pointer px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 font-medium text-sm flex items-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                            <Upload className="w-4 h-4" />
                                            {uploading ? 'Uploading...' : 'Upload'}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save SEO Settings'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
