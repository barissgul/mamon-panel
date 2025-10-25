import API_URL, { getAuthHeaders } from './api.config';

export interface SiteOzellik {
  id: number;
  sayfa: string;
  rozet: string;
  rozet_renk: string;
  baslik: string;
  aciklama?: string;
  sira: number;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export interface CreateSiteOzellikDto {
  sayfa?: string;
  rozet: string;
  rozet_renk?: string;
  baslik: string;
  aciklama?: string;
  sira?: number;
  durum?: number;
}

export interface UpdateSiteOzellikDto {
  sayfa?: string;
  rozet?: string;
  rozet_renk?: string;
  baslik?: string;
  aciklama?: string;
  sira?: number;
  durum?: number;
}

export async function getSiteOzellikleri(): Promise<SiteOzellik[]> {
  try {
    const response = await fetch(`${API_URL}/site-ozellikleri`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Site özellikleri yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Site özellik fetch error:', error);
    throw error;
  }
}

export async function getSiteOzellikleriBySayfa(
  sayfa: string
): Promise<SiteOzellik[]> {
  try {
    const response = await fetch(`${API_URL}/site-ozellikleri/sayfa/${sayfa}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Site özellikleri yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Site özellik fetch error:', error);
    throw error;
  }
}

export async function createSiteOzellik(
  data: CreateSiteOzellikDto
): Promise<SiteOzellik> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/site-ozellikleri`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Site özelliği oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Site özellik oluşturma error:', error);
    throw error;
  }
}

export async function updateSiteOzellik(
  id: number,
  data: UpdateSiteOzellikDto
): Promise<SiteOzellik> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/site-ozellikleri/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Site özelliği güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Site özellik güncelleme error:', error);
    throw error;
  }
}

export async function deleteSiteOzellik(id: number): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/site-ozellikleri/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Site özelliği silinemedi');
    }
  } catch (error) {
    console.error('Site özellik silme error:', error);
    throw error;
  }
}

