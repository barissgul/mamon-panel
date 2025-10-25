import API_URL, { getAuthHeaders } from './api.config';

export interface Yetki {
  id: number;
  yetki: string;
  durum: number;
}

export interface CreateYetkiDto {
  yetki: string;
  durum?: number;
}

export interface UpdateYetkiDto extends Partial<CreateYetkiDto> {}

// Tüm yetkileri getir
export async function getYetkiler(): Promise<Yetki[]> {
  try {
    const response = await fetch(`${API_URL}/yetkiler`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Yetkiler yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Yetki fetch error:', error);
    throw error;
  }
}

// Tek yetki getir (ID ile)
export async function getYetki(id: number): Promise<Yetki> {
  try {
    const response = await fetch(`${API_URL}/yetkiler/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Yetki yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Yetki fetch error:', error);
    throw error;
  }
}

// Yeni yetki oluştur
export async function createYetki(data: CreateYetkiDto): Promise<Yetki> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/yetkiler`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Yetki oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('Yetki oluşturma error:', error);
    throw error;
  }
}

// Yetki güncelle
export async function updateYetki(
  id: number,
  data: UpdateYetkiDto
): Promise<Yetki> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/yetkiler/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Yetki güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Yetki güncelleme error:', error);
    throw error;
  }
}

// Yetki sil
export async function deleteYetki(id: number): Promise<void> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_URL}/yetkiler/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error('Yetki silinemedi');
    }
  } catch (error) {
    console.error('Yetki silme error:', error);
    throw error;
  }
}

