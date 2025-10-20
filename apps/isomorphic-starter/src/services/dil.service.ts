import API_URL, { getAuthHeaders } from './api.config';

export interface Dil {
  id: number;
  kod: string;
  ad: string;
  yerel_ad?: string;
  varsayilan: boolean;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export interface CreateDilDto {
  kod: string;
  ad: string;
  yerel_ad?: string;
  varsayilan?: boolean;
  durum?: number;
}

export interface UpdateDilDto {
  kod?: string;
  ad?: string;
  yerel_ad?: string;
  varsayilan?: boolean;
  durum?: number;
}

// Tüm dilleri getir
export async function getDiller(): Promise<Dil[]> {
  const response = await fetch(`${API_URL}/diller`);
  if (!response.ok) {
    throw new Error('Diller yüklenemedi');
  }
  return response.json();
}

// Aktif dilleri getir
export async function getAktifDiller(): Promise<Dil[]> {
  const response = await fetch(`${API_URL}/diller/active`);
  if (!response.ok) {
    throw new Error('Aktif diller yüklenemedi');
  }
  return response.json();
}

// Varsayılan dili getir
export async function getVarsayilanDil(): Promise<Dil> {
  const response = await fetch(`${API_URL}/diller/default`);
  if (!response.ok) {
    throw new Error('Varsayılan dil yüklenemedi');
  }
  return response.json();
}

// Tek bir dil getir
export async function getDil(id: number): Promise<Dil> {
  const response = await fetch(`${API_URL}/diller/${id}`);
  if (!response.ok) {
    throw new Error('Dil yüklenemedi');
  }
  return response.json();
}

// Dil koduna göre dil getir
export async function getDilByKod(kod: string): Promise<Dil> {
  const response = await fetch(`${API_URL}/diller/kod/${kod}`);
  if (!response.ok) {
    throw new Error('Dil yüklenemedi');
  }
  return response.json();
}

// Yeni dil ekle
export async function createDil(dilData: CreateDilDto): Promise<Dil> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/diller`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dilData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Dil eklenemedi');
  }

  return response.json();
}

// Dil güncelle
export async function updateDil(id: number, dilData: UpdateDilDto): Promise<Dil> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/diller/${id}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dilData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Dil güncellenemedi');
  }

  return response.json();
}

// Dili varsayılan olarak ayarla
export async function setVarsayilanDil(id: number): Promise<Dil> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/diller/${id}/set-default`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Varsayılan dil ayarlanamadı');
  }

  return response.json();
}

// Dil sil
export async function deleteDil(id: number): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/diller/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Dil silinemedi');
  }
}

