'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Select, Modal, ActionIcon, Textarea } from 'rizzui';
import { PiPlusBold, PiPencilBold, PiTrashBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import {
  getSiteOzellikleri,
  createSiteOzellik,
  updateSiteOzellik,
  deleteSiteOzellik,
  SiteOzellik,
  CreateSiteOzellikDto,
} from '@/services/site-ozellik.service';

export default function SiteOzellikleriPage() {
  const [ozellikler, setOzellikler] = useState<SiteOzellik[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateSiteOzellikDto>({
    sayfa: 'anasayfa',
    rozet: '',
    rozet_renk: 'blue',
    baslik: '',
    aciklama: '',
    sira: 0,
    durum: 1,
  });

  useEffect(() => {
    loadOzellikler();
  }, []);

  const loadOzellikler = async () => {
    try {
      setLoading(true);
      const data = await getSiteOzellikleri();
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
        await updateSiteOzellik(editingId, formData);
        toast.success('Özellik güncellendi');
      } else {
        await createSiteOzellik(formData);
        toast.success('Özellik oluşturuldu');
      }
      setModalOpen(false);
      resetForm();
      loadOzellikler();
    } catch (error: any) {
      toast.error(error.message || 'İşlem başarısız');
    }
  };

  const handleEdit = (ozellik: SiteOzellik) => {
    setEditingId(ozellik.id);
    setFormData({
      sayfa: ozellik.sayfa,
      rozet: ozellik.rozet,
      rozet_renk: ozellik.rozet_renk,
      baslik: ozellik.baslik,
      aciklama: ozellik.aciklama || '',
      sira: ozellik.sira,
      durum: ozellik.durum,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu özelliği silmek istediğinizden emin misiniz?')) {
      try {
        await deleteSiteOzellik(id);
        toast.success('Özellik silindi');
        loadOzellikler();
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      sayfa: 'anasayfa',
      rozet: '',
      rozet_renk: 'blue',
      baslik: '',
      aciklama: '',
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
          <Text className="text-xl font-semibold">Site Özellikleri</Text>
          <Text className="text-sm text-gray-500">
            Ana sayfa "Our Features" bölümünü yönetin
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
                  Sayfa
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Rozet
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Başlık
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Açıklama
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
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="inline-flex rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                      {ozellik.sayfa}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${
                        ozellik.rozet_renk === 'red'
                          ? 'bg-red-100 text-red-800'
                          : ozellik.rozet_renk === 'green'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {ozellik.rozet}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {ozellik.baslik}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {ozellik.aciklama || '-'}
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
              Site özelliği bilgilerini doldurun
            </Text>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sayfa"
                placeholder="anasayfa"
                value={formData.sayfa}
                onChange={(e) =>
                  setFormData({ ...formData, sayfa: e.target.value })
                }
                required
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Select
                label="Rozet Rengi"
                value={formData.rozet_renk}
                onChange={(e) =>
                  setFormData({ ...formData, rozet_renk: e.target.value })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              >
                <option value="blue">Mavi</option>
                <option value="green">Yeşil</option>
                <option value="red">Kırmızı</option>
              </Select>
            </div>

            <Input
              label="Rozet Metni"
              placeholder="Örn: Advertising"
              value={formData.rozet}
              onChange={(e) =>
                setFormData({ ...formData, rozet: e.target.value })
              }
              required
              size="lg"
              className="[&>label>span]:font-medium"
            />

            <Input
              label="Başlık"
              placeholder="Örn: Cost-effective advertising"
              value={formData.baslik}
              onChange={(e) =>
                setFormData({ ...formData, baslik: e.target.value })
              }
              required
              size="lg"
              className="[&>label>span]:font-medium"
            />

            <Textarea
              label="Açıklama"
              placeholder="Özellik açıklaması..."
              value={formData.aciklama}
              onChange={(e) =>
                setFormData({ ...formData, aciklama: e.target.value })
              }
              rows={3}
              className="[&>label>span]:font-medium"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sıra"
                type="number"
                value={formData.sira}
                onChange={(e) =>
                  setFormData({ ...formData, sira: parseInt(e.target.value) || 0 })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Select
                label="Durum"
                value={formData.durum}
                onChange={(e) =>
                  setFormData({ ...formData, durum: parseInt(e.target.value) })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              >
                <option value={1}>Aktif</option>
                <option value={0}>Pasif</option>
              </Select>
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

