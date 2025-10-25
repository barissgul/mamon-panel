import API_URL, { getAuthHeaders } from './api.config';

export interface Kullanici {
  id: number;
  ad: string;
  soyad: string;
  email: string;
  kullanici_adi: string;
  telefon?: string;
  resim?: string;
  kullanici_tipi: string; // 'yonetici' | 'personel' | 'acente' | 'musteri'
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export interface CreateKullaniciDto {
  ad: string;
  soyad: string;
  email: string;
  kullanici_adi: string;
  sifre: string;
  telefon?: string;
  resim?: string;
  kullanici_tipi?: 'YONETICI' | 'KULLANICI' | 'MUSTERI';
  durum?: number;
}

export interface UpdateKullaniciDto extends Partial<CreateKullaniciDto> {}

// Tüm kullanıcıları getir
export async function getKullanicilar(): Promise<Kullanici[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/kullanicilar`, {
      cache: 'no-store',
      headers: authHeaders,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Kullanıcılar yüklenemedi: ${response.status} - ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Kullanıcı fetch error:', error);
    throw error;
  }
}

// Tek kullanıcı getir (ID ile)
export async function getKullanici(id: number): Promise<Kullanici> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/kullanicilar/${id}`, {
      cache: 'no-store',
      headers: authHeaders,
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

// Yeni kullanıcı oluştur
export async function createKullanici(data: CreateKullaniciDto): Promise<Kullanici> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/kullanicilar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Kullanıcı oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Kullanıcı oluşturma error:', error);
    throw error;
  }
}

// Kullanıcı güncelle
export async function updateKullanici(
  id: number,
  data: UpdateKullaniciDto
): Promise<Kullanici> {
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
      const error = await response.json();
      throw new Error(error.message || 'Kullanıcı güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Kullanıcı güncelleme error:', error);
    throw error;
  }
}

// Kullanıcı sil
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

