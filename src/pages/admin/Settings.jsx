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
    const [preview, setPreview] = useState(null); // Current display URL
    const [selectedFile, setSelectedFile] = useState(null); // File object pending upload
    const [altText, setAltText] = useState('');
    const [originalAltText, setOriginalAltText] = useState('');

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
            setOriginalAltText(data.hero_image_alt || '');
        }
        setLoading(false);
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setSelectedFile(file);
    };

    const handleSaveChanges = async () => {
        try {
            setSaving(true);
            let publicUrl = preview;

            // 1. Upload to MinIO if a new file is selected
            if (selectedFile) {
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `hero-banner-${Date.now()}.${fileExt}`;
                const filePath = `${fileName}`;

                publicUrl = await uploadFileToMinio(selectedFile, filePath);
            }

            // 2. Update Database with new URL and Alt Text
            const updates = {
                id: SETTINGS_ID,
                hero_image_alt: altText,
                updated_at: new Date()
            };

            // Only update URL if it changed (i.e., new file uploaded)
            if (selectedFile) {
                updates.hero_image_url = publicUrl;
            }

            const { error: dbError } = await supabase
                .from('site_settings')
                .upsert(updates);

            if (dbError) throw dbError;

            // Update original state to match current
            setOriginalAltText(altText);
            setSelectedFile(null); // Clear pending file
            alert('Perubahan berhasil disimpan!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Gagal menyimpan perubahan: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const hasChanges = selectedFile || altText !== originalAltText;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-dark-950">Pengaturan Website</h1>
            </div>

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
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                            <label
                                htmlFor="hero-upload"
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all cursor-pointer bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                                <Upload className="w-4 h-4" /> Ganti Gambar
                            </label>
                            <p className="text-xs text-slate-400 mt-2">Disarankan ukuran 1200x800px atau lebih besar.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Alt Text / Deskripsi Gambar</label>
                        <input
                            type="text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Contoh: Tampilan dashboard Vlow.AI"
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                        <p className="text-xs text-slate-400">Deskripsi gambar untuk aksesabilitas dan SEO.</p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                        <Button
                            onClick={handleSaveChanges}
                            disabled={saving || !hasChanges}
                            className={`w-full sm:w-auto ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {saving ? (
                                <>Processing...</>
                            ) : (
                                <><Save className="w-4 h-4 mr-2" /> Simpan Perubahan</>
                            )}
                        </Button>
                    </div>

                    {!hasChanges && (
                        <div className="bg-slate-50 text-slate-500 p-3 rounded-lg text-xs text-center">
                            Belum ada perubahan untuk disimpan.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
