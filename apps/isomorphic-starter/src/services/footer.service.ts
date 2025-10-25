import API_URL, { getAuthHeaders } from './api.config';

export interface FooterMenu {
  id: number;
  kategori: string;
  baslik: string;
  url: string;
  sira: number;
  durum: number;
}

export interface FooterAyar {
  id: number;
  anahtar: string;
  deger?: string;
  tip?: string;
  aciklama?: string;
}

export interface CreateFooterMenuDto {
  kategori: string;
  baslik: string;
  url: string;
  sira?: number;
  durum?: number;
}

export interface UpdateFooterAyarDto {
  deger?: string;
}

export async function getFooterMenuler(): Promise<FooterMenu[]> {
  const response = await fetch(`${API_URL}/footer/menuler`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Footer menüler yüklenemedi');
  return response.json();
}

export async function getFooterAyarlar(): Promise<FooterAyar[]> {
  const response = await fetch(`${API_URL}/footer/ayarlar`, { cache: 'no-store' });
  if (!response.ok) throw new Error('Footer ayarlar yüklenemedi');
  return response.json();
}

export async function createFooterMenu(data: CreateFooterMenuDto): Promise<FooterMenu> {
  const authHeaders = await getAuthHeaders();
  const response = await fetch(`${API_URL}/footer/menuler`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Menü oluşturulamadı');
  }
  return response.json();
}

export async function updateFooterMenu(id: number, data: Partial<CreateFooterMenuDto>): Promise<FooterMenu> {
  const authHeaders = await getAuthHeaders();
  const response = await fetch(`${API_URL}/footer/menuler/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Menü güncellenemedi');
  return response.json();
}

export async function deleteFooterMenu(id: number): Promise<void> {
  const headers = await getAuthHeaders();
  const response = await fetch(`${API_URL}/footer/menuler/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!response.ok) throw new Error('Menü silinemedi');
}

export async function updateFooterAyar(anahtar: string, deger: string): Promise<FooterAyar> {
  const authHeaders = await getAuthHeaders();
  const response = await fetch(`${API_URL}/footer/ayarlar/${anahtar}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders },
    body: JSON.stringify({ deger }),
  });
  if (!response.ok) throw new Error('Ayar güncellenemedi');
  return response.json();
}

