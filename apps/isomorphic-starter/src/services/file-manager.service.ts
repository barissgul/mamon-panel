import API_URL, { getAuthHeaders } from './api.config';

export interface FileManager {
  id: number;
  dosya_adi: string;
  orijinal_dosya_adi: string;
  dosya_yolu: string;
  dosya_tipi: string;
  dosya_boyutu: number;
  kategori: string;
  aciklama?: string;
  etiketler?: string;
  yukleyen_kullanici_id: number;
  goruntuleme_sayisi: number;
  indirme_sayisi: number;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export interface CreateFileManagerDto {
  dosya_adi: string;
  orijinal_dosya_adi: string;
  dosya_yolu: string;
  dosya_tipi: string;
  dosya_boyutu: number;
  kategori: string;
  aciklama?: string;
  etiketler?: string;
  yukleyen_kullanici_id: number;
}

export interface UpdateFileManagerDto extends Partial<CreateFileManagerDto> {}

// Tüm dosyaları getir
export async function getFiles(kategori?: string): Promise<FileManager[]> {
  try {
    const url = kategori 
      ? `${API_URL}/file-manager?kategori=${kategori}`
      : `${API_URL}/file-manager`;
    
    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      throw new Error(`Dosyalar yüklenemedi: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('File fetch error:', error);
    throw error;
  }
}

// Tek dosya getir
export async function getFile(id: number): Promise<FileManager> {
  try {
    const response = await fetch(`${API_URL}/file-manager/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Dosya yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('File fetch error:', error);
    throw error;
  }
}

// Dosya yükle
export async function uploadFile(
  file: File,
  kategori?: string,
  aciklama?: string,
  etiketler?: string
): Promise<FileManager> {
  try {
    const authHeaders = await getAuthHeaders();
    const formData = new FormData();
    formData.append('file', file);
    if (kategori) formData.append('kategori', kategori);
    if (aciklama) formData.append('aciklama', aciklama);
    if (etiketler) formData.append('etiketler', etiketler);

    const response = await fetch(`${API_URL}/file-manager/upload`, {
      method: 'POST',
      headers: authHeaders,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Dosya yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
}

// Dosya güncelle
export async function updateFile(
  id: number,
  data: UpdateFileManagerDto
): Promise<FileManager> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/file-manager/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Dosya güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('File update error:', error);
    throw error;
  }
}

// Dosya sil
export async function deleteFile(id: number): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/file-manager/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Dosya silinemedi');
    }
  } catch (error) {
    console.error('File delete error:', error);
    throw error;
  }
}

// İndirme sayacını artır
export async function incrementDownload(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/file-manager/${id}/download`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('İndirme sayacı güncellenemedi');
    }
  } catch (error) {
    console.error('Download counter error:', error);
    throw error;
  }
}

// Dosya boyutunu formatla
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Dosya ikonunu belirle
export function getFileIcon(mimeType: string): string {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.startsWith('audio/')) return '🎵';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  if (mimeType.includes('presentation')) return '📽️';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
  return '📎';
}

// Dosya kategorisini belirle
export function getFileCategory(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (
    mimeType.includes('pdf') ||
    mimeType.includes('word') ||
    mimeType.includes('excel') ||
    mimeType.includes('spreadsheet') ||
    mimeType.includes('presentation')
  ) {
    return 'document';
  }
  return 'other';
}

