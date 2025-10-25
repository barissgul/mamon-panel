const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface StokTakvim {
  id: number;
  oda_tipi_id: number;
  tarih: string;
  toplam_oda: number;
  rezerve_oda: number;
  bloke_oda: number;
  musait_oda: number;
  notlar?: string;
  olusturma_tarihi: string;
  guncelleme_tarihi: string;
  odaTipi?: any;
}

export interface CreateStokTakvimDto {
  oda_tipi_id: number;
  tarih: string;
  toplam_oda: number;
  rezerve_oda?: number;
  bloke_oda?: number;
  notlar?: string;
}

export interface UpdateStokTakvimDto extends Partial<CreateStokTakvimDto> {}

export async function getAllStokTakvim(): Promise<StokTakvim[]> {
  const response = await fetch(`${API_URL}/otel-stok-takvim`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Stok takvimleri getirilemedi');
  }

  return response.json();
}

export async function getStokTakvimByOtelId(otelId: number): Promise<StokTakvim[]> {
  const response = await fetch(`${API_URL}/otel-stok-takvim/otel/${otelId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Stok takvimleri getirilemedi');
  }

  return response.json();
}

export async function getStokTakvimByOdaTipiId(odaTipiId: number): Promise<StokTakvim[]> {
  const response = await fetch(`${API_URL}/otel-stok-takvim/oda-tipi/${odaTipiId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Stok takvimleri getirilemedi');
  }

  return response.json();
}

export async function checkAvailability(
  odaTipiId: number,
  girisTarihi: string,
  cikisTarihi: string,
  odaSayisi?: number
): Promise<{
  musait: boolean;
  detaylar: any[];
  mesaj: string;
}> {
  const params = new URLSearchParams({
    odaTipiId: odaTipiId.toString(),
    girisTarihi,
    cikisTarihi,
  });

  if (odaSayisi) {
    params.append('odaSayisi', odaSayisi.toString());
  }

  const response = await fetch(
    `${API_URL}/otel-stok-takvim/musaitlik-kontrol?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Müsaitlik kontrol edilemedi');
  }

  return response.json();
}

export async function initializeStokForDateRange(
  odaTipiId: number,
  toplamOda: number,
  baslangicTarihi: string,
  bitisTarihi: string
): Promise<string> {
  const params = new URLSearchParams({
    odaTipiId: odaTipiId.toString(),
    toplamOda: toplamOda.toString(),
    baslangicTarihi,
    bitisTarihi,
  });

  const response = await fetch(
    `${API_URL}/otel-stok-takvim/stok-baslat?${params.toString()}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Stok başlatılamadı');
  }

  return response.json();
}

export async function createStokTakvim(
  data: CreateStokTakvimDto
): Promise<StokTakvim> {
  const response = await fetch(`${API_URL}/otel-stok-takvim`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Stok takvimi oluşturulamadı');
  }

  return response.json();
}

export async function updateStokTakvim(
  id: number,
  data: UpdateStokTakvimDto
): Promise<StokTakvim> {
  const response = await fetch(`${API_URL}/otel-stok-takvim/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Stok takvimi güncellenemedi');
  }

  return response.json();
}

export async function deleteStokTakvim(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/otel-stok-takvim/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Stok takvimi silinemedi');
  }
}

