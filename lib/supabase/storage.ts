// Supabase Storage helper - for future use when files are stored in Supabase Storage
// In the MVP, files are stored as base64 in the order record

export async function uploadFile(
  path: string,
  fileBuffer: ArrayBuffer,
  _contentType: string
): Promise<string> {
  // MVP stub - returns the path as the storage reference
  // Real implementation would use @supabase/storage-js
  return path;
}

export async function deleteFile(path: string): Promise<void> {
  // MVP stub
  console.debug("[storage] delete:", path);
}

export function getStoragePath(userId: string, orderId: string, extension: string): string {
  return `orders/${userId}/${orderId}.${extension}`;
}
