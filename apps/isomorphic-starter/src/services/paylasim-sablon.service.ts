const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface PaylasimSablon {
  id: number;
  sablon_adi: string;
  aciklama?: string;
  arka_plan_rengi: string;
  arka_plan_gorsel?: string;
  logo_url?: string;
  logo_konum: string;
  baslik_font_family: string;
  baslik_font_size: number;
  baslik_renk: string;
  aciklama_font_family: string;
  aciklama_font_size: number;
  aciklama_renk: string;
  genislik: number;
  yukseklik: number;
  sablon_json?: any;
  durum: number;
}

export interface CreatePaylasimSablonDto {
  sablon_adi: string;
  aciklama?: string;
  arka_plan_rengi?: string;
  arka_plan_gorsel?: string;
  logo_url?: string;
  logo_konum?: string;
  baslik_font_family?: string;
  baslik_font_size?: number;
  baslik_renk?: string;
  aciklama_font_family?: string;
  aciklama_font_size?: number;
  aciklama_renk?: string;
  genislik?: number;
  yukseklik?: number;
  sablon_json?: any;
  durum?: number;
}

export async function getAllSablonlar(): Promise<PaylasimSablon[]> {
  const response = await fetch(`${API_URL}/paylasim-sablon`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Şablonlar getirilemedi');
  return response.json();
}

export async function createSablon(data: CreatePaylasimSablonDto): Promise<PaylasimSablon> {
  const response = await fetch(`${API_URL}/paylasim-sablon`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Şablon oluşturulamadı');
  return response.json();
}

export async function updateSablon(id: number, data: Partial<CreatePaylasimSablonDto>): Promise<PaylasimSablon> {
  const response = await fetch(`${API_URL}/paylasim-sablon/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Şablon güncellenemedi');
  return response.json();
}

export async function deleteSablon(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/paylasim-sablon/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Şablon silinemedi');
}

export async function createPreview(id: number, baslik: string, aciklama: string): Promise<string> {
  const params = new URLSearchParams({ baslik, aciklama });
  const response = await fetch(`${API_URL}/paylasim-sablon/${id}/preview?${params}`);
  if (!response.ok) throw new Error('Önizleme oluşturulamadı');
  return response.json();
}



