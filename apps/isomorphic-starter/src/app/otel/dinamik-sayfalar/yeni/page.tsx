'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Text, Textarea, Switch } from 'rizzui';
import toast from 'react-hot-toast';
import {
  createDinamikSayfa,
  CreateDinamikSayfaDto,
} from '@/services/dinamik-sayfalar.service';

export default function YeniDinamikSayfaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDinamikSayfaDto>({
    baslik: '',
    slug: '',
    aciklama: '',
    filtre_kriterleri: {},
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    kapak_gorseli: '',
    sira: 0,
    durum: 1,
    ust_icerik: '',
    alt_icerik: '',
  });

  // Filtre State'leri
  const [bolgeler, setBolgeler] = useState<string>('');
  const [konseptler, setKonseptler] = useState<string>('');
  const [yildizlar, setYildizlar] = useState<number[]>([]);
  const [minFiyat, setMinFiyat] = useState<string>('');
  const [maxFiyat, setMaxFiyat] = useState<string>('');

  // Başlıktan otomatik slug oluştur
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleBaslikChange = (value: string) => {
    setFormData({
      ...formData,
      baslik: value,
      slug: slugify(value),
    });
  };

  const handleYildizToggle = (yildiz: number) => {
    setYildizlar((prev) =>
      prev.includes(yildiz)
        ? prev.filter((y) => y !== yildiz)
        : [...prev, yildiz]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filtreleri hazırla
    const filtre_kriterleri: any = {};

    if (bolgeler.trim()) {
      filtre_kriterleri.bolgeler = bolgeler
        .split(',')
        .map((b) => b.trim())
        .filter((b) => b);
    }

    if (konseptler.trim()) {
      filtre_kriterleri.konseptler = konseptler
        .split(',')
        .map((k) => k.trim())
        .filter((k) => k);
    }

    if (yildizlar.length > 0) {
      filtre_kriterleri.yildiz = yildizlar;
    }

    if (minFiyat) {
      filtre_kriterleri.min_fiyat = parseFloat(minFiyat);
    }

    if (maxFiyat) {
      filtre_kriterleri.max_fiyat = parseFloat(maxFiyat);
    }

    try {
      setLoading(true);
      await createDinamikSayfa({
        ...formData,
        filtre_kriterleri,
      });
      toast.success('Dinamik sayfa başarıyla oluşturuldu');
      router.push('/otel/dinamik-sayfalar');
    } catch (error: any) {
      toast.error(error.message || 'Sayfa oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="@container">
      <div className="mb-6">
        <Text className="text-2xl font-bold">Yeni Dinamik Sayfa</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Filtreli otel listeleme sayfası oluşturun
        </Text>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          {/* Temel Bilgiler */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">Temel Bilgiler</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Sayfa Başlığı"
                placeholder="Örn: Akdeniz Otelleri"
                value={formData.baslik}
                onChange={(e) => handleBaslikChange(e.target.value)}
                required
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Input
                label="URL Slug"
                placeholder="akdeniz-otelleri"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <div className="md:col-span-2">
                <Textarea
                  label="Açıklama"
                  placeholder="Sayfa açıklaması..."
                  value={formData.aciklama}
                  onChange={(e) =>
                    setFormData({ ...formData, aciklama: e.target.value })
                  }
                  rows={2}
                  className="[&>label>span]:font-medium"
                />
              </div>

              <Input
                label="Sıra"
                type="number"
                placeholder="0"
                value={formData.sira}
                onChange={(e) =>
                  setFormData({ ...formData, sira: parseInt(e.target.value) })
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

          {/* Filtre Kriterleri */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">Filtre Kriterleri</Text>
            <div className="space-y-4">
              <Input
                label="Bölgeler (virgülle ayırın)"
                placeholder="Antalya, Muğla, İzmir"
                value={bolgeler}
                onChange={(e) => setBolgeler(e.target.value)}
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Input
                label="Konseptler (virgülle ayırın)"
                placeholder="Her Şey Dahil, Ultra Her Şey Dahil"
                value={konseptler}
                onChange={(e) => setKonseptler(e.target.value)}
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <div>
                <Text className="text-sm font-medium mb-2">Yıldız</Text>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((yildiz) => (
                    <label
                      key={yildiz}
                      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                        yildizlar.includes(yildiz)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={yildizlar.includes(yildiz)}
                        onChange={() => handleYildizToggle(yildiz)}
                        className="h-4 w-4"
                      />
                      <Text className="text-sm font-medium">
                        {yildiz} ⭐
                      </Text>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Minimum Fiyat (₺)"
                  type="number"
                  placeholder="1000"
                  value={minFiyat}
                  onChange={(e) => setMinFiyat(e.target.value)}
                  size="lg"
                  className="[&>label>span]:font-medium"
                />

                <Input
                  label="Maximum Fiyat (₺)"
                  type="number"
                  placeholder="5000"
                  value={maxFiyat}
                  onChange={(e) => setMaxFiyat(e.target.value)}
                  size="lg"
                  className="[&>label>span]:font-medium"
                />
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">SEO Ayarları</Text>
            <div className="space-y-4">
              <Input
                label="Meta Title"
                placeholder="Akdeniz Otelleri - En İyi Fiyatlar"
                value={formData.meta_title}
                onChange={(e) =>
                  setFormData({ ...formData, meta_title: e.target.value })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Textarea
                label="Meta Description"
                placeholder="Akdeniz bölgesindeki en iyi otellerde tatil fırsatları..."
                value={formData.meta_description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    meta_description: e.target.value,
                  })
                }
                rows={2}
                className="[&>label>span]:font-medium"
              />

              <Input
                label="Meta Keywords"
                placeholder="akdeniz, otel, tatil"
                value={formData.meta_keywords}
                onChange={(e) =>
                  setFormData({ ...formData, meta_keywords: e.target.value })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />
            </div>
          </div>

          {/* İçerik */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">Sayfa İçeriği</Text>
            <div className="space-y-4">
              <Input
                label="Kapak Görseli URL"
                placeholder="https://..."
                value={formData.kapak_gorseli}
                onChange={(e) =>
                  setFormData({ ...formData, kapak_gorseli: e.target.value })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Textarea
                label="Üst İçerik (HTML)"
                placeholder="Sayfa başında gösterilecek içerik..."
                value={formData.ust_icerik}
                onChange={(e) =>
                  setFormData({ ...formData, ust_icerik: e.target.value })
                }
                rows={4}
                className="[&>label>span]:font-medium"
              />

              <Textarea
                label="Alt İçerik (HTML)"
                placeholder="Sayfa sonunda gösterilecek içerik..."
                value={formData.alt_icerik}
                onChange={(e) =>
                  setFormData({ ...formData, alt_icerik: e.target.value })
                }
                rows={4}
                className="[&>label>span]:font-medium"
              />
            </div>
          </div>

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

