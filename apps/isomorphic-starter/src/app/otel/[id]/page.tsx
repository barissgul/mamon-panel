'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Text, Badge } from 'rizzui';
import { 
  PiPencilBold, 
  PiArrowLeftBold, 
  PiMapPinBold, 
  PiPhoneBold, 
  PiEnvelopeBold, 
  PiGlobeBold,
  PiHouseLineBold,
  PiImageBold,
} from 'react-icons/pi';
import toast from 'react-hot-toast';
import { getOtel, Otel } from '@/services/otel.service';

export default function OtelDetayPage() {
  const params = useParams();
  const router = useRouter();
  const otelId = params.id as string;
  
  const [otel, setOtel] = useState<Otel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOtel();
  }, [otelId]);

  const loadOtel = async () => {
    try {
      setLoading(true);
      const data = await getOtel(parseInt(otelId));
      setOtel(data);
    } catch (error) {
      toast.error('Otel yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const renderYildizlar = (yildiz: number) => {
    return '⭐'.repeat(yildiz);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  if (!otel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Text className="text-gray-500 mb-4">Otel bulunamadı</Text>
          <Button onClick={() => router.back()}>Geri Dön</Button>
        </div>
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
            <div className="flex items-center gap-3">
              <Text className="text-2xl font-bold">{otel.ad}</Text>
              <Badge
                variant="flat"
                color={otel.durum === 1 ? 'success' : 'danger'}
                className="font-medium"
              >
                {otel.durum === 1 ? 'Aktif' : 'Pasif'}
              </Badge>
            </div>
            <Text className="text-sm text-gray-500 mt-1">
              {renderYildizlar(otel.yildiz)} • {otel.konsept}
            </Text>
          </div>
        </div>
        <Link href={`/otel/${otel.id}/duzenle`}>
          <Button className="flex items-center gap-2">
            <PiPencilBold className="h-4 w-4" />
            Düzenle
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Temel Bilgiler */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <Text className="text-lg font-semibold mb-4">Temel Bilgiler</Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Text className="text-sm font-medium text-gray-500 mb-1">
                Otel Adı
              </Text>
              <Text className="text-base">{otel.ad}</Text>
            </div>
            
            <div>
              <Text className="text-sm font-medium text-gray-500 mb-1">
                Yıldız
              </Text>
              <Text className="text-base">{renderYildizlar(otel.yildiz)}</Text>
            </div>

            <div>
              <Text className="text-sm font-medium text-gray-500 mb-1">
                Konsept
              </Text>
              <Text className="text-base">{otel.konsept || '-'}</Text>
            </div>

            <div>
              <Text className="text-sm font-medium text-gray-500 mb-1">
                Minimum Fiyat
              </Text>
              <Text className="text-base font-semibold text-green-600">
                {otel.min_fiyat
                  ? `${Number(otel.min_fiyat).toLocaleString('tr-TR')} ₺`
                  : '-'}
              </Text>
            </div>

            <div>
              <Text className="text-sm font-medium text-gray-500 mb-1">
                Check-in / Check-out
              </Text>
              <Text className="text-base">
                {otel.check_in_time} - {otel.check_out_time}
              </Text>
            </div>

            <div>
              <Text className="text-sm font-medium text-gray-500 mb-1">
                Slug
              </Text>
              <Text className="text-base text-gray-600 font-mono text-sm">
                {otel.slug}
              </Text>
            </div>
          </div>
        </div>

        {/* Otel Özellikleri */}
        {otel.otelOzellikleri && otel.otelOzellikleri.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">
              Otel Özellikleri
            </Text>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {otel.otelOzellikleri.map((ozellik: any) => (
                <div
                  key={ozellik.id}
                  className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200"
                >
                  {ozellik.ikon && (
                    <span className="text-lg">{ozellik.ikon}</span>
                  )}
                  <Text className="text-sm font-medium text-gray-700">
                    {ozellik.baslik}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lokasyon */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <PiMapPinBold className="h-5 w-5 text-gray-700" />
            <Text className="text-lg font-semibold">Lokasyon</Text>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Text className="text-sm font-medium text-gray-500 mb-1">
                Şehir
              </Text>
              <Text className="text-base">{otel.sehir || '-'}</Text>
            </div>

            <div>
              <Text className="text-sm font-medium text-gray-500 mb-1">
                Bölge
              </Text>
              <Text className="text-base">{otel.bolge || '-'}</Text>
            </div>

            <div className="md:col-span-2">
              <Text className="text-sm font-medium text-gray-500 mb-1">
                Adres
              </Text>
              <Text className="text-base">{otel.adres || '-'}</Text>
            </div>

            {(otel.enlem || otel.boylam) && (
              <div className="md:col-span-2">
                <Text className="text-sm font-medium text-gray-500 mb-1">
                  Koordinatlar
                </Text>
                <Text className="text-base text-gray-600 font-mono text-sm">
                  {otel.enlem}, {otel.boylam}
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* İletişim */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <Text className="text-lg font-semibold mb-4">İletişim Bilgileri</Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otel.telefon && (
              <div className="flex items-start gap-3">
                <PiPhoneBold className="h-5 w-5 text-gray-700 mt-0.5" />
                <div>
                  <Text className="text-sm font-medium text-gray-500 mb-1">
                    Telefon
                  </Text>
                  <Text className="text-base">{otel.telefon}</Text>
                </div>
              </div>
            )}

            {otel.email && (
              <div className="flex items-start gap-3">
                <PiEnvelopeBold className="h-5 w-5 text-gray-700 mt-0.5" />
                <div>
                  <Text className="text-sm font-medium text-gray-500 mb-1">
                    E-posta
                  </Text>
                  <Text className="text-base">{otel.email}</Text>
                </div>
              </div>
            )}

            {otel.web_site && (
              <div className="flex items-start gap-3">
                <PiGlobeBold className="h-5 w-5 text-gray-700 mt-0.5" />
                <div>
                  <Text className="text-sm font-medium text-gray-500 mb-1">
                    Web Sitesi
                  </Text>
                  <a
                    href={otel.web_site}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-blue-600 hover:underline"
                  >
                    {otel.web_site}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Otel Detayları */}
        {otel.detay && (
          <>
            {/* Açıklamalar */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <Text className="text-lg font-semibold mb-4">Açıklamalar</Text>
              <div className="space-y-4">
                {otel.detay.kisa_aciklama && (
                  <div>
                    <Text className="text-sm font-medium text-gray-500 mb-2">
                      Kısa Açıklama
                    </Text>
                    <Text className="text-base leading-relaxed">
                      {otel.detay.kisa_aciklama}
                    </Text>
                  </div>
                )}

                {otel.detay.uzun_aciklama && (
                  <div>
                    <Text className="text-sm font-medium text-gray-500 mb-2">
                      Detaylı Açıklama
                    </Text>
                    <Text className="text-base leading-relaxed">
                      {otel.detay.uzun_aciklama}
                    </Text>
                  </div>
                )}
              </div>
            </div>

            {/* Mesafeler ve Bilgiler */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <Text className="text-lg font-semibold mb-4">Mesafeler ve Bilgiler</Text>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otel.detay.denize_mesafe && (
                  <div>
                    <Text className="text-sm font-medium text-gray-500 mb-1">
                      Denize Mesafe
                    </Text>
                    <Text className="text-base">{otel.detay.denize_mesafe}</Text>
                  </div>
                )}

                {otel.detay.havalimani_mesafe && (
                  <div>
                    <Text className="text-sm font-medium text-gray-500 mb-1">
                      Havalimanı Mesafe
                    </Text>
                    <Text className="text-base">{otel.detay.havalimani_mesafe}</Text>
                  </div>
                )}

                {otel.detay.sehir_merkezi_mesafe && (
                  <div>
                    <Text className="text-sm font-medium text-gray-500 mb-1">
                      Şehir Merkezi Mesafe
                    </Text>
                    <Text className="text-base">
                      {otel.detay.sehir_merkezi_mesafe}
                    </Text>
                  </div>
                )}

                {otel.detay.oda_sayisi && (
                  <div>
                    <Text className="text-sm font-medium text-gray-500 mb-1">
                      Oda Sayısı
                    </Text>
                    <Text className="text-base font-semibold">
                      {otel.detay.oda_sayisi} Oda
                    </Text>
                  </div>
                )}

                {otel.detay.acilis_yili && (
                  <div>
                    <Text className="text-sm font-medium text-gray-500 mb-1">
                      Açılış Yılı
                    </Text>
                    <Text className="text-base">{otel.detay.acilis_yili}</Text>
                  </div>
                )}

                {otel.detay.renovasyon_yili && (
                  <div>
                    <Text className="text-sm font-medium text-gray-500 mb-1">
                      Renovasyon Yılı
                    </Text>
                    <Text className="text-base">{otel.detay.renovasyon_yili}</Text>
                  </div>
                )}

                {otel.detay.kat_sayisi && (
                  <div>
                    <Text className="text-sm font-medium text-gray-500 mb-1">
                      Kat Sayısı
                    </Text>
                    <Text className="text-base">{otel.detay.kat_sayisi}</Text>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Görseller */}
        {otel.gorseller && otel.gorseller.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">
              Görseller ({otel.gorseller.length})
            </Text>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otel.gorseller.map((gorsel: any) => (
                <div
                  key={gorsel.id}
                  className="aspect-video rounded-lg overflow-hidden border border-gray-200"
                >
                  <img
                    src={gorsel.gorsel_url}
                    alt={gorsel.baslik || 'Otel görseli'}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Oda Tipleri */}
        {otel.odaTipleri && otel.odaTipleri.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">
              Oda Tipleri ({otel.odaTipleri.length})
            </Text>
            <div className="space-y-4">
              {otel.odaTipleri.map((oda: any) => (
                <div
                  key={oda.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-gray-300"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Text className="font-semibold mb-1">{oda.ad}</Text>
                      {oda.aciklama && (
                        <Text className="text-sm text-gray-600 mb-2">
                          {oda.aciklama}
                        </Text>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span>👥 {oda.kapasite} Kişi</span>
                        {oda.metrekare && <span>📐 {oda.metrekare} m²</span>}
                        {oda.manzara && <span>🏖️ {oda.manzara}</span>}
                      </div>
                    </div>
                    {oda.fiyat && (
                      <div className="text-right">
                        <Text className="text-sm text-gray-500">Fiyat</Text>
                        <Text className="text-lg font-bold text-green-600">
                          {Number(oda.fiyat).toLocaleString('tr-TR')} ₺
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meta Bilgiler */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <Text className="text-lg font-semibold mb-4">Sistem Bilgileri</Text>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Text className="text-sm font-medium text-gray-500 mb-1">
                Otel ID
              </Text>
              <Text className="text-base font-mono">{otel.id}</Text>
            </div>

            <div>
              <Text className="text-sm font-medium text-gray-500 mb-1">
                Oluşturulma Tarihi
              </Text>
              <Text className="text-base">
                {new Date(otel.olusturma_tarihi).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </div>

            <div>
              <Text className="text-sm font-medium text-gray-500 mb-1">
                Son Güncelleme
              </Text>
              <Text className="text-base">
                {new Date(otel.guncelleme_tarihi).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </div>
          </div>
        </div>

        {/* Görseller - Sadece Gösterim */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <PiImageBold className="h-5 w-5 text-gray-700" />
            <Text className="text-lg font-semibold">Otel Görselleri</Text>
          </div>

          {otel.gorseller && otel.gorseller.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {otel.gorseller.map((gorsel: any, index: number) => (
                <div key={gorsel.id} className="relative">
                  <img
                    src={gorsel.gorsel_url}
                    alt={gorsel.baslik || `Görsel ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  {gorsel.baslik && (
                    <Text className="text-xs mt-1 line-clamp-1">{gorsel.baslik}</Text>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Henüz görsel eklenmemiş
            </div>
          )}
        </div>

        {/* Oda Tipleri - Sadece Gösterim */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <PiHouseLineBold className="h-5 w-5 text-gray-700" />
            <Text className="text-lg font-semibold">Oda Tipleri</Text>
          </div>

          {otel.odaTipleri && otel.odaTipleri.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {otel.odaTipleri.map((odaTipi: any) => (
                <div
                  key={odaTipi.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="mb-3">
                    <Text className="font-semibold text-base mb-1">
                      {odaTipi.ad}
                    </Text>
                    {odaTipi.fiyat && (
                      <Text className="text-sm text-green-600 font-medium">
                        {odaTipi.fiyat} TL / Gece
                      </Text>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <Text className="text-gray-500">Kapasite:</Text>
                      <Text className="font-medium">
                        {odaTipi.yetiskin_kapasite} Yetişkin
                        {odaTipi.cocuk_kapasite > 0 && `, ${odaTipi.cocuk_kapasite} Çocuk`}
                      </Text>
                    </div>
                    <div>
                      <Text className="text-gray-500">Oda Sayısı:</Text>
                      <Text className="font-medium">{odaTipi.oda_sayisi}</Text>
                    </div>
                    {odaTipi.metrekare && (
                      <div>
                        <Text className="text-gray-500">Metrekare:</Text>
                        <Text className="font-medium">{odaTipi.metrekare} m²</Text>
                      </div>
                    )}
                    {odaTipi.yatak_tipi && (
                      <div>
                        <Text className="text-gray-500">Yatak Tipi:</Text>
                        <Text className="font-medium">{odaTipi.yatak_tipi}</Text>
                      </div>
                    )}
                  </div>

                  {odaTipi.aciklama && (
                    <Text className="text-sm text-gray-600 mt-2">
                      {odaTipi.aciklama}
                    </Text>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Henüz oda tipi eklenmemiş
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

