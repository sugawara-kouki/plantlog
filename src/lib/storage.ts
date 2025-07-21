import { storage } from './supabase';

/**
 * Supabase Storageから公開URLを生成
 */
export function getStorageUrl(path: string): string {
  const { data } = storage.from('plant-images').getPublicUrl(path);
  return data.publicUrl;
}

/**
 * ファイルパスからファイル名を抽出
 */
export function getFileName(path: string): string {
  return path.split('/').pop() || '';
}

/**
 * ファイルサイズを人間が読みやすい形式に変換
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 画像ファイルかどうかを判定
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

/**
 * サポートされている画像形式かどうかを判定
 */
export function isSupportedImageType(mimeType: string): boolean {
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  return supportedTypes.includes(mimeType);
}
