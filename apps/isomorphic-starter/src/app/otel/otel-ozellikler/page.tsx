'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Switch, Modal, ActionIcon } from 'rizzui';
import { PiPlusBold, PiPencilBold, PiTrashBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import {
  getOtelOzellikler,
  createOtelOzellik,
  updateOtelOzellik,
  deleteOtelOzellik,
  OtelOzellik,
  CreateOtelOzellikDto,
} from '@/services/otel-ozellik.service';

export default function OtelOzelliklerPage() {
  const [ozellikler, setOzellikler] = useState<OtelOzellik[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateOtelOzellikDto>({
    baslik: '',
    aciklama: '',
    ikon: '',
    sira: 0,
    durum: 1,
  });

  useEffect(() => {
    loadOzellikler();
  }, []);

  const loadOzellikler = async () => {
    try {
      setLoading(true);
      const data = await getOtelOzellikler();
      setOzellikler(data);
    } catch (error) {
      toast.error('Özellikler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateOtelOzellik(editingId, formData);
        toast.success('Özellik güncellendi');
      } else {
        await createOtelOzellik(formData);
        toast.success('Özellik oluşturuldu');
      }
      setModalOpen(false);
      resetForm();
      loadOzellikler();
    } catch (error) {
      toast.error('İşlem başarısız');
    }
  };

  const handleEdit = (ozellik: OtelOzellik) => {
    setEditingId(ozellik.id);
    setFormData({
      baslik: ozellik.baslik,
      aciklama: ozellik.aciklama || '',
      ikon: ozellik.ikon || '',
      sira: ozellik.sira,
      durum: ozellik.durum,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu özelliği silmek istediğinizden emin misiniz?')) {
      try {
        await deleteOtelOzellik(id);
        toast.success('Özellik silindi');
        loadOzellikler();
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      baslik: '',
      aciklama: '',
      ikon: '',
      sira: 0,
      durum: 1,
    });
    setEditingId(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
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
          <Text className="text-xl font-semibold">Otel Özellikleri</Text>
          <Text className="text-sm text-gray-500">
            Otel genel özelliklerini yönetin
          </Text>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PiPlusBold className="h-4 w-4" />
          Yeni Özellik
        </Button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Sıra
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Başlık
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Açıklama
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  İkon
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                  Durum
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ozellikler.map((ozellik) => (
                <tr key={ozellik.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {ozellik.sira}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {ozellik.baslik}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {ozellik.aciklama || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {ozellik.ikon || '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        ozellik.durum === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {ozellik.durum === 1 ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ActionIcon
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(ozellik)}
                        title="Düzenle"
                      >
                        <PiPencilBold className="h-4 w-4" />
                      </ActionIcon>
                      <ActionIcon
                        size="sm"
                        variant="outline"
                        color="danger"
                        onClick={() => handleDelete(ozellik.id)}
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

        {ozellikler.length === 0 && (
          <div className="py-12 text-center">
            <Text className="text-gray-500">Henüz özellik eklenmemiş</Text>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={handleCloseModal} size="lg">
        <div className="m-auto px-8 pb-8 pt-6 w-full">
          <div className="mb-7">
            <Text className="text-xl font-bold">
              {editingId ? 'Özellik Düzenle' : 'Yeni Özellik Ekle'}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Otel özelliği bilgilerini doldurun
            </Text>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Başlık"
              placeholder="Örn: Ücretsiz Wi-Fi"
              value={formData.baslik}
              onChange={(e) =>
                setFormData({ ...formData, baslik: e.target.value })
              }
              required
              size="lg"
              className="[&>label>span]:font-medium"
            />

            <Input
              label="Açıklama"
              placeholder="Özellik açıklaması"
              value={formData.aciklama}
              onChange={(e) =>
                setFormData({ ...formData, aciklama: e.target.value })
              }
              size="lg"
              className="[&>label>span]:font-medium"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="İkon"
                placeholder="Örn: wifi"
                value={formData.ikon}
                onChange={(e) =>
                  setFormData({ ...formData, ikon: e.target.value })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Input
                label="Sıra"
                type="number"
                value={formData.sira}
                onChange={(e) =>
                  setFormData({ ...formData, sira: parseInt(e.target.value) })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
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

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                size="lg"
                className="min-w-[120px]"
              >
                İptal
              </Button>
              <Button type="submit" size="lg" className="min-w-[120px]">
                {editingId ? 'Güncelle' : 'Oluştur'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

