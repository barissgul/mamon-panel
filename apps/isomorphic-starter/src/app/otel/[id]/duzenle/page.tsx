'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, Text, Textarea, Switch, Select } from 'rizzui';
import toast from 'react-hot-toast';
import { getOtel, updateOtel, UpdateOtelDto, Otel } from '@/services/otel.service';
import {
  getAktifOtelOzellikler,
  OtelOzellik,
} from '@/services/otel-ozellik.service';
import { getAuthHeaders } from '@/services/api.config';
import {
  generateMultipleOtelContent,
  generateOtelContent,
  improveText,
  ContentType,
} from '@/services/ai.service';
import { PiSparkle, PiMagicWandBold } from 'react-icons/pi';

const yildizSecenekleri = [
  { value: '5', label: '5 Yıldız' },
  { value: '4', label: '4 Yıldız' },
  { value: '3', label: '3 Yıldız' },
  { value: '2', label: '2 Yıldız' },
  { value: '1', label: '1 Yıldız' },
];

export default function OtelDuzenlePage() {
  const router = useRouter();
  const params = useParams();
  const otelId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [ozellikler, setOzellikler] = useState<OtelOzellik[]>([]);
  const [secilenOzellikler, setSecilenOzellikler] = useState<number[]>([]);
  const [gorseller, setGorseller] = useState<any[]>([]);
  const [formData, setFormData] = useState<UpdateOtelDto>({
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
    detay: {},
  });

  useEffect(() => {
    loadOzellikler();
    loadOtel();
  }, [otelId]);

  const loadOzellikler = async () => {
    try {
      const data = await getAktifOtelOzellikler();
      setOzellikler(data);
    } catch (error) {
      console.error('Özellikler yüklenemedi:', error);
    }
  };

  const loadOtel = async () => {
    try {
      setDataLoading(true);
      const otel = await getOtel(parseInt(otelId));
      setFormData({
        ad: otel.ad,
        yildiz: otel.yildiz,
        konsept: otel.konsept || '',
        sehir: otel.sehir || '',
        bolge: otel.bolge || '',
        adres: otel.adres || '',
        telefon: otel.telefon || '',
        email: otel.email || '',
        web_site: otel.web_site || '',
        check_in_time: otel.check_in_time,
        check_out_time: otel.check_out_time,
        min_fiyat: otel.min_fiyat || 0,
        kapak_gorseli: otel.kapak_gorseli || '',
        video_url: otel.video_url || '',
        durum: otel.durum,
        detay: {
          kisa_aciklama: otel.detay?.kisa_aciklama || '',
          uzun_aciklama: otel.detay?.uzun_aciklama || '',
          denize_mesafe: otel.detay?.denize_mesafe || '',
          havalimani_mesafe: otel.detay?.havalimani_mesafe || '',
          sehir_merkezi_mesafe: otel.detay?.sehir_merkezi_mesafe || '',
          oda_sayisi: otel.detay?.oda_sayisi || 0,
          acilis_yili: otel.detay?.acilis_yili || new Date().getFullYear(),
        },
      });
      setGorseller(otel.gorseller || []);
      
      // Seçili özellikleri ayarla
      if (otel.otelOzellikleri && otel.otelOzellikleri.length > 0) {
        setSecilenOzellikler(otel.otelOzellikleri.map((oz: any) => oz.id));
      }
    } catch (error) {
      toast.error('Otel yüklenirken hata oluştu');
    } finally {
      setDataLoading(false);
    }
  };

  const handleOzellikToggle = (ozellikId: number) => {
    setSecilenOzellikler(prev =>
      prev.includes(ozellikId)
        ? prev.filter(id => id !== ozellikId)
        : [...prev, ozellikId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const dataToSend = {
        ...formData,
        otelOzellikIds: secilenOzellikler,
      };
      await updateOtel(parseInt(otelId), dataToSend);
      toast.success('Otel başarıyla güncellendi');
      router.push('/otel/otel-listesi');
    } catch (error) {
      toast.error('Otel güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  // AI ile kısa açıklama oluştur
  const handleGenerateKisaAciklama = async () => {
    if (!formData.ad) {
      toast.error('Lütfen önce otel adını girin');
      return;
    }

    try {
      setAiLoading(true);
      toast.loading('AI içerik oluşturuluyor...', { id: 'ai-loading' });
      
      const content = await generateOtelContent({
        otelAdi: formData.ad,
        yildiz: formData.yildiz || 5,
        konsept: formData.konsept,
        sehir: formData.sehir,
        bolge: formData.bolge,
        contentType: ContentType.KISA_ACIKLAMA,
      });

      setFormData({
        ...formData,
        detay: {
          ...formData.detay,
          kisa_aciklama: content,
        },
      });

      toast.success('Kısa açıklama AI ile oluşturuldu!', { id: 'ai-loading' });
    } catch (error) {
      toast.error('AI içerik oluşturulamadı', { id: 'ai-loading' });
    } finally {
      setAiLoading(false);
    }
  };

  // AI ile uzun açıklama oluştur
  const handleGenerateUzunAciklama = async () => {
    if (!formData.ad) {
      toast.error('Lütfen önce otel adını girin');
      return;
    }

    try {
      setAiLoading(true);
      toast.loading('AI içerik oluşturuluyor...', { id: 'ai-loading' });
      
      const content = await generateOtelContent({
        otelAdi: formData.ad,
        yildiz: formData.yildiz || 5,
        konsept: formData.konsept,
        sehir: formData.sehir,
        bolge: formData.bolge,
        contentType: ContentType.UZUN_ACIKLAMA,
      });

      setFormData({
        ...formData,
        detay: {
          ...formData.detay,
          uzun_aciklama: content,
        },
      });

      toast.success('Uzun açıklama AI ile oluşturuldu!', { id: 'ai-loading' });
    } catch (error) {
      toast.error('AI içerik oluşturulamadı', { id: 'ai-loading' });
    } finally {
      setAiLoading(false);
    }
  };

  // AI ile her iki açıklamayı da oluştur
  const handleGenerateAllDescriptions = async () => {
    if (!formData.ad) {
      toast.error('Lütfen önce otel adını girin');
      return;
    }

    try {
      setAiLoading(true);
      toast.loading('AI içerikler oluşturuluyor...', { id: 'ai-loading' });
      
      const { kisaAciklama, uzunAciklama } = await generateMultipleOtelContent({
        otelAdi: formData.ad,
        yildiz: formData.yildiz || 5,
        konsept: formData.konsept,
        sehir: formData.sehir,
        bolge: formData.bolge,
      });

      setFormData({
        ...formData,
        detay: {
          ...formData.detay,
          kisa_aciklama: kisaAciklama,
          uzun_aciklama: uzunAciklama,
        },
      });

      toast.success('Tüm açıklamalar AI ile oluşturuldu!', { id: 'ai-loading' });
    } catch (error) {
      toast.error('AI içerik oluşturulamadı', { id: 'ai-loading' });
    } finally {
      setAiLoading(false);
    }
  };

  // Mevcut metni AI ile iyileştir
  const handleImproveKisaAciklama = async () => {
    const currentText = formData.detay?.kisa_aciklama;
    if (!currentText || currentText.trim() === '') {
      toast.error('İyileştirilecek metin bulunamadı');
      return;
    }

    try {
      setAiLoading(true);
      toast.loading('Metin iyileştiriliyor...', { id: 'ai-loading' });
      
      const improvedText = await improveText(
        currentText,
        'daha çekici ve satış odaklı'
      );

      setFormData({
        ...formData,
        detay: {
          ...formData.detay,
          kisa_aciklama: improvedText,
        },
      });

      toast.success('Metin iyileştirildi!', { id: 'ai-loading' });
    } catch (error) {
      toast.error('Metin iyileştirilemedi', { id: 'ai-loading' });
    } finally {
      setAiLoading(false);
    }
  };

  // Uzun açıklamayı iyileştir
  const handleImproveUzunAciklama = async () => {
    const currentText = formData.detay?.uzun_aciklama;
    if (!currentText || currentText.trim() === '') {
      toast.error('İyileştirilecek metin bulunamadı');
      return;
    }

    try {
      setAiLoading(true);
      toast.loading('Metin iyileştiriliyor...', { id: 'ai-loading' });
      
      const improvedText = await improveText(
        currentText,
        'daha profesyonel, detaylı ve SEO uyumlu'
      );

      setFormData({
        ...formData,
        detay: {
          ...formData.detay,
          uzun_aciklama: improvedText,
        },
      });

      toast.success('Metin iyileştirildi!', { id: 'ai-loading' });
    } catch (error) {
      toast.error('Metin iyileştirilemedi', { id: 'ai-loading' });
    } finally {
      setAiLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="mb-6">
        <Text className="text-2xl font-bold">Otel Düzenle</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Otel bilgilerini güncelleyin
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
                  setFormData({ ...formData, yildiz: parseInt((value as any).value) })
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
            <div className="flex items-center justify-between mb-4">
              <Text className="text-lg font-semibold">Otel Detayları</Text>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleGenerateAllDescriptions}
                disabled={aiLoading || !formData.ad}
                className="flex items-center gap-2"
              >
                <PiSparkle className="h-4 w-4" />
                Tüm Açıklamaları AI ile Oluştur
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Kısa Açıklama</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="flat"
                      onClick={handleGenerateKisaAciklama}
                      disabled={aiLoading || !formData.ad}
                      className="flex items-center gap-1 text-xs"
                    >
                      <PiSparkle className="h-3 w-3" />
                      AI ile Oluştur
                    </Button>
                    {formData.detay?.kisa_aciklama && (
                      <Button
                        type="button"
                        size="sm"
                        variant="flat"
                        onClick={handleImproveKisaAciklama}
                        disabled={aiLoading}
                        className="flex items-center gap-1 text-xs"
                      >
                        <PiMagicWandBold className="h-3 w-3" />
                        İyileştir
                      </Button>
                    )}
                  </div>
                </div>
                <Textarea
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
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Uzun Açıklama</label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="flat"
                      onClick={handleGenerateUzunAciklama}
                      disabled={aiLoading || !formData.ad}
                      className="flex items-center gap-1 text-xs"
                    >
                      <PiSparkle className="h-3 w-3" />
                      AI ile Oluştur
                    </Button>
                    {formData.detay?.uzun_aciklama && (
                      <Button
                        type="button"
                        size="sm"
                        variant="flat"
                        onClick={handleImproveUzunAciklama}
                        disabled={aiLoading}
                        className="flex items-center gap-1 text-xs"
                      >
                        <PiMagicWandBold className="h-3 w-3" />
                        İyileştir
                      </Button>
                    )}
                  </div>
                </div>
                <Textarea
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
                  rows={6}
                />
              </div>

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

          {/* Görsel Yönetimi */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <Text className="text-lg font-semibold">Otel Görselleri</Text>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  id="gorsel-upload"
                  className="hidden"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;

                    setLoading(true);
                    try {
                      const authHeaders = await getAuthHeaders();
                      
                      for (const file of Array.from(files)) {
                        const formData = new FormData();
                        formData.append('file', file);

                        const response = await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/otel/${otelId}/upload-gorsel`,
                          {
                            method: 'POST',
                            headers: authHeaders,
                            body: formData,
                          }
                        );

                        if (!response.ok) {
                          throw new Error('Görsel yüklenemedi');
                        }
                      }
                      toast.success('Görseller başarıyla yüklendi');
                      window.location.reload();
                    } catch (error) {
                      toast.error('Görsel yükleme hatası');
                    } finally {
                      setLoading(false);
                    }
                  }}
                />
                <label htmlFor="gorsel-upload">
                  <Button
                    type="button"
                    size="sm"
                    as="span"
                    disabled={loading}
                  >
                    {loading ? 'Yükleniyor...' : 'Görsel Seç'}
                  </Button>
                </label>
              </div>
            </div>
            
            <Text className="text-sm text-gray-500 mb-4">
              Birden fazla görsel seçebilirsiniz. Maksimum dosya boyutu: 5MB
            </Text>

            {gorseller && gorseller.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gorseller.map((gorsel: any, index: number) => (
                  <div key={gorsel.id} className="relative group">
                    <img
                      src={gorsel.gorsel_url}
                      alt={gorsel.baslik || `Görsel ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button
                        type="button"
                        size="sm"
                        variant="flat"
                        color="danger"
                        onClick={async () => {
                          if (confirm('Bu görseli silmek istediğinizden emin misiniz?')) {
                            try {
                              const authHeaders = await getAuthHeaders();
                              await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/otel/gorsel/${gorsel.id}`, {
                                method: 'DELETE',
                                headers: authHeaders,
                              });
                              window.location.reload();
                            } catch (err) {
                              toast.error('Görsel silinemedi');
                            }
                          }
                        }}
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Henüz görsel eklenmemiş
              </div>
            )}
          </div>

          {/* Oda Tipi Yönetimi */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <Text className="text-lg font-semibold">Oda Tipleri</Text>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/otel/${otelId}`)}
                >
                  Oda Tiplerini Görüntüle
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => router.push(`/otel/${otelId}/oda-tipi/yeni`)}
                >
                  Yeni Oda Tipi Ekle
                </Button>
              </div>
            </div>
            <Text className="text-sm text-gray-500">
              Oda tiplerini yönetmek için yukarıdaki butonları kullanın
            </Text>
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
              Güncelle
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

