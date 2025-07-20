'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface PhotoUploadSectionProps {
  onChange: (file: File | null) => void;
  error?: string;
}

export default function PhotoUploadSection({
  onChange,
  error,
}: PhotoUploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      onChange(file);

      const reader = new FileReader();
      reader.onload = e => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const removePhoto = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="lg:col-span-1">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 lg:text-xl">
        植物の写真
      </h2>

      {preview ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-card">
          <div className="relative">
            <Image
              src={preview}
              alt="植物の写真プレビュー"
              width={400}
              height={300}
              className="w-full h-64 lg:h-80 object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleSelectClick}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
            >
              写真を変更
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`bg-white rounded-2xl border-2 border-dashed p-8 text-center hover:border-primary transition-colors cursor-pointer lg:p-12 ${
            dragActive ? 'border-primary bg-primary/5' : 'border-gray-200'
          } ${error ? 'border-red-300' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleSelectClick}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl mx-auto mb-4 flex items-center justify-center lg:w-24 lg:h-24">
            <svg
              className="w-10 h-10 text-primary lg:w-12 lg:h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">写真を追加</h3>
          <p className="text-sm text-gray-500 mb-4">
            クリックして写真を選択またはドラッグ&ドロップ
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                handleSelectClick();
              }}
              className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium"
            >
              写真を選択
            </button>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                handleCameraClick();
              }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:border-primary transition-colors font-medium"
            >
              カメラで撮影
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
