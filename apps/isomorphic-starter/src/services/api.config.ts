import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  if (typeof window === 'undefined') return {};
  
  try {
    const session = await getSession();
    const token = (session as any)?.accessToken;
    return token ? { Authorization: `Bearer ${token}` } : {};
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

