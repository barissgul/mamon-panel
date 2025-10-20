import API_URL, { getAuthHeaders } from './api.config';

export interface Ceviri {
  id: number;
  dil_id: number;
  anahtar: string;
  deger: string;
  kategori?: string;
  aciklama?: string;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  dil?: {
    id: number;
    kod: string;
    ad: string;
  };
}

export interface CreateCeviriDto {
  dil_id: number;
  anahtar: string;
  deger: string;
  kategori?: string;
  aciklama?: string;
  durum?: number;
}

export interface UpdateCeviriDto {
  dil_id?: number;
  anahtar?: string;
  deger?: string;
  kategori?: string;
  aciklama?: string;
  durum?: number;
}

// Tüm çevirileri getir
export async function getCeviriler(): Promise<Ceviri[]> {
  const response = await fetch(`${API_URL}/ceviriler`);
  if (!response.ok) {
    throw new Error('Çeviriler yüklenemedi');
  }
  return response.json();
}

// Dile göre çevirileri getir
export async function getCevirilerByDilId(dilId: number): Promise<Ceviri[]> {
  const response = await fetch(`${API_URL}/ceviriler/dil/${dilId}`);
  if (!response.ok) {
    throw new Error('Çeviriler yüklenemedi');
  }
  return response.json();
}

// Dil koduna göre çevirileri getir
export async function getCevirilerByDilKod(dilKod: string): Promise<Ceviri[]> {
  const response = await fetch(`${API_URL}/ceviriler/dil-kod/${dilKod}`);
  if (!response.ok) {
    throw new Error('Çeviriler yüklenemedi');
  }
  return response.json();
}

// Dil koduna göre çevirileri obje olarak getir
export async function getCevirilerObject(dilKod: string): Promise<Record<string, string>> {
  const response = await fetch(`${API_URL}/ceviriler/dil-kod/${dilKod}/object`);
  if (!response.ok) {
    throw new Error('Çeviriler yüklenemedi');
  }
  return response.json();
}

// Kategoriye göre çevirileri getir
export async function getCevirilerByKategori(kategori: string): Promise<Ceviri[]> {
  const response = await fetch(`${API_URL}/ceviriler/kategori/${kategori}`);
  if (!response.ok) {
    throw new Error('Çeviriler yüklenemedi');
  }
  return response.json();
}

// Dil ve kategoriye göre çevirileri getir
export async function getCevirilerByDilAndKategori(
  dilId: number,
  kategori: string
): Promise<Ceviri[]> {
  const response = await fetch(`${API_URL}/ceviriler/dil/${dilId}/kategori/${kategori}`);
  if (!response.ok) {
    throw new Error('Çeviriler yüklenemedi');
  }
  return response.json();
}

// Dile göre kategorileri getir
export async function getKategorilerByDilId(dilId: number): Promise<string[]> {
  const response = await fetch(`${API_URL}/ceviriler/dil/${dilId}/kategoriler`);
  if (!response.ok) {
    throw new Error('Kategoriler yüklenemedi');
  }
  return response.json();
}

// Tek bir çeviri getir
export async function getCeviri(id: number): Promise<Ceviri> {
  const response = await fetch(`${API_URL}/ceviriler/${id}`);
  if (!response.ok) {
    throw new Error('Çeviri yüklenemedi');
  }
  return response.json();
}

// Yeni çeviri ekle
export async function createCeviri(ceviriData: CreateCeviriDto): Promise<Ceviri> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/ceviriler`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ceviriData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Çeviri eklenemedi');
  }

  return response.json();
}

// Toplu çeviri ekle
export async function createBulkCeviri(ceviriler: CreateCeviriDto[]): Promise<Ceviri[]> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/ceviriler/bulk`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ceviriler),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Çeviriler eklenemedi');
  }

  return response.json();
}

// Çeviri güncelle
export async function updateCeviri(id: number, ceviriData: UpdateCeviriDto): Promise<Ceviri> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/ceviriler/${id}`, {
    method: 'PATCH',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ceviriData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Çeviri güncellenemedi');
  }

  return response.json();
}

// Çeviri sil
export async function deleteCeviri(id: number): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/ceviriler/${id}`, {
    method: 'DELETE',
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Çeviri silinemedi');
  }
}

