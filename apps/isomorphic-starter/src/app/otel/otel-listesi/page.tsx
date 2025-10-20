'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Text, ActionIcon, Badge } from 'rizzui';
import { PiPlusBold, PiPencilBold, PiTrashBold, PiEyeBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import { getOteller, deleteOtel, Otel } from '@/services/otel.service';

export default function OtelListesiPage() {
  const [oteller, setOteller] = useState<Otel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOteller();
  }, []);

  const loadOteller = async () => {
    try {
      setLoading(true);
      const data = await getOteller();
      setOteller(data);
    } catch (error) {
      toast.error('Oteller yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu oteli silmek istediğinizden emin misiniz?')) {
      try {
        await deleteOtel(id);
        toast.success('Otel silindi');
        loadOteller();
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
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

  return (
    <div className="@container">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Text className="text-2xl font-bold">Oteller</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Tüm otelleri görüntüleyin ve yönetin
          </Text>
        </div>
        <Link href="/otel/yeni-otel">
          <Button className="flex items-center gap-2">
            <PiPlusBold className="h-4 w-4" />
            Yeni Otel Ekle
          </Button>
        </Link>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Otel Adı
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Yıldız
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Konsept
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Lokasyon
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Min. Fiyat
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
              {oteller.map((otel) => (
                <tr key={otel.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <Text className="font-medium text-gray-900">
                        {otel.ad}
                      </Text>
                      {otel.detay?.kisa_aciklama && (
                        <Text className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {otel.detay.kisa_aciklama}
                        </Text>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="text-sm">
                      {renderYildizlar(otel.yildiz)}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="text-sm text-gray-600">
                      {otel.konsept || '-'}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <Text className="font-medium text-gray-900">
                        {otel.sehir}
                      </Text>
                      {otel.bolge && (
                        <Text className="text-xs text-gray-500">
                          {otel.bolge}
                        </Text>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="text-sm font-semibold text-gray-900">
                      {otel.min_fiyat
                        ? `${Number(otel.min_fiyat).toLocaleString('tr-TR')} ₺`
                        : '-'}
                    </Text>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge
                      variant="flat"
                      color={otel.durum === 1 ? 'success' : 'danger'}
                      className="font-medium"
                    >
                      {otel.durum === 1 ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/otel/${otel.id}`}>
                        <ActionIcon
                          size="sm"
                          variant="outline"
                          title="Görüntüle"
                        >
                          <PiEyeBold className="h-4 w-4" />
                        </ActionIcon>
                      </Link>
                      <Link href={`/otel/${otel.id}/duzenle`}>
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
                        onClick={() => handleDelete(otel.id)}
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

        {oteller.length === 0 && (
          <div className="py-20 text-center">
            <Text className="text-gray-500 mb-4">Henüz otel eklenmemiş</Text>
            <Link href="/otel/yeni-otel">
              <Button>İlk Oteli Ekle</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

