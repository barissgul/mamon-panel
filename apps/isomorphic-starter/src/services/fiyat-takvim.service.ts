const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface FiyatTakvim {
  id: number;
  oda_tipi_id: number;
  pansiyon_tipi_id?: number;
  baslangic_tarihi: string;
  bitis_tarihi: string;
  fiyat: number;
  min_konaklama_gece: number;
  max_konaklama_gece?: number;
  ozel_donem_adi?: string;
  durum: number;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  odaTipi?: any;
  pansiyonTipi?: any;
}

export interface CreateFiyatTakvimDto {
  oda_tipi_id: number;
  pansiyon_tipi_id?: number;
  baslangic_tarihi: string;
  bitis_tarihi: string;
  fiyat: number;
  min_konaklama_gece?: number;
  max_konaklama_gece?: number;
  ozel_donem_adi?: string;
  durum?: number;
}

export interface UpdateFiyatTakvimDto extends Partial<CreateFiyatTakvimDto> {}

export async function getAllFiyatTakvim(): Promise<FiyatTakvim[]> {
  const response = await fetch(`${API_URL}/otel-fiyat-takvim`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Fiyat takvimleri getirilemedi');
  }

  return response.json();
}

export async function getFiyatTakvimByOtelId(otelId: number): Promise<FiyatTakvim[]> {
  const response = await fetch(`${API_URL}/otel-fiyat-takvim/otel/${otelId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Fiyat takvimleri getirilemedi');
  }

  return response.json();
}

export async function getFiyatTakvimByOdaTipiId(odaTipiId: number): Promise<FiyatTakvim[]> {
  const response = await fetch(`${API_URL}/otel-fiyat-takvim/oda-tipi/${odaTipiId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Fiyat takvimleri getirilemedi');
  }

  return response.json();
}

export async function calculateTotalPrice(
  odaTipiId: number,
  girisTarihi: string,
  cikisTarihi: string,
  pansiyonTipiId?: number
): Promise<{
  toplam_fiyat: number;
  gece_sayisi: number;
  gunluk_fiyatlar: Array<{ tarih: string; fiyat: number }>;
}> {
  const params = new URLSearchParams({
    odaTipiId: odaTipiId.toString(),
    girisTarihi,
    cikisTarihi,
  });

  if (pansiyonTipiId) {
    params.append('pansiyonTipiId', pansiyonTipiId.toString());
  }

  const response = await fetch(
    `${API_URL}/otel-fiyat-takvim/fiyat-hesapla?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Fiyat hesaplanamadı');
  }

  return response.json();
}

export async function createFiyatTakvim(
  data: CreateFiyatTakvimDto
): Promise<FiyatTakvim> {
  const response = await fetch(`${API_URL}/otel-fiyat-takvim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Fiyat takvimi oluşturulamadı');
  }

  return response.json();
}

export async function updateFiyatTakvim(
  id: number,
  data: UpdateFiyatTakvimDto
): Promise<FiyatTakvim> {
  const response = await fetch(`${API_URL}/otel-fiyat-takvim/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Fiyat takvimi güncellenemedi');
  }

  return response.json();
}

export async function deleteFiyatTakvim(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/otel-fiyat-takvim/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Fiyat takvimi silinemedi');
  }
}

