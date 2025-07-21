import { useState } from 'react';
import { storage } from '@/lib/supabase';
import { useAuthValidation } from './useAuthValidation';

interface UploadResult {
  url: string;
  path: string;
}

interface UploadError {
  message: string;
  code?: string;
}

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<UploadError | null>(null);
  const { validateAuth } = useAuthValidation();

  const uploadImage = async (
    file: File,
    folder: string = 'plants'
  ): Promise<UploadResult | null> => {
    setIsUploading(true);
    setError(null);

    try {
      // 認証チェック
      const authResult = await validateAuth();
      if (!authResult.isValid) {
        throw new Error(authResult.error || 'Authentication required');
      }

      // ファイル検証
      if (!file) {
        throw new Error('No file selected');
      }

      // ファイルサイズチェック (5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      // MIMEタイプチェック
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('File type must be JPEG, PNG, WebP, or GIF');
      }

      // ファイル名を生成（ユーザーID + タイムスタンプ + 元のファイル名）
      const timestamp = Date.now();
      const fileExtension = file.name.split('.').pop();
      const fileName = `${authResult.userId}_${timestamp}.${fileExtension}`;
      const filePath = `${folder}/${fileName}`;

      // Supabase Storageにアップロード
      const { error: uploadError } = await storage
        .from('plant-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // 公開URLを取得
      const {
        data: { publicUrl },
      } = storage.from('plant-images').getPublicUrl(filePath);

      return {
        url: publicUrl,
        path: filePath,
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError({ message: errorMessage });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (filePath: string): Promise<boolean> => {
    setError(null);

    try {
      // 認証チェック
      const authResult = await validateAuth();
      if (!authResult.isValid) {
        throw new Error(authResult.error || 'Authentication required');
      }

      const { error: deleteError } = await storage
        .from('plant-images')
        .remove([filePath]);

      if (deleteError) {
        throw new Error(`Delete failed: ${deleteError.message}`);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Delete failed';
      setError({ message: errorMessage });
      return false;
    }
  };

  const clearError = () => setError(null);

  return {
    uploadImage,
    deleteImage,
    isUploading,
    error,
    clearError,
  };
}
