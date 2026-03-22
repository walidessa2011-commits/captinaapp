"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, UploadCloud, X, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import { uploadImage } from '@/lib/storage';
import { useApp } from '@/context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Reusable Image Upload Component with URL support
 */
const ImageUpload = ({ 
    value,
    currentImage, 
    onChange, 
    onUploadComplete,
    label, 
    folder = "uploads", 
    className = "", 
    shape = "circle" 
}) => {
    const finalValue = value || currentImage;
    const finalOnChange = onChange || onUploadComplete;

    const { language, setAlert } = useApp();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const [urlInput, setUrlInput] = useState(finalValue || '');
    const [showUrlInput, setShowUrlInput] = useState(false);

    useEffect(() => {
        setUrlInput(finalValue || '');
    }, [finalValue]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setAlert({
                title: language === 'ar' ? 'خطأ' : 'Error',
                message: language === 'ar' ? 'يرجى اختيار ملف صور فقط.' : 'Please select an image file.',
                type: 'error'
            });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
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
            finalOnChange(downloadURL);
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

    const handleUrlSubmit = () => {
        if (urlInput) {
            finalOnChange(urlInput);
            setShowUrlInput(false);
        }
    };

    const triggerUpload = () => {
        if (!isUploading) {
            fileInputRef.current?.click();
        }
    };

    return (
        <div className={`flex flex-col items-center w-full ${className}`}>
            {label && (
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-4 w-full text-start px-2">
                    {label}
                </h3>
            )}
            
            <div 
                className={`relative group transition-all ${
                    shape === 'circle' ? 'w-32 h-32 rounded-full' : 'w-full h-48 rounded-[2.5rem]'
                } overflow-hidden border-2 border-dashed ${
                    isUploading ? 'border-primary bg-primary/5' : 'border-slate-100 dark:border-white/10 hover:border-primary/50'
                } shadow-sm flex items-center justify-center bg-gray-50 dark:bg-white/5`}
            >
                {/* Current Image or Fallback */}
                {finalValue && !isUploading ? (
                    <img src={finalValue} alt="Preview" className="w-full h-full object-cover" />
                ) : !isUploading && (
                    <div className="flex flex-col items-center gap-2">
                        <UploadCloud className="w-8 h-8 text-gray-300 group-hover:text-primary transition-colors" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {language === 'ar' ? 'أضف صورة' : 'Add Image'}
                        </span>
                    </div>
                )}

                {/* Uploading Overlay */}
                {isUploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-2" />
                        <div className="w-full bg-gray-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-black text-primary mt-2">{uploadProgress}%</span>
                    </div>
                )}

                {/* Hover Overlay */}
                {!isUploading && (
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-center justify-center translate-y-full group-hover:translate-y-0 duration-300">
                        <div className="flex gap-2">
                            <button 
                                type="button"
                                onClick={triggerUpload}
                                className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform text-primary border border-slate-100 dark:border-white/10"
                                title={language === 'ar' ? 'رفع من الجهاز' : 'Upload from device'}
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                            <button 
                                type="button"
                                onClick={() => setShowUrlInput(!showUrlInput)}
                                className="bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform text-primary border border-slate-100 dark:border-white/10"
                                title={language === 'ar' ? 'إضافة رابط' : 'Add from Link'}
                            >
                                <LinkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showUrlInput && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-full mt-4 space-y-2 overflow-hidden px-1"
                    >
                        <div className="flex gap-2">
                            <input 
                                type="text"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder={language === 'ar' ? 'ألصق رابط الصورة هنا...' : 'Paste image URL here...'}
                                className="flex-grow bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl px-4 py-3 text-[11px] font-bold outline-none focus:ring-2 ring-primary/20 shadow-inner"
                            />
                            <button 
                                type="button"
                                onClick={handleUrlSubmit}
                                className="bg-primary text-white px-5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <ImageIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
            
            {finalValue && !isUploading && (
                <button 
                    type="button"
                    onClick={() => finalOnChange('')}
                    className="mt-4 text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all"
                >
                    <X className="w-3 h-3" />
                    {language === 'ar' ? 'حذف' : 'Remove'}
                </button>
            )}
        </div>
    );
};

export default ImageUpload;
