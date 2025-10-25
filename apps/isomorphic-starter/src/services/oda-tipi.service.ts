import { API_URL, getAuthHeaders } from './api.config';

export interface OdaTipi {
  id: number;
  otel_id: number;
  ad: string;
  kapasite: number;
  yetiskin_kapasite: number;
  cocuk_kapasite: number;
  oda_sayisi: number;
  metrekare?: number;
  yatak_tipi?: string;
  manzara?: string;
  fiyat?: number;
  aciklama?: string;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  odaOzellikleri?: any[];
}

export interface CreateOdaTipiDto {
  otel_id: number;
  ad: string;
  kapasite?: number;
  yetiskin_kapasite?: number;
  cocuk_kapasite?: number;
  oda_sayisi?: number;
  metrekare?: number;
  yatak_tipi?: string;
  manzara?: string;
  fiyat?: number;
  aciklama?: string;
  durum?: number;
  odaOzellikIds?: number[];
}

export interface UpdateOdaTipiDto extends Partial<CreateOdaTipiDto> {}

// Otele ait oda tiplerini getir
export async function getOdaTipleri(otelId: number): Promise<OdaTipi[]> {
  try {
    const response = await fetch(`${API_URL}/otel/${otelId}/oda-tipi`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Oda tipleri yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Oda tipi fetch error:', error);
    throw error;
  }
}

// Tek oda tipi detayını getir
export async function getOdaTipi(id: number): Promise<OdaTipi> {
  try {
    const response = await fetch(`${API_URL}/otel/oda-tipi/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Oda tipi yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Oda tipi fetch error:', error);
    throw error;
  }
}

// Yeni oda tipi oluştur
export async function createOdaTipi(data: CreateOdaTipiDto): Promise<OdaTipi> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/otel/${data.otel_id}/oda-tipi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Oda tipi oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Oda tipi create error:', error);
    throw error;
  }
}

// Oda tipi güncelle
export async function updateOdaTipi(
  id: number,
  data: UpdateOdaTipiDto
): Promise<OdaTipi> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/otel/oda-tipi/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Oda tipi güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Oda tipi update error:', error);
    throw error;
  }
}

// Oda tipi sil
export async function deleteOdaTipi(id: number): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/otel/oda-tipi/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Oda tipi silinemedi');
    }
  } catch (error) {
    console.error('Oda tipi delete error:', error);
    throw error;
  }
}









