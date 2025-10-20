import API_URL, { getAuthHeaders } from './api.config';

export interface PanelKullanici {
  id: number;
  ad: string;
  soyad: string;
  email: string;
  kullanici_adi: string;
  telefon?: string;
  resim?: string;
  rol: 'admin' | 'editor' | 'viewer';
  durum: number;
  yetki_ids?: string;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export interface CreatePanelKullaniciDto {
  ad: string;
  soyad: string;
  email: string;
  kullanici_adi: string;
  sifre: string;
  telefon?: string;
  resim?: string;
  rol?: 'admin' | 'editor' | 'viewer';
  durum?: number;
  yetki_ids?: string;
}

export interface UpdatePanelKullaniciDto {
  ad?: string;
  soyad?: string;
  email?: string;
  kullanici_adi?: string;
  sifre?: string;
  telefon?: string;
  resim?: string;
  rol?: 'admin' | 'editor' | 'viewer';
  durum?: number;
  yetki_ids?: string;
}

export interface UpdatePanelProfileDto {
  ad?: string;
  soyad?: string;
  email?: string;
  telefon?: string;
  resim?: string;
  mevcutSifre?: string;
  yeniSifre?: string;
}

export interface LoginPanelResponse {
  kullanici: PanelKullanici;
  access_token: string;
}

// Panel kullanıcı girişi
export async function loginPanelKullanici(
  kullanici_adi: string,
  sifre: string
): Promise<LoginPanelResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login-panel-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ kullanici_adi, sifre }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Giriş başarısız');
    }

    return response.json();
  } catch (error) {
    console.error('Panel kullanıcı giriş error:', error);
    throw error;
  }
}

// Tüm panel kullanıcılarını getir
export async function getPanelKullanicilar(): Promise<PanelKullanici[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/panel-kullanicilar`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Panel kullanıcıları yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Panel kullanıcı fetch error:', error);
    throw error;
  }
}

// Tek panel kullanıcı getir
export async function getPanelKullanici(id: number): Promise<PanelKullanici> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/panel-kullanicilar/${id}`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Panel kullanıcı yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Panel kullanıcı fetch error:', error);
    throw error;
  }
}

// Yeni panel kullanıcı oluştur
export async function createPanelKullanici(
  data: CreatePanelKullaniciDto
): Promise<PanelKullanici> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/panel-kullanicilar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Panel kullanıcı oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Panel kullanıcı oluşturma error:', error);
    throw error;
  }
}

// Panel kullanıcı güncelle
export async function updatePanelKullanici(
  id: number,
  data: UpdatePanelKullaniciDto
): Promise<PanelKullanici> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/panel-kullanicilar/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Panel kullanıcı güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Panel kullanıcı güncelleme error:', error);
    throw error;
  }
}

// Panel kullanıcı sil
export async function deletePanelKullanici(id: number): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/panel-kullanicilar/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Panel kullanıcı silinemedi');
    }
  } catch (error) {
    console.error('Panel kullanıcı silme error:', error);
    throw error;
  }
}

// Profil bilgilerini getir
export async function getPanelProfile(): Promise<PanelKullanici> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/panel-profile`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Profil yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Profil fetch error:', error);
    throw error;
  }
}

// Profil güncelle
export async function updatePanelProfile(
  data: UpdatePanelProfileDto
): Promise<PanelKullanici> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/panel-profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profil güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Profil güncelleme error:', error);
    throw error;
  }
}

