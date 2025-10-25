import API_URL, { getAuthHeaders } from './api.config';

export enum ContentType {
  KISA_ACIKLAMA = 'kisa_aciklama',
  UZUN_ACIKLAMA = 'uzun_aciklama',
  META_ACIKLAMA = 'meta_aciklama',
}

export interface GenerateContentDto {
  prompt: string;
  context?: string;
}

export interface GenerateOtelContentDto {
  otelAdi: string;
  yildiz: number;
  konsept?: string;
  sehir?: string;
  bolge?: string;
  contentType: ContentType;
}

export interface GenerateOtelContentResponse {
  kisaAciklama: string;
  uzunAciklama: string;
}

/**
 * Genel içerik oluşturma
 */
export async function generateContent(
  dto: GenerateContentDto
): Promise<string> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/ai/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'İçerik oluşturulamadı');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('AI içerik oluşturma hatası:', error);
    throw error;
  }
}

/**
 * Otel için içerik oluşturma
 */
export async function generateOtelContent(
  dto: GenerateOtelContentDto
): Promise<string> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/ai/otel/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Otel içeriği oluşturulamadı');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('AI otel içeriği oluşturma hatası:', error);
    throw error;
  }
}

/**
 * Otel için toplu içerik oluşturma (kısa + uzun açıklama)
 */
export async function generateMultipleOtelContent(
  dto: Omit<GenerateOtelContentDto, 'contentType'>
): Promise<GenerateOtelContentResponse> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/ai/otel/generate-multiple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(dto),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Otel içerikleri oluşturulamadı');
    }

    return response.json();
  } catch (error) {
    console.error('AI toplu içerik oluşturma hatası:', error);
    throw error;
  }
}

/**
 * Metni iyileştirme
 */
export async function improveText(
  text: string,
  instructions?: string
): Promise<string> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/ai/improve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify({ text, instructions }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Metin iyileştirilemedi');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('AI metin iyileştirme hatası:', error);
    throw error;
  }
}

/**
 * Metni özetleme
 */
export async function summarizeText(
  text: string,
  maxLength: number = 150
): Promise<string> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/ai/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify({ text, maxLength }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Metin özetlenemedi');
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('AI metin özetleme hatası:', error);
    throw error;
  }
}

/**
 * SEO anahtar kelimeleri önerme
 */
export async function suggestKeywords(
  otelAdi: string,
  sehir?: string,
  konsept?: string
): Promise<string[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const response = await fetch(`${API_URL}/ai/keywords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify({ otelAdi, sehir, konsept }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Anahtar kelimeler oluşturulamadı');
    }

    const data = await response.json();
    return data.keywords;
  } catch (error) {
    console.error('AI anahtar kelime önerme hatası:', error);
    throw error;
  }
}

