'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Text, Badge } from 'rizzui';
import {
  PiPlusBold,
  PiPencilBold,
  PiTrashBold,
} from 'react-icons/pi';
import toast from 'react-hot-toast';
import {
  getYetkiler,
  deleteYetki,
  Yetki,
} from '@/services/yetkiler.service';

export default function YetkilerPage() {
  const router = useRouter();
  const [yetkiler, setYetkiler] = useState<Yetki[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadYetkiler();
  }, []);

  const loadYetkiler = async () => {
    try {
      setLoading(true);
      const data = await getYetkiler();
      setYetkiler(data);
    } catch (error) {
      toast.error('Yetkiler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, yetkiAdi: string) => {
    if (!confirm(`"${yetkiAdi}" yetkisini silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await deleteYetki(id);
      toast.success('Yetki silindi');
      loadYetkiler();
    } catch (error) {
      toast.error('Yetki silinirken hata oluştu');
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
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Text className="text-2xl font-bold">Yetkiler</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Sistem yetkilerini yönetin
          </Text>
        </div>
        <Link href="/kullanicilar/yetkiler/yeni">
          <Button className="flex items-center gap-2">
            <PiPlusBold className="h-4 w-4" />
            Yeni Yetki
          </Button>
        </Link>
      </div>

      {/* Liste */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {yetkiler.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Text className="mb-4">Henüz yetki oluşturulmamış</Text>
            <Link href="/kullanicilar/yetkiler/yeni">
              <Button>İlk Yetkiyi Oluştur</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yetki Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {yetkiler.map((yetki) => (
                  <tr key={yetki.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Text className="text-sm text-gray-900">#{yetki.id}</Text>
                    </td>
                    <td className="px-6 py-4">
                      <Text className="font-medium">{yetki.yetki}</Text>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="flat"
                        color={yetki.durum === 1 ? 'success' : 'danger'}
                      >
                        {yetki.durum === 1 ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/kullanicilar/yetkiler/${yetki.id}/duzenle`}>
                          <Button size="sm" variant="outline">
                            <PiPencilBold className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          color="danger"
                          onClick={() => handleDelete(yetki.id, yetki.yetki)}
                        >
                          <PiTrashBold className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

