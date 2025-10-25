'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Text, Badge } from 'rizzui';
import {
  PiPlusBold,
  PiPencilBold,
  PiTrashBold,
  PiEyeBold,
} from 'react-icons/pi';
import toast from 'react-hot-toast';
import {
  getDinamikSayfalar,
  deleteDinamikSayfa,
  DinamikSayfa,
} from '@/services/dinamik-sayfalar.service';

export default function DinamikSayfalarPage() {
  const router = useRouter();
  const [sayfalar, setSayfalar] = useState<DinamikSayfa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSayfalar();
  }, []);

  const loadSayfalar = async () => {
    try {
      setLoading(true);
      const data = await getDinamikSayfalar();
      setSayfalar(data);
    } catch (error) {
      toast.error('Sayfalar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, baslik: string) => {
    if (!confirm(`"${baslik}" sayfasını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await deleteDinamikSayfa(id);
      toast.success('Sayfa silindi');
      loadSayfalar();
    } catch (error) {
      toast.error('Sayfa silinirken hata oluştu');
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
          <Text className="text-2xl font-bold">Dinamik Sayfalar</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Filtreli otel listeleme sayfalarını yönetin
          </Text>
        </div>
        <Link href="/otel/dinamik-sayfalar/yeni">
          <Button className="flex items-center gap-2">
            <PiPlusBold className="h-4 w-4" />
            Yeni Sayfa
          </Button>
        </Link>
      </div>

      {/* Liste */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {sayfalar.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Text className="mb-4">Henüz dinamik sayfa oluşturulmamış</Text>
            <Link href="/otel/dinamik-sayfalar/yeni">
              <Button>İlk Sayfayı Oluştur</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sayfa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Filtreler
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
                {sayfalar.map((sayfa) => (
                  <tr key={sayfa.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <Text className="font-medium">{sayfa.baslik}</Text>
                        {sayfa.aciklama && (
                          <Text className="text-sm text-gray-500 line-clamp-1">
                            {sayfa.aciklama}
                          </Text>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Text className="text-sm font-mono text-gray-600">
                        /{sayfa.slug}
                      </Text>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {sayfa.filtre_kriterleri.bolgeler && (
                          <Badge variant="flat" color="info" size="sm">
                            {sayfa.filtre_kriterleri.bolgeler.length} Bölge
                          </Badge>
                        )}
                        {sayfa.filtre_kriterleri.yildiz && (
                          <Badge variant="flat" color="warning" size="sm">
                            {sayfa.filtre_kriterleri.yildiz.length} Yıldız
                          </Badge>
                        )}
                        {sayfa.filtre_kriterleri.ozellikler && (
                          <Badge variant="flat" color="success" size="sm">
                            {sayfa.filtre_kriterleri.ozellikler.length} Özellik
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="flat"
                        color={sayfa.durum === 1 ? 'success' : 'danger'}
                      >
                        {sayfa.durum === 1 ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/otel/dinamik-sayfalar/${sayfa.id}/preview`}>
                          <Button size="sm" variant="outline">
                            <PiEyeBold className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/otel/dinamik-sayfalar/${sayfa.id}/duzenle`}>
                          <Button size="sm" variant="outline">
                            <PiPencilBold className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          color="danger"
                          onClick={() => handleDelete(sayfa.id, sayfa.baslik)}
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

