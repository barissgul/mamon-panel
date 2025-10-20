import API_URL, { getAuthHeaders } from './api.config';

export interface Kullanici {
  id: number;
  ad: string;
  soyad: string;
  email: string;
  telefon?: string;
  kullanici_tipi: 'musteri' | 'admin' | 'personel';
  durum: number;
  olusturulma_tarihi: string;
  guncellenme_tarihi: string;
}

export async function getKullanicilar(): Promise<Kullanici[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/kullanicilar`, {
      headers,
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Kullanıcılar yüklenemedi');
    }
    
    return response.json();
  } catch (error) {
    console.error('Kullanıcı fetch error:', error);
    throw error;
  }
}

export async function getKullanici(id: number): Promise<Kullanici> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/kullanicilar/${id}`, {
      headers,
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Kullanıcı yüklenemedi');
    }
    
    return response.json();
  } catch (error) {
    console.error('Kullanıcı fetch error:', error);
    throw error;
  }
}

export async function updateKullanici(id: number, data: Partial<Kullanici>): Promise<Kullanici> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/kullanicilar/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Kullanıcı güncellenemedi');
    }
    
    return response.json();
  } catch (error) {
    console.error('Kullanıcı güncelleme error:', error);
    throw error;
  }
}

export async function deleteKullanici(id: number): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/kullanicilar/${id}`, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      throw new Error('Kullanıcı silinemedi');
    }
  } catch (error) {
    console.error('Kullanıcı silme error:', error);
    throw error;
  }
}

