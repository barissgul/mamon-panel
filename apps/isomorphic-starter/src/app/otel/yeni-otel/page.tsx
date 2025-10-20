'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Text, Textarea, Switch, Select } from 'rizzui';
import toast from 'react-hot-toast';
import { createOtel, CreateOtelDto } from '@/services/otel.service';
import {
  getAktifOtelOzellikler,
  OtelOzellik,
} from '@/services/otel-ozellik.service';

const yildizSecenekleri = [
  { value: '5', label: '5 Yıldız' },
  { value: '4', label: '4 Yıldız' },
  { value: '3', label: '3 Yıldız' },
  { value: '2', label: '2 Yıldız' },
  { value: '1', label: '1 Yıldız' },
];

export default function YeniOtelPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ozellikler, setOzellikler] = useState<OtelOzellik[]>([]);
  const [secilenOzellikler, setSecilenOzellikler] = useState<number[]>([]);
  const [formData, setFormData] = useState<CreateOtelDto>({
    ad: '',
    yildiz: 5,
    konsept: '',
    sehir: '',
    bolge: '',
    adres: '',
    telefon: '',
    email: '',
    web_site: '',
    check_in_time: '14:00',
    check_out_time: '12:00',
    min_fiyat: 0,
    kapak_gorseli: '',
    video_url: '',
    durum: 1,
    detay: {
      kisa_aciklama: '',
      uzun_aciklama: '',
      denize_mesafe: '',
      havalimani_mesafe: '',
      sehir_merkezi_mesafe: '',
      oda_sayisi: 0,
      acilis_yili: new Date().getFullYear(),
    },
  });

  useEffect(() => {
    loadOzellikler();
  }, []);

  const loadOzellikler = async () => {
    try {
      const data = await getAktifOtelOzellikler();
      setOzellikler(data);
    } catch (error) {
      console.error('Özellikler yüklenemedi:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSend = {
        ...formData,
        otelOzellikIds: secilenOzellikler,
      };
      await createOtel(dataToSend);
      toast.success('Otel başarıyla oluşturuldu');
      router.push('/otel/otel-listesi');
    } catch (error) {
      toast.error('Otel oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  const handleOzellikToggle = (ozellikId: number) => {
    setSecilenOzellikler(prev =>
      prev.includes(ozellikId)
        ? prev.filter(id => id !== ozellikId)
        : [...prev, ozellikId]
    );
  };

  return (
    <div className="@container">
      <div className="mb-6">
        <Text className="text-2xl font-bold">Yeni Otel Ekle</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Otel bilgilerini doldurun
        </Text>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          {/* Temel Bilgiler */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">Temel Bilgiler</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Otel Adı"
                placeholder="Örn: Voyage Kundu"
                value={formData.ad}
                onChange={(e) =>
                  setFormData({ ...formData, ad: e.target.value })
                }
                required
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Select
                label="Yıldız"
                value={formData.yildiz?.toString()}
                options={yildizSecenekleri}
                onChange={(value) =>
                  setFormData({ ...formData, yildiz: parseInt(value.value) })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Input
                label="Konsept"
                placeholder="Örn: Ultra Her Şey Dahil"
                value={formData.konsept}
                onChange={(e) =>
                  setFormData({ ...formData, konsept: e.target.value })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Input
                label="Minimum Fiyat (₺)"
                type="number"
                placeholder="0"
                value={formData.min_fiyat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_fiyat: parseFloat(e.target.value),
                  })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />
            </div>
          </div>

          {/* Lokasyon */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">Lokasyon</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Şehir"
                placeholder="Örn: Antalya"
                value={formData.sehir}
                onChange={(e) =>
                  setFormData({ ...formData, sehir: e.target.value })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Input
                label="Bölge"
                placeholder="Örn: Kundu"
                value={formData.bolge}
                onChange={(e) =>
                  setFormData({ ...formData, bolge: e.target.value })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <div className="md:col-span-2">
                <Textarea
                  label="Adres"
                  placeholder="Tam adres"
                  value={formData.adres}
                  onChange={(e) =>
                    setFormData({ ...formData, adres: e.target.value })
                  }
                  rows={3}
                  className="[&>label>span]:font-medium"
                />
              </div>
            </div>
          </div>

          {/* İletişim */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">İletişim</Text>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Telefon"
                placeholder="+90 242 000 00 00"
                value={formData.telefon}
                onChange={(e) =>
                  setFormData({ ...formData, telefon: e.target.value })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Input
                label="E-posta"
                type="email"
                placeholder="info@otel.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Input
                label="Web Sitesi"
                placeholder="https://otel.com"
                value={formData.web_site}
                onChange={(e) =>
                  setFormData({ ...formData, web_site: e.target.value })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />
            </div>
          </div>

          {/* Otel Detayları */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">Otel Detayları</Text>
            <div className="space-y-4">
              <Textarea
                label="Kısa Açıklama"
                placeholder="Otel hakkında kısa bilgi..."
                value={formData.detay?.kisa_aciklama}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    detay: {
                      ...formData.detay,
                      kisa_aciklama: e.target.value,
                    },
                  })
                }
                rows={2}
                className="[&>label>span]:font-medium"
              />

              <Textarea
                label="Uzun Açıklama"
                placeholder="Otel hakkında detaylı bilgi..."
                value={formData.detay?.uzun_aciklama}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    detay: {
                      ...formData.detay,
                      uzun_aciklama: e.target.value,
                    },
                  })
                }
                rows={5}
                className="[&>label>span]:font-medium"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Denize Mesafe"
                  placeholder="Örn: Denize Sıfır"
                  value={formData.detay?.denize_mesafe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detay: {
                        ...formData.detay,
                        denize_mesafe: e.target.value,
                      },
                    })
                  }
                  size="lg"
                  className="[&>label>span]:font-medium"
                />

                <Input
                  label="Havalimanı Mesafe"
                  placeholder="Örn: 15 km"
                  value={formData.detay?.havalimani_mesafe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detay: {
                        ...formData.detay,
                        havalimani_mesafe: e.target.value,
                      },
                    })
                  }
                  size="lg"
                  className="[&>label>span]:font-medium"
                />

                <Input
                  label="Şehir Merkezi Mesafe"
                  placeholder="Örn: 25 km"
                  value={formData.detay?.sehir_merkezi_mesafe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detay: {
                        ...formData.detay,
                        sehir_merkezi_mesafe: e.target.value,
                      },
                    })
                  }
                  size="lg"
                  className="[&>label>span]:font-medium"
                />

                <Input
                  label="Oda Sayısı"
                  type="number"
                  placeholder="0"
                  value={formData.detay?.oda_sayisi}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detay: {
                        ...formData.detay,
                        oda_sayisi: parseInt(e.target.value),
                      },
                    })
                  }
                  size="lg"
                  className="[&>label>span]:font-medium"
                />

                <Input
                  label="Açılış Yılı"
                  type="number"
                  placeholder="2020"
                  value={formData.detay?.acilis_yili}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      detay: {
                        ...formData.detay,
                        acilis_yili: parseInt(e.target.value),
                      },
                    })
                  }
                  size="lg"
                  className="[&>label>span]:font-medium"
                />

                <div className="flex items-center gap-3 pt-8">
                  <Switch
                    checked={formData.durum === 1}
                    onChange={(checked) =>
                      setFormData({ ...formData, durum: checked ? 1 : 0 })
                    }
                  />
                  <div>
                    <Text className="text-sm font-medium">Durum</Text>
                    <Text className="text-xs text-gray-500">
                      {formData.durum === 1 ? 'Aktif' : 'Pasif'}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Otel Özellikleri */}
          {ozellikler.length > 0 && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <Text className="text-lg font-semibold mb-4">
                Otel Özellikleri
              </Text>
              <Text className="text-sm text-gray-500 mb-4">
                Otelde bulunan özellikleri seçin
              </Text>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {ozellikler.map((ozellik) => (
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
              className="min-w-[120px]"
            >
              İptal
            </Button>
            <Button
              type="submit"
              isLoading={loading}
              disabled={loading}
              size="lg"
              className="min-w-[120px]"
            >
              Oluştur
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

