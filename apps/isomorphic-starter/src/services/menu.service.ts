const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Menu {
  id: number;
  menu: string;
  anamenu_alt_id: number;
  rota: string;
  ikon?: string;
  sira: number;
  yetki_ids?: string;
  durum?: number;
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

export async function getAnamenuler(): Promise<Anamenu[]> {
  try {
    const response = await fetch(`${API_URL}/anamenu`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Anamenu verileri alınamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Anamenu fetch error:', error);
    return [];
  }
}

export async function getMenuler(): Promise<Menu[]> {
  try {
    const response = await fetch(`${API_URL}/menu`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Menu verileri alınamadı');
    }
    
    return response.json();
  } catch (error) {
    console.error('Menu fetch error:', error);
    return [];
  }
}

