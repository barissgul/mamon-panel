const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface IptalPolitika {
  id: number;
  otel_id: number;
  ad: string;
  gun_oncesi: number;
  iade_orani: number;
  aciklama?: string;
  sira: number;
  durum: number;
  olusturma_tarihi: string;
  otel?: any;
}

export interface CreateIptalPolitikaDto {
  otel_id: number;
  ad: string;
  gun_oncesi: number;
  iade_orani?: number;
  aciklama?: string;
  sira?: number;
  durum?: number;
}

export interface UpdateIptalPolitikaDto extends Partial<CreateIptalPolitikaDto> {}

export async function getAllIptalPolitikalari(): Promise<IptalPolitika[]> {
  const response = await fetch(`${API_URL}/otel-iptal-politika`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('İptal politikaları getirilemedi');
  }

  return response.json();
}

export async function getIptalPolitikalarByOtelId(
  otelId: number
): Promise<IptalPolitika[]> {
  const response = await fetch(`${API_URL}/otel-iptal-politika/otel/${otelId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('İptal politikaları getirilemedi');
  }

  return response.json();
}

export async function getApplicablePolicy(
  otelId: number,
  gunOncesi: number
): Promise<IptalPolitika | null> {
  const params = new URLSearchParams({
    otelId: otelId.toString(),
    gunOncesi: gunOncesi.toString(),
  });

  const response = await fetch(
    `${API_URL}/otel-iptal-politika/uygun-politika?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('İptal politikası getirilemedi');
  }

  return response.json();
}

export async function getIptalPolitikaById(id: number): Promise<IptalPolitika> {
  const response = await fetch(`${API_URL}/otel-iptal-politika/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('İptal politikası getirilemedi');
  }

  return response.json();
}

export async function createIptalPolitika(
  data: CreateIptalPolitikaDto
): Promise<IptalPolitika> {
  const response = await fetch(`${API_URL}/otel-iptal-politika`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('İptal politikası oluşturulamadı');
  }

  return response.json();
}

export async function updateIptalPolitika(
  id: number,
  data: UpdateIptalPolitikaDto
): Promise<IptalPolitika> {
  const response = await fetch(`${API_URL}/otel-iptal-politika/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('İptal politikası güncellenemedi');
  }

  return response.json();
}

export async function deleteIptalPolitika(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/otel-iptal-politika/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('İptal politikası silinemedi');
  }
}

