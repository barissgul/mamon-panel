'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Select, Modal, ActionIcon } from 'rizzui';
import { PiPlusBold, PiPencilBold, PiTrashBold, PiCalendarBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import {
  getAllFiyatTakvim,
  getFiyatTakvimByOtelId,
  createFiyatTakvim,
  updateFiyatTakvim,
  deleteFiyatTakvim,
  FiyatTakvim,
  CreateFiyatTakvimDto,
} from '@/services/fiyat-takvim.service';
import { getAktifPansiyonTipleri, PansiyonTipi } from '@/services/pansiyon-tipi.service';

export default function FiyatTakvimiPage() {
  const [fiyatlar, setFiyatlar] = useState<FiyatTakvim[]>([]);
  const [pansiyonTipleri, setPansiyonTipleri] = useState<PansiyonTipi[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedOtel, setSelectedOtel] = useState<string>('');
  const [formData, setFormData] = useState<CreateFiyatTakvimDto>({
    oda_tipi_id: 0,
    baslangic_tarihi: '',
    bitis_tarihi: '',
    fiyat: 0,
    min_konaklama_gece: 1,
    durum: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [fiyatlarData, pansiyonData] = await Promise.all([
        getAllFiyatTakvim(),
        getAktifPansiyonTipleri(),
      ]);
      setFiyatlar(fiyatlarData);
      setPansiyonTipleri(pansiyonData);
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.oda_tipi_id || formData.oda_tipi_id === 0) {
      toast.error('Lütfen oda tipi seçin');
      return;
    }

    try {
      if (editingId) {
        await updateFiyatTakvim(editingId, formData);
        toast.success('Fiyat takvimi güncellendi');
      } else {
        await createFiyatTakvim(formData);
        toast.success('Fiyat takvimi oluşturuldu');
      }
      setModalOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'İşlem başarısız');
    }
  };

  const handleEdit = (fiyat: FiyatTakvim) => {
    setEditingId(fiyat.id);
    setFormData({
      oda_tipi_id: fiyat.oda_tipi_id,
      pansiyon_tipi_id: fiyat.pansiyon_tipi_id,
      baslangic_tarihi: fiyat.baslangic_tarihi.split('T')[0],
      bitis_tarihi: fiyat.bitis_tarihi.split('T')[0],
      fiyat: fiyat.fiyat,
      min_konaklama_gece: fiyat.min_konaklama_gece,
      max_konaklama_gece: fiyat.max_konaklama_gece,
      ozel_donem_adi: fiyat.ozel_donem_adi,
      durum: fiyat.durum,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu fiyat takvimini silmek istediğinizden emin misiniz?')) {
      try {
        await deleteFiyatTakvim(id);
        toast.success('Fiyat takvimi silindi');
        loadData();
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      oda_tipi_id: 0,
      baslangic_tarihi: '',
      bitis_tarihi: '',
      fiyat: 0,
      min_konaklama_gece: 1,
      durum: 1,
    });
    setEditingId(null);
  };

  const filteredFiyatlar = selectedOtel
    ? fiyatlar.filter((f) => f.odaTipi?.otel?.id === parseInt(selectedOtel))
    : fiyatlar;

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
          <Text className="text-xl font-semibold">Fiyat Takvimi Yönetimi</Text>
          <Text className="text-sm text-gray-500">
            Oda tiplerinin tarih bazlı fiyatlandırması
          </Text>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PiPlusBold className="h-4 w-4" />
          Yeni Fiyat Takvimi
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Otel / Oda Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Pansiyon
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Tarih Aralığı
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Fiyat
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Min Gece
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Özel Dönem
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
              {filteredFiyatlar.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Henüz fiyat takvimi eklenmemiş
                  </td>
                </tr>
              ) : (
                filteredFiyatlar.map((fiyat) => (
                  <tr key={fiyat.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium">
                        {fiyat.odaTipi?.otel?.ad || 'Otel Yükleniyor...'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {fiyat.odaTipi?.ad || `Oda Tipi #${fiyat.oda_tipi_id}`}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {fiyat.pansiyonTipi ? (
                        <span className="inline-flex rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {fiyat.pansiyonTipi.ad}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Tüm Pansiyonlar</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1 text-xs">
                        <PiCalendarBold className="h-3 w-3" />
                        {new Date(fiyat.baslangic_tarihi).toLocaleDateString('tr-TR')}
                        <span>→</span>
                        {new Date(fiyat.bitis_tarihi).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {fiyat.fiyat.toLocaleString('tr-TR')} ₺
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {fiyat.min_konaklama_gece} gece
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {fiyat.ozel_donem_adi ? (
                        <span className="inline-flex rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                          {fiyat.ozel_donem_adi}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          fiyat.durum === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {fiyat.durum === 1 ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ActionIcon
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(fiyat)}
                        >
                          <PiPencilBold className="h-4 w-4" />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="outline"
                          color="danger"
                          onClick={() => handleDelete(fiyat.id)}
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
            {editingId ? 'Fiyat Takvimi Düzenle' : 'Yeni Fiyat Takvimi Ekle'}
          </Text>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Oda Tipi ID"
              type="number"
              value={formData.oda_tipi_id}
              onChange={(e) =>
                setFormData({ ...formData, oda_tipi_id: parseInt(e.target.value) || 0 })
              }
              required
              placeholder="Oda tipi ID girin"
            />

            <Select
              label="Pansiyon Tipi (Opsiyonel)"
              value={formData.pansiyon_tipi_id || ''}
              options={[
                { value: '', label: 'Tüm Pansiyonlar' },
                ...pansiyonTipleri.map((p) => ({
                  value: p.id,
                  label: `${p.ad} (${p.kod})`,
                })),
              ]}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  pansiyon_tipi_id: value ? (value as any).value : undefined,
                })
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Başlangıç Tarihi"
                type="date"
                value={formData.baslangic_tarihi}
                onChange={(e) =>
                  setFormData({ ...formData, baslangic_tarihi: e.target.value })
                }
                required
              />
              <Input
                label="Bitiş Tarihi"
                type="date"
                value={formData.bitis_tarihi}
                onChange={(e) =>
                  setFormData({ ...formData, bitis_tarihi: e.target.value })
                }
                required
              />
            </div>

            <Input
              label="Gecelik Fiyat (₺)"
              type="number"
              step="0.01"
              value={formData.fiyat}
              onChange={(e) =>
                setFormData({ ...formData, fiyat: parseFloat(e.target.value) || 0 })
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Minimum Konaklama (Gece)"
                type="number"
                value={formData.min_konaklama_gece}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    min_konaklama_gece: parseInt(e.target.value) || 1,
                  })
                }
              />
              <Input
                label="Maksimum Konaklama (Gece)"
                type="number"
                value={formData.max_konaklama_gece || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_konaklama_gece: e.target.value
                      ? parseInt(e.target.value)
                      : undefined,
                  })
                }
                placeholder="Sınırsız"
              />
            </div>

            <Input
              label="Özel Dönem Adı (Opsiyonel)"
              value={formData.ozel_donem_adi || ''}
              onChange={(e) =>
                setFormData({ ...formData, ozel_donem_adi: e.target.value })
              }
              placeholder="örn: Yılbaşı Kampanyası"
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

