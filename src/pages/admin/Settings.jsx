import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabase';
import { uploadFileToMinio } from '../../lib/minio';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';
import Button from '../../components/Button';

export default function AdminSettings() {
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [preview, setPreview] = useState(null);
    const [altText, setAltText] = useState('');

    // We assume there's always a row with ID=1. If not, we'll insert it.
    const SETTINGS_ID = 1;

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .eq('id', SETTINGS_ID)
            .single();

        if (data) {
            setPreview(data.hero_image_url);
            setAltText(data.hero_image_alt || '');
        }
        setLoading(false);
    };

    const handleImageUpload = async (e) => {
        try {
            setUploading(true);
            const file = e.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `hero-banner-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 1. Upload to MinIO
            const publicUrl = await uploadFileToMinio(file, filePath);

            // 2. Update Database with new URL
            const { error: dbError } = await supabase
                .from('site_settings')
                .upsert({ id: SETTINGS_ID, hero_image_url: publicUrl, updated_at: new Date() });

            if (dbError) throw dbError;

            setPreview(publicUrl);
            alert('Gambar berhasil diperbarui ke MinIO!');
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Gagal mengupload gambar: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveAltText = async () => {
        try {
            setSaving(true);
            const { error } = await supabase
                .from('site_settings')
                .upsert({
                    id: SETTINGS_ID,
                    hero_image_alt: altText,
                    updated_at: new Date()
                });

            if (error) throw error;
            alert('Alt text berhasil diperbarui!');
        } catch (error) {
            console.error('Error saving alt text:', error);
            alert('Gagal menyimpan alt text: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-dark-950 mb-6">Pengaturan Website</h1>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 max-w-2xl">
                <h2 className="text-xl font-bold text-dark-950 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary-600" /> Banner Depan (Hero)
                </h2>

                <div className="space-y-6">
                    <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors relative">
                        {preview ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                                <img src={preview} alt="Hero Banner Preview" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="aspect-video rounded-xl bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                                <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                                <p>Belum ada gambar custom</p>
                            </div>
                        )}

                        <div className="mt-4">
                            <input
                                type="file"
                                id="hero-upload"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploading}
                            />
                            <label
                                htmlFor="hero-upload"
                                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all cursor-pointer ${uploading
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg shadow-primary-500/30'
                                    }`}
                            >
                                {uploading ? (
                                    <>Uploading...</>
                                ) : (
                                    <><Upload className="w-4 h-4" /> Ganti Gambar</>
                                )}
                            </label>
                            <p className="text-xs text-slate-400 mt-2">Disarankan ukuran 1200x800px atau lebih besar.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Alt Text / Deskripsi Gambar</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                placeholder="Contoh: Tampilan dashboard Vlow.AI"
                                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <Button
                                onClick={handleSaveAltText}
                                disabled={saving}
                                className="whitespace-nowrap"
                            >
                                {saving ? 'Menyimpan...' : 'Simpan Text'}
                            </Button>
                        </div>
                        <p className="text-xs text-slate-400">Deskripsi gambar untuk aksesabilitas dan SEO.</p>
                    </div>

                    <div className="bg-blue-50 text-blue-700 p-4 rounded-xl text-sm border border-blue-100">
                        <p><strong>Info:</strong> Gambar yang diupload akan langsung menggantikan gambar default di halaman depan.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
