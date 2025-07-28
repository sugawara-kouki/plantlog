'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useImageUpload } from '@/hooks/useImageUpload';
import { RiCloseLine, RiCheckLine, RiErrorWarningLine, RiCameraLine } from '@remixicon/react';

interface PhotoUploadSectionProps {
  onChange: (
    uploadResult: { file: File; url: string; path: string } | undefined
  ) => void;
  error?: string;
}

export default function PhotoUploadSection({
  onChange,
  error,
}: PhotoUploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedData, setUploadedData] = useState<{
    file: File;
    url: string;
    path: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const {
    uploadImage,
    deleteImage,
    isUploading,
    error: uploadError,
    clearError,
  } = useImageUpload();

  const handleFile = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // プレビュー表示
      const reader = new FileReader();
      reader.onload = e => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // 画像をSupabaseにアップロード
      clearError();
      const uploadResult = await uploadImage(file, 'plants');

      if (uploadResult) {
        const data = {
          file,
          url: uploadResult.url,
          path: uploadResult.path,
        };
        setUploadedData(data);
        onChange(data);
      } else {
        // アップロード失敗時はプレビューもクリア
        setPreview(null);
        onChange(undefined);
      }
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

  const removePhoto = async () => {
    // Supabaseから画像を削除
    if (uploadedData) {
      await deleteImage(uploadedData.path);
    }

    setPreview(null);
    setUploadedData(null);
    onChange(undefined);
    clearError();
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
              disabled={isUploading}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              <RiCloseLine className="w-4 h-4" />
            </button>

            {isUploading && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-sm">アップロード中...</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={handleSelectClick}
              disabled={isUploading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
            >
              写真を変更
            </button>
          </div>

          {uploadedData && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 flex items-center">
                <RiCheckLine className="w-4 h-4 mr-2" />
                アップロード完了
              </p>
            </div>
          )}
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
            <RiCameraLine className="w-10 h-10 text-primary lg:w-12 lg:h-12" />
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

      {/* エラーメッセージ表示 */}
      {(error || uploadError) && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 flex items-center">
            <RiErrorWarningLine className="w-4 h-4 mr-2" />
            {error || uploadError?.message}
          </p>
        </div>
      )}

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
