"use client";
import React, { useState, useRef } from 'react';
import { Camera, Loader2, UploadCloud, X, Image as ImageIcon } from 'lucide-react';
import { uploadImage } from '@/lib/storage';
import { useApp } from '@/context/AppContext';

/**
 * Reusable Image Upload Component
 * @param {string} value - Current image URL
 * @param {function} onChange - Callback when image changes (returns URL)
 * @param {string} label - Label for the upload
 * @param {string} folder - Firebase Storage folder
 * @param {string} className - Optional className for the container
 * @param {string} shape - 'circle' or 'rectangle'
 */
const ImageUpload = ({ 
    value, 
    onChange, 
    label, 
    folder = "uploads", 
    className = "", 
    shape = "circle" 
}) => {
    const { language, setAlert } = useApp();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validations
        if (!file.type.startsWith('image/')) {
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'يرجى اختيار ملف صور فقط.' : 'Please select an image file.',
                type: 'error'
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setAlert({
                title: language === 'ar' ? 'تنبيه' : 'Warning',
                message: language === 'ar' ? 'حجم الصورة كبير جداً. الحد الأقصى 5 ميجابايت.' : 'Image size is too large. Max limit is 5MB.',
                type: 'warning'
            });
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const downloadURL = await uploadImage(file, folder, (progress) => {
                setUploadProgress(Math.round(progress));
            });
            onChange(downloadURL);
            setAlert({
                title: language === 'ar' ? 'تم الرفع' : 'Uploaded',
                message: language === 'ar' ? 'تم رفع الصورة بنجاح.' : 'Image uploaded successfully.',
                type: 'success'
            });
        } catch (error) {
            console.error("Upload error:", error);
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'فشل رفع الصورة. حاول مرة أخرى.' : 'Failed to upload image. Try again.',
                type: 'error'
            });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerUpload = () => {
        if (!isUploading) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className={`flex flex-col items-center ${className}`}>
            {label && (
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 w-full text-center">
                    {label}
                </h3>
            )}
            
            <div 
                onClick={triggerUpload}
                className={`relative group cursor-pointer transition-all hover:scale-[1.02] active:scale-95 ${
                    shape === 'circle' ? 'w-32 h-32 rounded-full' : 'w-full h-48 rounded-[2rem]'
                } overflow-hidden border-4 border-dashed ${
                    isUploading ? 'border-amber-500 bg-amber-500/5' : 'border-gray-200 dark:border-white/10 hover:border-amber-400'
                } shadow-sm flex items-center justify-center bg-gray-50 dark:bg-white/5`}
            >
                {/* Current Image or Fallback */}
                {value && !isUploading ? (
                    <img src={value} alt="Preview" className="w-full h-full object-cover" />
                ) : !isUploading && (
                    <div className="flex flex-col items-center gap-2">
                        <UploadCloud className="w-8 h-8 text-gray-300 group-hover:text-amber-500 transition-colors" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {language === 'ar' ? 'رفع صورة' : 'Upload'}
                        </span>
                    </div>
                )}

                {/* Uploading Overlay */}
                {isUploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                        <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-2" />
                        <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-amber-500 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-black text-amber-600 mt-2">{uploadProgress}%</span>
                    </div>
                )}

                {/* Hover Overlay */}
                {!isUploading && (
                    <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white dark:bg-slate-900 p-2 rounded-full shadow-lg">
                            <Camera className="w-5 h-5 text-amber-500" />
                        </div>
                    </div>
                )}
            </div>

            <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            
            {value && !isUploading && (
                <button 
                    type="button"
                    onClick={() => onChange('')}
                    className="mt-2 text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1 hover:text-rose-600 transition-colors"
                >
                    <X className="w-3 h-3" />
                    {language === 'ar' ? 'إزالة الصورة' : 'Remove Image'}
                </button>
            )}
        </div>
    );
};

export default ImageUpload;
