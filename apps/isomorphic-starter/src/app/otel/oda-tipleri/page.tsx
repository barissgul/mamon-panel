'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Text, Badge, Input } from 'rizzui';
import { PiMagnifyingGlassBold, PiPencilSimpleBold } from 'react-icons/pi';
import { getOteller, Otel } from '@/services/otel.service';

export default function OdaTipleriPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [oteller, setOteller] = useState<Otel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadOteller();
  }, []);

  const loadOteller = async () => {
    try {
      setLoading(true);
      const data = await getOteller();
      setOteller(data);
    } catch (error) {
      console.error('Oteller yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOteller = oteller.filter((otel) =>
    otel.ad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="mb-6">
        <Text className="text-2xl font-bold">Oda Tipleri Yönetimi</Text>
        <Text className="text-gray-500 mt-1">
          Otellerin oda tiplerini görüntüleyin ve yönetin
        </Text>
      </div>

      {/* Arama */}
      <div className="mb-6">
        <Input
          prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
          placeholder="Otel ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Oteller ve Oda Tipleri Listesi */}
      <div className="space-y-6">
        {filteredOteller.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Text className="text-gray-500">
              {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz otel eklenmemiş'}
            </Text>
          </div>
        ) : (
          filteredOteller.map((otel) => (
            <div
              key={otel.id}
              className="rounded-lg border border-gray-200 bg-white p-6"
            >
              {/* Otel Başlığı */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <Text className="text-xl font-semibold">{otel.ad}</Text>
                  <Badge
                    variant="flat"
                    color={otel.durum === 1 ? 'success' : 'danger'}
                    size="sm"
                  >
                    {otel.durum === 1 ? 'Aktif' : 'Pasif'}
                  </Badge>
                  {otel.yildiz && (
                    <Badge variant="flat" color="warning" size="sm">
                      {otel.yildiz} Yıldız
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/otel/${otel.id}`)}
                  >
                    Otel Detayı
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => router.push(`/otel/${otel.id}/oda-tipi/yeni`)}
                  >
                    Yeni Oda Tipi Ekle
                  </Button>
                </div>
              </div>

              {/* Oda Tipleri */}
              {otel.odaTipleri && otel.odaTipleri.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {otel.odaTipleri.map((odaTipi: any) => (
                    <div
                      key={odaTipi.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <Text className="font-semibold text-base mb-1">
                            {odaTipi.ad}
                          </Text>
                          {odaTipi.fiyat && (
                            <Text className="text-sm text-green-600 font-medium">
                              {odaTipi.fiyat} TL / Gece
                            </Text>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="text"
                          className="!p-1.5"
                          onClick={() =>
                            router.push(`/otel/${otel.id}/oda-tipi/${odaTipi.id}`)
                          }
                        >
                          <PiPencilSimpleBold className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <Text className="text-gray-500">Kapasite:</Text>
                          <Text className="font-medium">
                            {odaTipi.yetiskin_kapasite} Yetişkin
                            {odaTipi.cocuk_kapasite > 0 &&
                              `, ${odaTipi.cocuk_kapasite} Çocuk`}
                          </Text>
                        </div>
                        <div className="flex justify-between">
                          <Text className="text-gray-500">Oda Sayısı:</Text>
                          <Text className="font-medium">{odaTipi.oda_sayisi}</Text>
                        </div>
                        {odaTipi.metrekare && (
                          <div className="flex justify-between">
                            <Text className="text-gray-500">Metrekare:</Text>
                            <Text className="font-medium">
                              {odaTipi.metrekare} m²
                            </Text>
                          </div>
                        )}
                        {odaTipi.yatak_tipi && (
                          <div className="flex justify-between">
                            <Text className="text-gray-500">Yatak:</Text>
                            <Text className="font-medium text-xs">
                              {odaTipi.yatak_tipi}
                            </Text>
                          </div>
                        )}
                        <Badge
                          variant="flat"
                          color={odaTipi.durum === 1 ? 'success' : 'secondary'}
                          size="sm"
                          className="mt-2"
                        >
                          {odaTipi.durum === 1 ? 'Aktif' : 'Pasif'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Text>Bu otelde henüz oda tipi eklenmemiş</Text>
                  <Button
                    size="sm"
                    className="mt-3"
                    onClick={() => router.push(`/otel/${otel.id}/oda-tipi/yeni`)}
                  >
                    İlk Oda Tipini Ekle
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

