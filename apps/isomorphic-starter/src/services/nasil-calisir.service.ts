import API_URL, { getAuthHeaders } from './api.config';

export interface NasilCalisir {
  id: number;
  sayfa: string;
  baslik: string;
  aciklama?: string;
  gorsel_url?: string;
  gorsel_url_dark?: string;
  sira: number;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export interface CreateNasilCalisirDto {
  sayfa?: string;
  baslik: string;
  aciklama?: string;
  gorsel_url?: string;
  gorsel_url_dark?: string;
  sira?: number;
  durum?: number;
}

export interface UpdateNasilCalisirDto {
  sayfa?: string;
  baslik?: string;
  aciklama?: string;
  gorsel_url?: string;
  gorsel_url_dark?: string;
  sira?: number;
  durum?: number;
}

export async function getNasilCalisirlar(): Promise<NasilCalisir[]> {
  try {
    const response = await fetch(`${API_URL}/nasil-calisir`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Nasıl çalışır adımları yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Nasıl çalışır fetch error:', error);
    throw error;
  }
}

export async function createNasilCalisir(
  data: CreateNasilCalisirDto
): Promise<NasilCalisir> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/nasil-calisir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Adım oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Adım oluşturma error:', error);
    throw error;
  }
}

export async function updateNasilCalisir(
  id: number,
  data: UpdateNasilCalisirDto
): Promise<NasilCalisir> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/nasil-calisir/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Adım güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Adım güncelleme error:', error);
    throw error;
  }
}

export async function deleteNasilCalisir(id: number): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/nasil-calisir/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Adım silinemedi');
    }
  } catch (error) {
    console.error('Adım silme error:', error);
    throw error;
  }
}

