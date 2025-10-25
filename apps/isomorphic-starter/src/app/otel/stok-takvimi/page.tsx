'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Modal, ActionIcon, Textarea } from 'rizzui';
import { PiPlusBold, PiPencilBold, PiTrashBold, PiRocketLaunchBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import {
  getAllStokTakvim,
  createStokTakvim,
  updateStokTakvim,
  deleteStokTakvim,
  initializeStokForDateRange,
  StokTakvim,
  CreateStokTakvimDto,
} from '@/services/stok-takvim.service';

export default function StokTakvimiPage() {
  const [stoklar, setStoklar] = useState<StokTakvim[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [initModalOpen, setInitModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateStokTakvimDto>({
    oda_tipi_id: 0,
    tarih: '',
    toplam_oda: 0,
    rezerve_oda: 0,
    bloke_oda: 0,
  });
  const [initFormData, setInitFormData] = useState({
    oda_tipi_id: 0,
    toplam_oda: 0,
    baslangic_tarihi: '',
    bitis_tarihi: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllStokTakvim();
      setStoklar(data);
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
        await updateStokTakvim(editingId, formData);
        toast.success('Stok takvimi güncellendi');
      } else {
        await createStokTakvim(formData);
        toast.success('Stok takvimi oluşturuldu');
      }
      setModalOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'İşlem başarısız');
    }
  };

  const handleInitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!initFormData.oda_tipi_id || initFormData.oda_tipi_id === 0) {
      toast.error('Lütfen oda tipi ID girin');
      return;
    }

    try {
      const result = await initializeStokForDateRange(
        initFormData.oda_tipi_id,
        initFormData.toplam_oda,
        initFormData.baslangic_tarihi,
        initFormData.bitis_tarihi
      );
      toast.success(result);
      setInitModalOpen(false);
      setInitFormData({
        oda_tipi_id: 0,
        toplam_oda: 0,
        baslangic_tarihi: '',
        bitis_tarihi: '',
      });
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'Stok başlatılamadı');
    }
  };

  const handleEdit = (stok: StokTakvim) => {
    setEditingId(stok.id);
    setFormData({
      oda_tipi_id: stok.oda_tipi_id,
      tarih: stok.tarih.split('T')[0],
      toplam_oda: stok.toplam_oda,
      rezerve_oda: stok.rezerve_oda,
      bloke_oda: stok.bloke_oda,
      notlar: stok.notlar,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu stok takvimini silmek istediğinizden emin misiniz?')) {
      try {
        await deleteStokTakvim(id);
        toast.success('Stok takvimi silindi');
        loadData();
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      oda_tipi_id: 0,
      tarih: '',
      toplam_oda: 0,
      rezerve_oda: 0,
      bloke_oda: 0,
    });
    setEditingId(null);
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
          <Text className="text-xl font-semibold">Stok Takvimi Yönetimi</Text>
          <Text className="text-sm text-gray-500">
            Oda tiplerinin günlük stok ve müsaitlik takibi
          </Text>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setInitModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <PiRocketLaunchBold className="h-4 w-4" />
            Stok Başlat
          </Button>
          <Button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2"
          >
            <PiPlusBold className="h-4 w-4" />
            Yeni Stok Kaydı
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Otel / Oda Tipi
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Tarih</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Toplam Oda
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Rezerve
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Bloke
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Müsait
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">Notlar</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stoklar.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Henüz stok kaydı eklenmemiş. "Stok Başlat" ile toplu kayıt
                    oluşturabilirsiniz.
                  </td>
                </tr>
              ) : (
                stoklar.slice(0, 100).map((stok) => (
                  <tr key={stok.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">
                      <div className="font-medium">
                        {stok.odaTipi?.otel?.ad || 'Otel Yükleniyor...'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {stok.odaTipi?.ad || `Oda Tipi #${stok.oda_tipi_id}`}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(stok.tarih).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-medium">
                      {stok.toplam_oda}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex rounded-md bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                        {stok.rezerve_oda}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                        {stok.bloke_oda}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
                          stok.musait_oda > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {stok.musait_oda}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                      {stok.notlar || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ActionIcon
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(stok)}
                        >
                          <PiPencilBold className="h-4 w-4" />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="outline"
                          color="danger"
                          onClick={() => handleDelete(stok.id)}
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
        {stoklar.length > 100 && (
          <div className="border-t px-4 py-3 text-sm text-gray-500 text-center">
            İlk 100 kayıt gösteriliyor. Toplam: {stoklar.length} kayıt
          </div>
        )}
      </div>

      {/* Stok Başlatma Modal */}
      <Modal
        isOpen={initModalOpen}
        onClose={() => setInitModalOpen(false)}
        size="md"
      >
        <div className="m-auto px-8 pb-8 pt-6 w-full">
          <Text className="text-xl font-bold mb-4">Stok Başlat</Text>
          <Text className="text-sm text-gray-600 mb-7">
            Belirtilen tarih aralığı için otomatik stok kayıtları oluşturulur
          </Text>
          <form onSubmit={handleInitSubmit} className="space-y-5">
            <Input
              label="Oda Tipi ID"
              type="number"
              value={initFormData.oda_tipi_id}
              onChange={(e) =>
                setInitFormData({
                  ...initFormData,
                  oda_tipi_id: parseInt(e.target.value) || 0,
                })
              }
              required
            />

            <Input
              label="Toplam Oda Sayısı"
              type="number"
              value={initFormData.toplam_oda}
              onChange={(e) =>
                setInitFormData({
                  ...initFormData,
                  toplam_oda: parseInt(e.target.value) || 0,
                })
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Başlangıç Tarihi"
                type="date"
                value={initFormData.baslangic_tarihi}
                onChange={(e) =>
                  setInitFormData({
                    ...initFormData,
                    baslangic_tarihi: e.target.value,
                  })
                }
                required
              />
              <Input
                label="Bitiş Tarihi"
                type="date"
                value={initFormData.bitis_tarihi}
                onChange={(e) =>
                  setInitFormData({ ...initFormData, bitis_tarihi: e.target.value })
                }
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setInitModalOpen(false)}
              >
                İptal
              </Button>
              <Button type="submit">Stok Başlat</Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Düzenleme Modal */}
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
            {editingId ? 'Stok Kaydı Düzenle' : 'Yeni Stok Kaydı Ekle'}
          </Text>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Oda Tipi ID"
              type="number"
              value={formData.oda_tipi_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  oda_tipi_id: parseInt(e.target.value) || 0,
                })
              }
              required
              disabled={!!editingId}
            />

            <Input
              label="Tarih"
              type="date"
              value={formData.tarih}
              onChange={(e) => setFormData({ ...formData, tarih: e.target.value })}
              required
              disabled={!!editingId}
            />

            <Input
              label="Toplam Oda Sayısı"
              type="number"
              value={formData.toplam_oda}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  toplam_oda: parseInt(e.target.value) || 0,
                })
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Rezerve Oda"
                type="number"
                value={formData.rezerve_oda}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rezerve_oda: parseInt(e.target.value) || 0,
                  })
                }
              />
              <Input
                label="Bloke Oda"
                type="number"
                value={formData.bloke_oda}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bloke_oda: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <Textarea
              label="Notlar"
              value={formData.notlar || ''}
              onChange={(e) => setFormData({ ...formData, notlar: e.target.value })}
              rows={3}
              placeholder="Opsiyonel notlar..."
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

