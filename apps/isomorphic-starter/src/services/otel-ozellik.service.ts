import API_URL, { getAuthHeaders } from './api.config';

export interface OtelOzellik {
  id: number;
  baslik: string;
  aciklama?: string;
  ikon?: string;
  sira: number;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export interface CreateOtelOzellikDto {
  baslik: string;
  aciklama?: string;
  ikon?: string;
  sira?: number;
  durum?: number;
}

export interface UpdateOtelOzellikDto {
  baslik?: string;
  aciklama?: string;
  ikon?: string;
  sira?: number;
  durum?: number;
}

// Tüm otel özelliklerini getir
export async function getOtelOzellikler(): Promise<OtelOzellik[]> {
  try {
    const response = await fetch(`${API_URL}/otel-ozellik`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Otel özellikleri yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Otel özellik fetch error:', error);
    throw error;
  }
}

// Aktif otel özelliklerini getir
export async function getAktifOtelOzellikler(): Promise<OtelOzellik[]> {
  try {
    const response = await fetch(`${API_URL}/otel-ozellik/active`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Aktif otel özellikleri yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Aktif otel özellik fetch error:', error);
    throw error;
  }
}

// Tek otel özelliği getir
export async function getOtelOzellik(id: number): Promise<OtelOzellik> {
  try {
    const response = await fetch(`${API_URL}/otel-ozellik/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Otel özelliği yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Otel özellik fetch error:', error);
    throw error;
  }
}

// Yeni otel özelliği oluştur
export async function createOtelOzellik(
  data: CreateOtelOzellikDto
): Promise<OtelOzellik> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/otel-ozellik`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Otel özelliği oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Otel özellik oluşturma error:', error);
    throw error;
  }
}

// Otel özelliği güncelle
export async function updateOtelOzellik(
  id: number,
  data: UpdateOtelOzellikDto
): Promise<OtelOzellik> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/otel-ozellik/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Otel özelliği güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Otel özellik güncelleme error:', error);
    throw error;
  }
}

// Otel özelliği sil
export async function deleteOtelOzellik(id: number): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/otel-ozellik/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Otel özelliği silinemedi');
    }
  } catch (error) {
    console.error('Otel özellik silme error:', error);
    throw error;
  }
}

