import { supabase, isSupabaseConfigured } from './supabase/client';

export type StorageBucket = 'avatars' | 'documents' | 'articles' | 'logos';

export interface UploadResult {
  path: string;
  url: string;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: StorageBucket,
  path: string,
  file: File | Blob,
  options?: { upsert?: boolean; contentType?: string }
): Promise<UploadResult> {
  if (!isSupabaseConfigured) {
    console.warn('[Supabase Storage] Supabase not configured. Using placeholder URL.');
    return {
      path,
      url: URL.createObjectURL(file),
    };
  }

  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: options?.upsert ?? true,
    contentType: options?.contentType,
  });

  if (error) {
    console.error(`[uploadFile] Error uploading to ${bucket}/${path}:`, error);
    throw new Error(`Gagal mengunggah file ke Supabase Storage: ${error.message}`);
  }

  // Get public URL for public buckets, or signed URL for private
  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return {
    path: data.path,
    url: publicUrlData.publicUrl,
  };
}

/**
 * Get public URL of a file in Supabase Storage
 */
export function getStoragePublicUrl(bucket: StorageBucket, path: string): string {
  if (!isSupabaseConfigured) return path;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteStorageFile(bucket: StorageBucket, paths: string[]): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) {
    console.error(`[deleteStorageFile] Error deleting from ${bucket}:`, error);
    throw new Error(`Gagal menghapus file dari storage: ${error.message}`);
  }
}
