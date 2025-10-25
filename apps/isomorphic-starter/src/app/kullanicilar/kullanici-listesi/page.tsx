'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Text, ActionIcon, Badge } from 'rizzui';
import { PiPlusBold, PiPencilBold, PiTrashBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import { getKullanicilar, deleteKullanici, Kullanici } from '@/services/kullanicilar.service';

export default function KullanicilarPage() {
  const [kullanicilar, setKullanicilar] = useState<Kullanici[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKullanicilar();
  }, []);

  const loadKullanicilar = async () => {
    try {
      setLoading(true);
      const data = await getKullanicilar();
      setKullanicilar(data);
    } catch (error) {
      toast.error('Kullanıcılar yüklenirken hata oluştu');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteKullanici(id);
        toast.success('Kullanıcı silindi');
        loadKullanicilar();
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
    }
  };

  const getKullaniciTipiRenk = (tip: string) => {
    switch (tip?.toLowerCase()) {
      case 'yonetici':
        return 'danger';
      case 'personel':
        return 'warning';
      case 'acente':
        return 'info';
      case 'musteri':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const getKullaniciTipiText = (tip: string) => {
    switch (tip?.toLowerCase()) {
      case 'yonetici':
        return 'Yönetici';
      case 'personel':
        return 'Personel';
      case 'acente':
        return 'Acente';
      case 'musteri':
        return 'Müşteri';
      default:
        return tip;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Text className="text-2xl font-bold">Kullanıcılar</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Tüm kullanıcıları görüntüleyin ve yönetin
          </Text>
        </div>
        <Button className="flex items-center gap-2">
          <PiPlusBold className="h-4 w-4" />
          Yeni Kullanıcı Ekle
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Ad Soyad
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Kullanıcı Adı
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  E-posta
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Telefon
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Kullanıcı Tipi
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Durum
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {kullanicilar.map((kullanici) => (
                <tr key={kullanici.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {kullanici.resim ? (
                        <img
                          src={kullanici.resim}
                          alt={`${kullanici.ad} ${kullanici.soyad}`}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <Text className="text-sm font-semibold text-gray-600">
                            {kullanici.ad.charAt(0)}{kullanici.soyad.charAt(0)}
                          </Text>
                        </div>
                      )}
                      <div>
                        <Text className="font-medium text-gray-900">
                          {kullanici.ad} {kullanici.soyad}
                        </Text>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="text-sm text-gray-600">
                      {kullanici.kullanici_adi}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="text-sm text-gray-600">
                      {kullanici.email}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="text-sm text-gray-600">
                      {kullanici.telefon || '-'}
                    </Text>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      variant="flat"
                      color={getKullaniciTipiRenk(kullanici.kullanici_tipi)}
                      className="font-medium"
                    >
                      {getKullaniciTipiText(kullanici.kullanici_tipi)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      variant="flat"
                      color={kullanici.durum === 1 ? 'success' : 'danger'}
                      className="font-medium"
                    >
                      {kullanici.durum === 1 ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/kullanicilar/kullanici-listesi/${kullanici.id}`}>
                        <ActionIcon
                          size="sm"
                          variant="outline"
                          title="Düzenle"
                        >
                          <PiPencilBold className="h-4 w-4" />
                        </ActionIcon>
                      </Link>
                      <ActionIcon
                        size="sm"
                        variant="outline"
                        color="danger"
                        onClick={() => handleDelete(kullanici.id)}
                        title="Sil"
                      >
                        <PiTrashBold className="h-4 w-4" />
                      </ActionIcon>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {kullanicilar.length === 0 && (
          <div className="py-20 text-center">
            <Text className="text-gray-500 mb-4">Henüz kullanıcı eklenmemiş</Text>
            <Button>İlk Kullanıcıyı Ekle</Button>
          </div>
        )}
      </div>
    </div>
  );
}

