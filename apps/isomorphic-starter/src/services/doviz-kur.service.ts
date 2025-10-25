const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface DovizKur {
  id: number;
  para_birimi: string;
  para_adi: string;
  alis_kuru: number;
  satis_kuru: number;
  tcmb_alis: number;
  tcmb_satis: number;
  yuzde_marj: number;
  kur_tarihi: string;
  son_guncelleme: string;
  durum: number;
}

export interface CreateDovizKurDto {
  para_birimi: string;
  para_adi: string;
  tcmb_alis: number;
  tcmb_satis: number;
  yuzde_marj?: number;
  kur_tarihi: string;
  durum?: number;
}

export interface UpdateDovizKurDto extends Partial<CreateDovizKurDto> {}

export async function getAllKurlar(): Promise<DovizKur[]> {
  const response = await fetch(`${API_URL}/doviz-kur`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Kurlar getirilemedi');
  }

  return response.json();
}

export async function getGuncelKurlar(): Promise<DovizKur[]> {
  const response = await fetch(`${API_URL}/doviz-kur/guncel`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Güncel kurlar getirilemedi');
  }

  return response.json();
}

export async function guncelleTCMBKurlar(yuzdeMarj?: number): Promise<{
  success: boolean;
  mesaj: string;
  guncellenen_sayisi: number;
  detaylar: any[];
}> {
  const params = yuzdeMarj ? `?yuzdeMarj=${yuzdeMarj}` : '';
  
  const response = await fetch(`${API_URL}/doviz-kur/tcmb-guncelle${params}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'TCMB kurları güncellenemedi' }));
    throw new Error(error.message || 'TCMB kurları güncellenemedi');
  }

  return response.json();
}

export async function createKur(data: CreateDovizKurDto): Promise<DovizKur> {
  const response = await fetch(`${API_URL}/doviz-kur`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Kur oluşturulamadı');
  }

  return response.json();
}

export async function updateKur(
  id: number,
  data: UpdateDovizKurDto
): Promise<DovizKur> {
  const response = await fetch(`${API_URL}/doviz-kur/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Kur güncellenemedi');
  }

  return response.json();
}

export async function deleteKur(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/doviz-kur/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Kur silinemedi');
  }
}

