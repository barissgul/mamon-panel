import API_URL, { getAuthHeaders } from './api.config';

export interface OtelDetay {
  id?: number;
  kisa_aciklama?: string;
  uzun_aciklama?: string;
  denize_mesafe?: string;
  havalimani_mesafe?: string;
  sehir_merkezi_mesafe?: string;
  oda_sayisi?: number;
  acilis_yili?: number;
  renovasyon_yili?: number;
  kat_sayisi?: number;
  onemli_bilgiler?: string;
  covid_onlemleri?: string;
  cocuk_politikasi?: string;
  evcil_hayvan_politikasi?: string;
  iptal_politikasi?: string;
}

export interface Otel {
  id: number;
  hizmet_id: number;
  ad: string;
  slug: string;
  yildiz: number;
  konsept?: string;
  sehir?: string;
  bolge?: string;
  adres?: string;
  telefon?: string;
  email?: string;
  web_site?: string;
  check_in_time: string;
  check_out_time: string;
  min_fiyat?: number;
  kapak_gorseli?: string;
  video_url?: string;
  enlem?: number;
  boylam?: number;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  detay?: OtelDetay;
  gorseller?: any[];
  odaTipleri?: any[];
  otelOzellikleri?: any[];
}

export interface CreateOtelDto {
  ad: string;
  yildiz?: number;
  konsept?: string;
  sehir?: string;
  bolge?: string;
  adres?: string;
  telefon?: string;
  email?: string;
  web_site?: string;
  check_in_time?: string;
  check_out_time?: string;
  min_fiyat?: number;
  kapak_gorseli?: string;
  video_url?: string;
  enlem?: number;
  boylam?: number;
  durum?: number;
  detay?: OtelDetay;
  otelOzellikIds?: number[];
}

export interface UpdateOtelDto extends Partial<CreateOtelDto> {}

// Tüm otelleri getir
export async function getOteller(): Promise<Otel[]> {
  try {
    const response = await fetch(`${API_URL}/otel`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Oteller yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Otel fetch error:', error);
    throw error;
  }
}

// Aktif otelleri getir
export async function getAktifOteller(): Promise<Otel[]> {
  try {
    const response = await fetch(`${API_URL}/otel/active`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Aktif oteller yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Aktif otel fetch error:', error);
    throw error;
  }
}

// Tek otel getir (ID ile)
export async function getOtel(id: number): Promise<Otel> {
  try {
    const response = await fetch(`${API_URL}/otel/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Otel yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Otel fetch error:', error);
    throw error;
  }
}

// Tek otel getir (Slug ile)
export async function getOtelBySlug(slug: string): Promise<Otel> {
  try {
    const response = await fetch(`${API_URL}/otel/slug/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Otel yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Otel fetch error:', error);
    throw error;
  }
}

// Yeni otel oluştur
export async function createOtel(data: CreateOtelDto): Promise<Otel> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/otel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Otel oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Otel oluşturma error:', error);
    throw error;
  }
}

// Otel güncelle
export async function updateOtel(
  id: number,
  data: UpdateOtelDto
): Promise<Otel> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/otel/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Otel güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Otel güncelleme error:', error);
    throw error;
  }
}

// Otel sil
export async function deleteOtel(id: number): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/otel/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Otel silinemedi');
    }
  } catch (error) {
    console.error('Otel silme error:', error);
    throw error;
  }
}

