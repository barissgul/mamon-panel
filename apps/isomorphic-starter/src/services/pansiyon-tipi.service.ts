const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface PansiyonTipi {
  id: number;
  kod: string;
  ad: string;
  aciklama?: string;
  sira: number;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
}

export interface CreatePansiyonTipiDto {
  kod: string;
  ad: string;
  aciklama?: string;
  sira?: number;
  durum?: number;
}

export interface UpdatePansiyonTipiDto {
  kod?: string;
  ad?: string;
  aciklama?: string;
  sira?: number;
  durum?: number;
}

export async function getAllPansiyonTipleri(): Promise<PansiyonTipi[]> {
  const response = await fetch(`${API_URL}/otel-pansiyon-tipi`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Pansiyon tipleri getirilemedi');
  }

  return response.json();
}

export async function getAktifPansiyonTipleri(): Promise<PansiyonTipi[]> {
  const response = await fetch(`${API_URL}/otel-pansiyon-tipi/aktif`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Aktif pansiyon tipleri getirilemedi');
  }

  return response.json();
}

export async function getPansiyonTipiById(id: number): Promise<PansiyonTipi> {
  const response = await fetch(`${API_URL}/otel-pansiyon-tipi/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Pansiyon tipi getirilemedi');
  }

  return response.json();
}

export async function createPansiyonTipi(
  data: CreatePansiyonTipiDto
): Promise<PansiyonTipi> {
  const response = await fetch(`${API_URL}/otel-pansiyon-tipi`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Pansiyon tipi oluşturulamadı');
  }

  return response.json();
}

export async function updatePansiyonTipi(
  id: number,
  data: UpdatePansiyonTipiDto
): Promise<PansiyonTipi> {
  const response = await fetch(`${API_URL}/otel-pansiyon-tipi/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Pansiyon tipi güncellenemedi');
  }

  return response.json();
}

export async function deletePansiyonTipi(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/otel-pansiyon-tipi/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Pansiyon tipi silinemedi');
  }
}

