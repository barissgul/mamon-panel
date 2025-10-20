import API_URL, { getAuthHeaders } from './api.config';

export interface OtelOdaOzellik {
  id: number;
  baslik: string;
  aciklama?: string;
  ikon?: string;
  sira: number;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export interface CreateOtelOdaOzellikDto {
  baslik: string;
  aciklama?: string;
  ikon?: string;
  sira?: number;
  durum?: number;
}

export interface UpdateOtelOdaOzellikDto {
  baslik?: string;
  aciklama?: string;
  ikon?: string;
  sira?: number;
  durum?: number;
}

// Tüm oda özelliklerini getir
export async function getOtelOdaOzellikler(): Promise<OtelOdaOzellik[]> {
  try {
    const response = await fetch(`${API_URL}/otel-oda-ozellik`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Oda özellikleri yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Oda özellik fetch error:', error);
    throw error;
  }
}

// Aktif oda özelliklerini getir
export async function getAktifOtelOdaOzellikler(): Promise<OtelOdaOzellik[]> {
  try {
    const response = await fetch(`${API_URL}/otel-oda-ozellik/active`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Aktif oda özellikleri yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Aktif oda özellik fetch error:', error);
    throw error;
  }
}

// Tek oda özelliği getir
export async function getOtelOdaOzellik(id: number): Promise<OtelOdaOzellik> {
  try {
    const response = await fetch(`${API_URL}/otel-oda-ozellik/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Oda özelliği yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Oda özellik fetch error:', error);
    throw error;
  }
}

// Yeni oda özelliği oluştur
export async function createOtelOdaOzellik(
  data: CreateOtelOdaOzellikDto
): Promise<OtelOdaOzellik> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/otel-oda-ozellik`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Oda özelliği oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Oda özellik oluşturma error:', error);
    throw error;
  }
}

// Oda özelliği güncelle
export async function updateOtelOdaOzellik(
  id: number,
  data: UpdateOtelOdaOzellikDto
): Promise<OtelOdaOzellik> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/otel-oda-ozellik/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Oda özelliği güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Oda özellik güncelleme error:', error);
    throw error;
  }
}

// Oda özelliği sil
export async function deleteOtelOdaOzellik(id: number): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/otel-oda-ozellik/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Oda özelliği silinemedi');
    }
  } catch (error) {
    console.error('Oda özellik silme error:', error);
    throw error;
  }
}

