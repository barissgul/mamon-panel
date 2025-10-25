import API_URL, { getAuthHeaders } from './api.config';

export interface Kategori {
  id: number;
  hizmet_id: number;
  ad: string;
  slug: string;
  bolge?: string;
  adet: number;
  aciklama?: string;
  thumbnail?: string;
  kapak_gorseli?: string;
  sira: number;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  hizmet?: {
    id: number;
    ad: string;
    slug: string;
  };
}

export interface CreateKategoriDto {
  hizmet_id: number;
  ad: string;
  slug: string;
  bolge?: string;
  adet?: number;
  aciklama?: string;
  thumbnail?: string;
  kapak_gorseli?: string;
  sira?: number;
  durum?: number;
}

export interface UpdateKategoriDto {
  hizmet_id?: number;
  ad?: string;
  slug?: string;
  bolge?: string;
  adet?: number;
  aciklama?: string;
  thumbnail?: string;
  kapak_gorseli?: string;
  sira?: number;
  durum?: number;
}

// Tüm kategorileri getir
export async function getKategoriler(): Promise<Kategori[]> {
  try {
    const response = await fetch(`${API_URL}/kategoriler`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Kategoriler yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Kategori fetch error:', error);
    throw error;
  }
}

// Hizmete göre kategorileri getir
export async function getKategorilerByHizmet(
  hizmetId: number
): Promise<Kategori[]> {
  try {
    const response = await fetch(`${API_URL}/kategoriler/hizmet/${hizmetId}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Kategoriler yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Kategori fetch error:', error);
    throw error;
  }
}

// Tek kategori getir
export async function getKategori(id: number): Promise<Kategori> {
  try {
    const response = await fetch(`${API_URL}/kategoriler/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Kategori yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Kategori fetch error:', error);
    throw error;
  }
}

// Yeni kategori oluştur
export async function createKategori(
  data: CreateKategoriDto
): Promise<Kategori> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/kategoriler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Kategori oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Kategori oluşturma error:', error);
    throw error;
  }
}

// Kategori güncelle
export async function updateKategori(
  id: number,
  data: UpdateKategoriDto
): Promise<Kategori> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/kategoriler/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Kategori güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Kategori güncelleme error:', error);
    throw error;
  }
}

// Kategori sil
export async function deleteKategori(id: number): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/kategoriler/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Kategori silinemedi');
    }
  } catch (error) {
    console.error('Kategori silme error:', error);
    throw error;
  }
}

