'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Text, Badge } from 'rizzui';
import { PiArrowLeftBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import {
  getDinamikSayfa,
  getDinamikSayfaOtelleri,
  DinamikSayfa,
} from '@/services/dinamik-sayfalar.service';

export default function DinamikSayfaPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const sayfaId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [sayfa, setSayfa] = useState<DinamikSayfa | null>(null);
  const [oteller, setOteller] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [sayfaId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sayfaData, otellerData] = await Promise.all([
        getDinamikSayfa(parseInt(sayfaId)),
        getDinamikSayfaOtelleri(parseInt(sayfaId)),
      ]);
      setSayfa(sayfaData);
      setOteller(otellerData);
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !sayfa) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="@container">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <PiArrowLeftBold className="h-4 w-4" />
            Geri
          </Button>
          <div>
            <Text className="text-2xl font-bold">{sayfa.baslik}</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Önizleme - {oteller.length} Otel Bulundu
            </Text>
          </div>
        </div>
        <Badge variant="flat" color={sayfa.durum === 1 ? 'success' : 'danger'}>
          {sayfa.durum === 1 ? 'Aktif' : 'Pasif'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Sayfa Bilgileri */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <Text className="text-lg font-semibold mb-4">Sayfa Bilgileri</Text>
          <div className="space-y-3">
            <div>
              <Text className="text-sm font-medium text-gray-500">URL Slug</Text>
              <Text className="text-base font-mono">/{sayfa.slug}</Text>
            </div>
            {sayfa.aciklama && (
              <div>
                <Text className="text-sm font-medium text-gray-500">Açıklama</Text>
                <Text className="text-base">{sayfa.aciklama}</Text>
              </div>
            )}
          </div>
        </div>

        {/* Filtre Kriterleri */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <Text className="text-lg font-semibold mb-4">Filtre Kriterleri</Text>
          <div className="flex flex-wrap gap-3">
            {sayfa.filtre_kriterleri.bolgeler && (
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <Text className="text-sm">
                  <span className="font-medium">Bölgeler:</span>{' '}
                  {sayfa.filtre_kriterleri.bolgeler.join(', ')}
                </Text>
              </div>
            )}
            {sayfa.filtre_kriterleri.yildiz && (
              <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                <Text className="text-sm">
                  <span className="font-medium">Yıldız:</span>{' '}
                  {sayfa.filtre_kriterleri.yildiz.join(', ')} ⭐
                </Text>
              </div>
            )}
            {sayfa.filtre_kriterleri.konseptler && (
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <Text className="text-sm">
                  <span className="font-medium">Konsept:</span>{' '}
                  {sayfa.filtre_kriterleri.konseptler.join(', ')}
                </Text>
              </div>
            )}
            {sayfa.filtre_kriterleri.min_fiyat && (
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <Text className="text-sm">
                  <span className="font-medium">Min Fiyat:</span>{' '}
                  {sayfa.filtre_kriterleri.min_fiyat} ₺
                </Text>
              </div>
            )}
            {sayfa.filtre_kriterleri.max_fiyat && (
              <div className="bg-purple-50 px-4 py-2 rounded-lg">
                <Text className="text-sm">
                  <span className="font-medium">Max Fiyat:</span>{' '}
                  {sayfa.filtre_kriterleri.max_fiyat} ₺
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* Oteller */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <Text className="text-lg font-semibold mb-4">
            Eşleşen Oteller ({oteller.length})
          </Text>

          {oteller.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Text>Belirtilen kriterlere uygun otel bulunamadı.</Text>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Otel
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Yıldız
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Lokasyon
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Konsept
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Min Fiyat
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {oteller.map((otel) => (
                    <tr key={otel.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <Text className="font-medium">{otel.ad}</Text>
                      </td>
                      <td className="px-4 py-4">
                        <Text className="text-sm">{'⭐'.repeat(otel.yildiz)}</Text>
                      </td>
                      <td className="px-4 py-4">
                        <Text className="text-sm text-gray-600">
                          {otel.sehir}
                          {otel.bolge && `, ${otel.bolge}`}
                        </Text>
                      </td>
                      <td className="px-4 py-4">
                        <Text className="text-sm">{otel.konsept || '-'}</Text>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {otel.min_fiyat && (
                          <Text className="text-sm font-semibold text-green-600">
                            {Number(otel.min_fiyat).toLocaleString('tr-TR')} ₺
                          </Text>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

