import API_URL, { getAuthHeaders } from './api.config';

export interface FiltrKriterleri {
  bolgeler?: string[];
  kategoriler?: number[];
  ozellikler?: number[];
  yildiz?: number[];
  konseptler?: string[];
  min_fiyat?: number;
  max_fiyat?: number;
}

export interface DinamikSayfa {
  id: number;
  baslik: string;
  slug: string;
  aciklama?: string;
  filtre_kriterleri: FiltrKriterleri;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  kapak_gorseli?: string;
  sira: number;
  durum: number;
  ust_icerik?: string;
  alt_icerik?: string;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export interface CreateDinamikSayfaDto {
  baslik: string;
  slug: string;
  aciklama?: string;
  filtre_kriterleri: FiltrKriterleri;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  kapak_gorseli?: string;
  sira?: number;
  durum?: number;
  ust_icerik?: string;
  alt_icerik?: string;
}

export interface UpdateDinamikSayfaDto extends Partial<CreateDinamikSayfaDto> {}

// Tüm sayfaları getir
export async function getDinamikSayfalar(): Promise<DinamikSayfa[]> {
  try {
    const response = await fetch(`${API_URL}/dinamik-sayfalar`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Sayfalar yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Sayfa fetch error:', error);
    throw error;
  }
}

// Aktif sayfaları getir
export async function getAktifDinamikSayfalar(): Promise<DinamikSayfa[]> {
  try {
    const response = await fetch(`${API_URL}/dinamik-sayfalar/aktif`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Aktif sayfalar yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Aktif sayfa fetch error:', error);
    throw error;
  }
}

// Tek sayfa getir (ID ile)
export async function getDinamikSayfa(id: number): Promise<DinamikSayfa> {
  try {
    const response = await fetch(`${API_URL}/dinamik-sayfalar/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Sayfa yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Sayfa fetch error:', error);
    throw error;
  }
}

// Slug ile sayfa getir
export async function getDinamikSayfaBySlug(slug: string): Promise<DinamikSayfa> {
  try {
    const response = await fetch(`${API_URL}/dinamik-sayfalar/slug/${slug}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Sayfa yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Sayfa fetch error:', error);
    throw error;
  }
}

// Yeni sayfa oluştur
export async function createDinamikSayfa(data: CreateDinamikSayfaDto): Promise<DinamikSayfa> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/dinamik-sayfalar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Sayfa oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Sayfa oluşturma error:', error);
    throw error;
  }
}

// Sayfa güncelle
export async function updateDinamikSayfa(
  id: number,
  data: UpdateDinamikSayfaDto
): Promise<DinamikSayfa> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/dinamik-sayfalar/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Sayfa güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Sayfa güncelleme error:', error);
    throw error;
  }
}

// Sayfa sil
export async function deleteDinamikSayfa(id: number): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/dinamik-sayfalar/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Sayfa silinemedi');
    }
  } catch (error) {
    console.error('Sayfa silme error:', error);
    throw error;
  }
}

// Sayfanın filtreli otellerini getir (Preview için)
export async function getDinamikSayfaOtelleri(id: number): Promise<any[]> {
  try {
    const response = await fetch(`${API_URL}/dinamik-sayfalar/${id}/oteller`, {
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

