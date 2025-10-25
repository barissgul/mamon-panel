'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Text, Input, Select, Badge, type SelectOption } from 'rizzui';
import { PiArrowLeftBold, PiFloppyDiskBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import { getKullanici, updateKullanici, Kullanici } from '@/services/kullanicilar.service';

const kullaniciTipleriOptions = [
  { value: 'yonetici', label: 'Yönetici' },
  { value: 'personel', label: 'Personel' },
  { value: 'acente', label: 'Acente' },
  { value: 'musteri', label: 'Müşteri' },
];

const durumOptions = [
  { value: 1, label: 'Aktif' },
  { value: 0, label: 'Pasif' },
];


export default function KullaniciDuzenlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [kullanici, setKullanici] = useState<Kullanici | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    ad: '',
    soyad: '',
    email: '',
    kullanici_adi: '',
    telefon: '',
    kullanici_tipi: '',
    durum: 1,
    sifre: '',
  });

  useEffect(() => {
    if (id) {
      loadKullanici();
    }
  }, [id]);

  const loadKullanici = async () => {
    try {
      setLoading(true);
      const data = await getKullanici(Number(id));
      setKullanici(data);
      setFormData({
        ad: data.ad,
        soyad: data.soyad,
        email: data.email,
        kullanici_adi: data.kullanici_adi,
        telefon: data.telefon || '',
        kullanici_tipi: data.kullanici_tipi,
        durum: data.durum,
        sifre: '', // Şifre boş bırakılır, değiştirilmek istenirse doldurulur
      });
    } catch (error) {
      toast.error('Kullanıcı bilgileri yüklenemedi');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      // Şifre boşsa güncelleme verisinden çıkar
      const updateData: any = { ...formData };
      if (!updateData.sifre) {
        delete updateData.sifre;
      }
      
      await updateKullanici(Number(id), updateData);
      toast.success('Kullanıcı güncellendi');
      router.push('/kullanicilar/kullanici-listesi');
    } catch (error: any) {
      toast.error(error.message || 'Güncelleme başarısız');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  if (!kullanici) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Text className="text-xl mb-4">Kullanıcı bulunamadı</Text>
          <Button onClick={() => router.push('/kullanicilar/kullanici-listesi')}>
            Listeye Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/kullanicilar/kullanici-listesi')}
          >
            <PiArrowLeftBold className="h-4 w-4 mr-2" />
            Geri
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <Text className="text-2xl font-bold">Kullanıcı Düzenle</Text>
              <Badge
                variant="flat"
                color={
                  kullanici.kullanici_tipi?.toLowerCase() === 'yonetici'
                    ? 'danger'
                    : kullanici.kullanici_tipi?.toLowerCase() === 'personel'
                    ? 'warning'
                    : kullanici.kullanici_tipi?.toLowerCase() === 'acente'
                    ? 'info'
                    : 'success'
                }
              >
                {kullanici.kullanici_tipi?.toLowerCase() === 'yonetici'
                  ? 'Yönetici'
                  : kullanici.kullanici_tipi?.toLowerCase() === 'personel'
                  ? 'Personel'
                  : kullanici.kullanici_tipi?.toLowerCase() === 'acente'
                  ? 'Acente'
                  : 'Müşteri'}
              </Badge>
              <Badge
                variant="flat"
                color={kullanici.durum === 1 ? 'success' : 'danger'}
              >
                {kullanici.durum === 1 ? 'Aktif' : 'Pasif'}
              </Badge>
            </div>
            <Text className="text-sm text-gray-500 mt-1">
              {kullanici.ad} {kullanici.soyad} - {kullanici.email}
            </Text>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad *
              </label>
              <Input
                type="text"
                value={formData.ad}
                onChange={(e) => handleChange('ad', e.target.value)}
                placeholder="Ad"
                required
              />
            </div>

            {/* Soyad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Soyad *
              </label>
              <Input
                type="text"
                value={formData.soyad}
                onChange={(e) => handleChange('soyad', e.target.value)}
                placeholder="Soyad"
                required
              />
            </div>

            {/* Kullanıcı Adı */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Adı *
              </label>
              <Input
                type="text"
                value={formData.kullanici_adi}
                onChange={(e) => handleChange('kullanici_adi', e.target.value)}
                placeholder="Kullanıcı Adı"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-posta *
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="E-posta"
                required
              />
            </div>

            {/* Telefon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <Input
                type="text"
                value={formData.telefon}
                onChange={(e) => handleChange('telefon', e.target.value)}
                placeholder="Telefon"
              />
            </div>

            {/* Kullanıcı Tipi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kullanıcı Tipi *
              </label>
              <Select
                value={kullaniciTipleriOptions.find(opt => opt.value === formData.kullanici_tipi)}
                options={kullaniciTipleriOptions}
                onChange={(option: SelectOption) => handleChange('kullanici_tipi', option.value)}
                size="lg"
                className="[&>label>span]:font-medium"
              />
            </div>

            {/* Durum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durum *
              </label>
              <Select
                value={durumOptions.find(opt => opt.value === formData.durum)}
                options={durumOptions}
                onChange={(option: SelectOption) => handleChange('durum', option.value)}
                size="lg"
                className="[&>label>span]:font-medium"
              />
            </div>

            {/* Şifre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yeni Şifre
              </label>
              <Input
                type="password"
                value={formData.sifre}
                onChange={(e) => handleChange('sifre', e.target.value)}
                placeholder="Şifre değiştirmek için doldurun"
              />
              <Text className="text-xs text-gray-500 mt-1">
                * Şifreyi değiştirmek istemiyorsanız boş bırakın
              </Text>
            </div>
          </div>

          {/* Kayıt Bilgileri */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Text className="text-sm text-gray-500">Oluşturma Tarihi</Text>
                <Text className="text-sm font-medium">
                  {new Date(kullanici.olusturma_tarihi).toLocaleString('tr-TR')}
                </Text>
              </div>
              <div>
                <Text className="text-sm text-gray-500">Güncelleme Tarihi</Text>
                <Text className="text-sm font-medium">
                  {new Date(kullanici.guncelleme_tarihi).toLocaleString('tr-TR')}
                </Text>
              </div>
            </div>
          </div>

          {/* Butonlar */}
          <div className="mt-8 flex items-center gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2"
            >
              <PiFloppyDiskBold className="h-4 w-4" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/kullanicilar/kullanici-listesi')}
            >
              İptal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

