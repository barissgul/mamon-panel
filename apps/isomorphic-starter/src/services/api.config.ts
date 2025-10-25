import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  if (typeof window === 'undefined') return {};
  
  try {
    // Önce NextAuth session'dan token almayı dene
    const session = await getSession();
    const sessionToken = (session as any)?.accessToken;
    
    if (sessionToken) {
      return { Authorization: `Bearer ${sessionToken}` };
    }
    
    // Yoksa sessionStorage'dan al
    const storageToken = sessionStorage.getItem('token') || 
                        sessionStorage.getItem('accessToken') ||
                        localStorage.getItem('token') ||
                        localStorage.getItem('accessToken');
    
    if (storageToken) {
      return { Authorization: `Bearer ${storageToken}` };
    }
    
    console.warn('Token bulunamadı! Lütfen giriş yapın.');
    return {};
  } catch (error) {
    console.error('Auth headers error:', error);
    return {};
  }
};

// Sync version for non-async contexts (fallback)
export const getAuthHeadersSync = () => {
  if (typeof window === 'undefined') return {};
  
  const token = sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default API_URL;

