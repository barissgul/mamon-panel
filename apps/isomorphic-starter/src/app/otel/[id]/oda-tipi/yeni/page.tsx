'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, Text, Textarea } from 'rizzui';
import toast from 'react-hot-toast';
import {
  createOdaTipi,
  CreateOdaTipiDto,
} from '@/services/oda-tipi.service';
import {
  getAktifOtelOdaOzellikler,
  OtelOdaOzellik,
} from '@/services/otel-oda-ozellik.service';

export default function YeniOdaTipiPage() {
  const router = useRouter();
  const params = useParams();
  const otelId = parseInt(params.id as string);

  const [loading, setLoading] = useState(false);
  const [odaOzellikleri, setOdaOzellikleri] = useState<OtelOdaOzellik[]>([]);
  const [secilenOzellikler, setSecilenOzellikler] = useState<number[]>([]);
  const [formData, setFormData] = useState<CreateOdaTipiDto>({
    otel_id: otelId,
    ad: '',
    kapasite: 2,
    yetiskin_kapasite: 2,
    cocuk_kapasite: 0,
    oda_sayisi: 1,
    metrekare: 0,
    yatak_tipi: '',
    manzara: '',
    fiyat: 0,
    aciklama: '',
    durum: 1,
  });

  useEffect(() => {
    loadOdaOzellikleri();
  }, []);

  const loadOdaOzellikleri = async () => {
    try {
      const data = await getAktifOtelOdaOzellikler();
      setOdaOzellikleri(data);
    } catch (error) {
      console.error('Oda özellikleri yüklenemedi:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSend = {
        ...formData,
        odaOzellikIds: secilenOzellikler,
      };
      await createOdaTipi(dataToSend);
      toast.success('Oda tipi başarıyla oluşturuldu');
      router.push(`/otel/${otelId}`);
    } catch (error) {
      toast.error('Oda tipi oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleOzellikToggle = (ozellikId: number) => {
    setSecilenOzellikler((prev) =>
      prev.includes(ozellikId)
        ? prev.filter((id) => id !== ozellikId)
        : [...prev, ozellikId]
    );
  };

  return (
    <div className="@container">
      <div className="mb-6">
        <Text className="text-2xl font-bold">Yeni Oda Tipi Ekle</Text>
        <Text className="text-gray-500 mt-1">
          Otele yeni oda tipi ekleyin
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temel Bilgiler */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <Text className="text-lg font-semibold mb-4">Temel Bilgiler</Text>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">
                <Text className="text-sm font-medium">Oda Tipi Adı*</Text>
              </label>
              <Input
                size="lg"
                required
                value={formData.ad}
                onChange={(e) =>
                  setFormData({ ...formData, ad: e.target.value })
                }
                placeholder="Örn: Standart Oda, Süit Oda"
              />
            </div>

            <div>
              <label className="block mb-2">
                <Text className="text-sm font-medium">Oda Sayısı*</Text>
              </label>
              <Input
                size="lg"
                type="number"
                required
                min={1}
                value={formData.oda_sayisi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    oda_sayisi: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block mb-2">
                <Text className="text-sm font-medium">Yetişkin Kapasitesi*</Text>
              </label>
              <Input
                size="lg"
                type="number"
                required
                min={1}
                value={formData.yetiskin_kapasite}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    yetiskin_kapasite: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block mb-2">
                <Text className="text-sm font-medium">Çocuk Kapasitesi</Text>
              </label>
              <Input
                size="lg"
                type="number"
                min={0}
                value={formData.cocuk_kapasite}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cocuk_kapasite: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block mb-2">
                <Text className="text-sm font-medium">Metrekare (m²)</Text>
              </label>
              <Input
                size="lg"
                type="number"
                min={0}
                value={formData.metrekare}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    metrekare: parseInt(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block mb-2">
                <Text className="text-sm font-medium">Fiyat (TL/Gece)</Text>
              </label>
              <Input
                size="lg"
                type="number"
                min={0}
                step="0.01"
                value={formData.fiyat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fiyat: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div>
              <label className="block mb-2">
                <Text className="text-sm font-medium">Yatak Tipi</Text>
              </label>
              <Input
                size="lg"
                value={formData.yatak_tipi}
                onChange={(e) =>
                  setFormData({ ...formData, yatak_tipi: e.target.value })
                }
                placeholder="Örn: 2 Tek Kişilik, 1 Çift Kişilik"
              />
            </div>

            <div>
              <label className="block mb-2">
                <Text className="text-sm font-medium">Manzara</Text>
              </label>
              <Input
                size="lg"
                value={formData.manzara}
                onChange={(e) =>
                  setFormData({ ...formData, manzara: e.target.value })
                }
                placeholder="Örn: Deniz Manzarası, Bahçe Manzarası"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-2">
              <Text className="text-sm font-medium">Açıklama</Text>
            </label>
            <Textarea
              rows={4}
              value={formData.aciklama}
              onChange={(e) =>
                setFormData({ ...formData, aciklama: e.target.value })
              }
              placeholder="Oda tipi hakkında detaylı bilgi"
            />
          </div>
        </div>

        {/* Oda Özellikleri */}
        {odaOzellikleri.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">Oda Özellikleri</Text>
            <Text className="text-sm text-gray-500 mb-4">
              Bu oda tipinde bulunan özellikleri seçin
            </Text>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {odaOzellikleri.map((ozellik) => (
                <label
                  key={ozellik.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    secilenOzellikler.includes(ozellik.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={secilenOzellikler.includes(ozellik.id)}
                    onChange={() => handleOzellikToggle(ozellik.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <Text className="text-sm font-medium">
                      {ozellik.baslik}
                    </Text>
                    {ozellik.aciklama && (
                      <Text className="text-xs text-gray-500 line-clamp-1">
                        {ozellik.aciklama}
                      </Text>
                    )}
                  </div>
                </label>
              ))}
            </div>
            <Text className="text-xs text-gray-500 mt-3">
              {secilenOzellikler.length} özellik seçildi
            </Text>
          </div>
        )}

        {/* İşlem Butonları */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            size="lg"
            disabled={loading}
          >
            İptal
          </Button>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? 'Oluşturuluyor...' : 'Oda Tipi Oluştur'}
          </Button>
        </div>
      </form>
    </div>
  );
}

