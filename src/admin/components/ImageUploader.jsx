import React, { useState } from 'react';
import { UploadCloud, Image, X, Check, Link as LinkIcon } from 'lucide-react';
import { storage } from '../../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const ImageUploader = ({ value, onChange, label = "الصورة الرئيسية" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    setUploading(true);

    // If Firebase Storage is available
    if (storage) {
      try {
        const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        onChange(downloadUrl);
        setUploading(false);
        return;
      } catch (err) {
        console.warn('Firebase Storage upload failed, falling back to Base64:', err);
      }
    }

    // Fallback to FileReader Base64
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target.result);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">{label}</label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'رفع من الجهاز' : 'استخدام رابط مباشر (URL)'}</span>
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex gap-2">
          <input
            type="url"
            value={manualUrl || value || ''}
            onChange={(e) => {
              setManualUrl(e.target.value);
              onChange(e.target.value);
            }}
            placeholder="https://images.unsplash.com/photo-..."
            className="flex-1 px-3 py-2 border rounded-xl text-xs font-mono"
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowUrlInput(false)}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
          >
            تأكيد
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-4 text-center transition cursor-pointer relative ${
            isDragging 
              ? 'border-emerald-500 bg-emerald-50/50' 
              : 'border-slate-300 hover:border-slate-400 bg-slate-50'
          }`}
        >
          {value ? (
            <div className="relative group max-h-52 w-full rounded-xl overflow-hidden mx-auto bg-black flex items-center justify-center">
              <img
                src={value}
                alt="Preview"
                className="max-h-52 w-auto object-contain rounded-xl"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="absolute top-2 end-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow"
                title="إزالة الصورة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center justify-center py-4">
              <UploadCloud className="w-10 h-10 text-slate-400 mb-2 animate-bounce" />
              <p className="text-xs font-bold text-slate-700">
                {uploading ? 'جارٍ رفع ومعالجة الصورة...' : 'اسحب الصورة هنا أو اضغط للاختيار من جهازك'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP حتى 5MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
};
