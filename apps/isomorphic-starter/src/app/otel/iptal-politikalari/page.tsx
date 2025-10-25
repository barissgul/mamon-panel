'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Select, Modal, ActionIcon, Textarea } from 'rizzui';
import { PiPlusBold, PiPencilBold, PiTrashBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import {
  getAllIptalPolitikalari,
  createIptalPolitika,
  updateIptalPolitika,
  deleteIptalPolitika,
  IptalPolitika,
  CreateIptalPolitikaDto,
} from '@/services/iptal-politika.service';

export default function IptalPolitikalariPage() {
  const [politikalar, setPolitikalar] = useState<IptalPolitika[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedOtel, setSelectedOtel] = useState<string>('');
  const [formData, setFormData] = useState<CreateIptalPolitikaDto>({
    otel_id: 0,
    ad: '',
    gun_oncesi: 0,
    iade_orani: 100,
    sira: 0,
    durum: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllIptalPolitikalari();
      setPolitikalar(data);
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.otel_id || formData.otel_id === 0) {
      toast.error('Lütfen otel ID girin');
      return;
    }

    try {
      if (editingId) {
        await updateIptalPolitika(editingId, formData);
        toast.success('İptal politikası güncellendi');
      } else {
        await createIptalPolitika(formData);
        toast.success('İptal politikası oluşturuldu');
      }
      setModalOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'İşlem başarısız');
    }
  };

  const handleEdit = (politika: IptalPolitika) => {
    setEditingId(politika.id);
    setFormData({
      otel_id: politika.otel_id,
      ad: politika.ad,
      gun_oncesi: politika.gun_oncesi,
      iade_orani: politika.iade_orani,
      aciklama: politika.aciklama,
      sira: politika.sira,
      durum: politika.durum,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu iptal politikasını silmek istediğinizden emin misiniz?')) {
      try {
        await deleteIptalPolitika(id);
        toast.success('İptal politikası silindi');
        loadData();
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      otel_id: 0,
      ad: '',
      gun_oncesi: 0,
      iade_orani: 100,
      sira: 0,
      durum: 1,
    });
    setEditingId(null);
  };

  const filteredPolitikalar = selectedOtel
    ? politikalar.filter((p) => p.otel?.id === parseInt(selectedOtel))
    : politikalar;

  const getIadeRenk = (oran: number) => {
    if (oran === 100) return 'bg-green-100 text-green-800';
    if (oran >= 50) return 'bg-yellow-100 text-yellow-800';
    if (oran > 0) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
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
          <Text className="text-xl font-semibold">İptal Politikaları</Text>
          <Text className="text-sm text-gray-500">
            Otellerin iptal ve iade politikalarını yönetin
          </Text>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PiPlusBold className="h-4 w-4" />
          Yeni İptal Politikası
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">Sıra</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Otel</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Politika Adı
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Gün Öncesi
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  İade Oranı
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Açıklama
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Durum
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPolitikalar.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Henüz iptal politikası eklenmemiş
                  </td>
                </tr>
              ) : (
                filteredPolitikalar.map((politika) => (
                  <tr key={politika.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-center">
                      {politika.sira}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium">
                        {politika.otel?.ad || `Otel #${politika.otel_id}`}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {politika.ad}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                        {politika.gun_oncesi} gün
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${getIadeRenk(
                          politika.iade_orani
                        )}`}
                      >
                        %{politika.iade_orani}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-md">
                      {politika.aciklama || '-'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          politika.durum === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {politika.durum === 1 ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ActionIcon
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(politika)}
                        >
                          <PiPencilBold className="h-4 w-4" />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="outline"
                          color="danger"
                          onClick={() => handleDelete(politika.id)}
                        >
                          <PiTrashBold className="h-4 w-4" />
                        </ActionIcon>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          resetForm();
        }}
        size="lg"
      >
        <div className="m-auto px-8 pb-8 pt-6 w-full">
          <Text className="text-xl font-bold mb-7">
            {editingId ? 'İptal Politikası Düzenle' : 'Yeni İptal Politikası Ekle'}
          </Text>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Otel ID"
              type="number"
              value={formData.otel_id}
              onChange={(e) =>
                setFormData({ ...formData, otel_id: parseInt(e.target.value) || 0 })
              }
              required
            />

            <Input
              label="Politika Adı"
              value={formData.ad}
              onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
              required
              placeholder="örn: Ücretsiz İptal, Yarı İade, İade Yok"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Gün Öncesi"
                type="number"
                value={formData.gun_oncesi}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    gun_oncesi: parseInt(e.target.value) || 0,
                  })
                }
                required
                helperText="Girişten kaç gün önce"
              />
              <Input
                label="İade Oranı (%)"
                type="number"
                min="0"
                max="100"
                value={formData.iade_orani}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    iade_orani: parseFloat(e.target.value) || 0,
                  })
                }
                helperText="0 = İade yok, 100 = Tam iade"
              />
            </div>

            <Textarea
              label="Açıklama"
              value={formData.aciklama || ''}
              onChange={(e) =>
                setFormData({ ...formData, aciklama: e.target.value })
              }
              rows={3}
              placeholder="Politika açıklaması..."
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sıra"
                type="number"
                value={formData.sira}
                onChange={(e) =>
                  setFormData({ ...formData, sira: parseInt(e.target.value) || 0 })
                }
              />
              <Select
                label="Durum"
                value={formData.durum}
                options={[
                  { value: 1, label: 'Aktif' },
                  { value: 0, label: 'Pasif' },
                ]}
                onChange={(value) =>
                  setFormData({ ...formData, durum: (value as any).value })
                }
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Text className="text-sm font-medium text-blue-900 mb-2">
                💡 Kullanım Örneği
              </Text>
              <Text className="text-xs text-blue-800">
                • Girişten <strong>7 gün öncesine</strong> kadar iptal:{' '}
                <strong>%100 iade</strong>
                <br />
                • Girişten <strong>3 gün öncesine</strong> kadar iptal:{' '}
                <strong>%50 iade</strong>
                <br />• Girişten <strong>3 gün önce</strong> sonrası:{' '}
                <strong>İade yok</strong>
              </Text>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
              >
                İptal
              </Button>
              <Button type="submit">{editingId ? 'Güncelle' : 'Oluştur'}</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

