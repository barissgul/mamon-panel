import API_URL, { getAuthHeaders } from './api.config';

export interface Menu {
  id: number;
  menu: string;
  anamenu_alt_id: number;
  rota: string;
  ikon?: string;
  sira: number;
  yetki_ids?: string;
}

export interface AnamenuAlt {
  id: number;
  baslik: string;
  anamenu_id: number;
  rota: string;
  ikon?: string;
  sira: number;
  yetki_ids?: string;
  durum: number;
  menuler?: Menu[];
}

export interface Anamenu {
  id: number;
  anamenu: string;
  ikon?: string;
  sira: number;
  yetki_ids?: string;
  anamenuAltlar?: AnamenuAlt[];
}

// Tüm ana menüleri getir
export async function getAnamenuler(): Promise<Anamenu[]> {
  try {
    const response = await fetch(`${API_URL}/anamenu`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Ana menüler yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Anamenu fetch error:', error);
    throw error;
  }
}

// Tüm alt menüleri getir
export async function getAnamenuAltlar(): Promise<AnamenuAlt[]> {
  try {
    const response = await fetch(`${API_URL}/anamenu-alt`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Alt menüler yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('AnamenuAlt fetch error:', error);
    throw error;
  }
}

// Tüm menüleri getir
export async function getMenuler(): Promise<Menu[]> {
  try {
    const response = await fetch(`${API_URL}/menu`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Menüler yüklenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Menu fetch error:', error);
    throw error;
  }
}

// Ana menü güncelle
export async function updateAnamenu(id: number, data: Partial<Anamenu>): Promise<Anamenu> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/anamenu/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ana menü güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Anamenu güncelleme error:', error);
    throw error;
  }
}

// Alt menü güncelle
export async function updateAnamenuAlt(id: number, data: Partial<AnamenuAlt>): Promise<AnamenuAlt> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/anamenu-alt/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Alt menü güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('AnamenuAlt güncelleme error:', error);
    throw error;
  }
}

// Menü güncelle
export async function updateMenu(id: number, data: Partial<Menu>): Promise<Menu> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/menu/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Menü güncellenemedi');
    }

    return response.json();
  } catch (error) {
    console.error('Menu güncelleme error:', error);
    throw error;
  }
}
