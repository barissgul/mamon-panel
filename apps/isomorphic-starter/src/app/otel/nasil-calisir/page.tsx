'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Modal, ActionIcon, Textarea } from 'rizzui';
import { PiPlusBold, PiPencilBold, PiTrashBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import {
  getNasilCalisirlar,
  createNasilCalisir,
  updateNasilCalisir,
  deleteNasilCalisir,
  NasilCalisir,
  CreateNasilCalisirDto,
} from '@/services/nasil-calisir.service';

export default function NasilCalisirPage() {
  const [adimlar, setAdimlar] = useState<NasilCalisir[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateNasilCalisirDto>({
    sayfa: 'anasayfa',
    baslik: '',
    aciklama: '',
    gorsel_url: '',
    gorsel_url_dark: '',
    sira: 0,
    durum: 1,
  });

  useEffect(() => {
    loadAdimlar();
  }, []);

  const loadAdimlar = async () => {
    try {
      setLoading(true);
      const data = await getNasilCalisirlar();
      setAdimlar(data);
    } catch (error) {
      toast.error('Adımlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateNasilCalisir(editingId, formData);
        toast.success('Adım güncellendi');
      } else {
        await createNasilCalisir(formData);
        toast.success('Adım oluşturuldu');
      }
      setModalOpen(false);
      resetForm();
      loadAdimlar();
    } catch (error: any) {
      toast.error(error.message || 'İşlem başarısız');
    }
  };

  const handleEdit = (adim: NasilCalisir) => {
    setEditingId(adim.id);
    setFormData({
      sayfa: adim.sayfa,
      baslik: adim.baslik,
      aciklama: adim.aciklama || '',
      gorsel_url: adim.gorsel_url || '',
      gorsel_url_dark: adim.gorsel_url_dark || '',
      sira: adim.sira,
      durum: adim.durum,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu adımı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteNasilCalisir(id);
        toast.success('Adım silindi');
        loadAdimlar();
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      sayfa: 'anasayfa',
      baslik: '',
      aciklama: '',
      gorsel_url: '',
      gorsel_url_dark: '',
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
          <Text className="text-xl font-semibold">Nasıl Çalışır Adımları</Text>
          <Text className="text-sm text-gray-500">
            "How it Works" bölümü adımlarını yönetin
          </Text>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PiPlusBold className="h-4 w-4" />
          Yeni Adım
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
                  Başlık
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Açıklama
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Görsel
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
              {adimlar.map((adim) => (
                <tr key={adim.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {adim.sira}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="inline-flex rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                      {adim.sayfa}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {adim.baslik}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {adim.aciklama || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {adim.gorsel_url ? (
                      <img 
                        src={adim.gorsel_url} 
                        alt={adim.baslik}
                        className="h-12 w-12 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png';
                        }}
                      />
                    ) : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        adim.durum === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {adim.durum === 1 ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ActionIcon
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(adim)}
                        title="Düzenle"
                      >
                        <PiPencilBold className="h-4 w-4" />
                      </ActionIcon>
                      <ActionIcon
                        size="sm"
                        variant="outline"
                        color="danger"
                        onClick={() => handleDelete(adim.id)}
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

        {adimlar.length === 0 && (
          <div className="py-12 text-center">
            <Text className="text-gray-500">Henüz adım eklenmemiş</Text>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={handleCloseModal} size="lg">
        <div className="m-auto px-8 pb-8 pt-6 w-full">
          <div className="mb-7">
            <Text className="text-xl font-bold">
              {editingId ? 'Adım Düzenle' : 'Yeni Adım Ekle'}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Nasıl çalışır adımı bilgilerini doldurun
            </Text>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            <Input
              label="Başlık"
              placeholder="Örn: Book & relax"
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
              placeholder="Adım açıklaması..."
              value={formData.aciklama}
              onChange={(e) =>
                setFormData({ ...formData, aciklama: e.target.value })
              }
              rows={3}
              className="[&>label>span]:font-medium"
            />

            <Input
              label="Görsel URL (Light Mode)"
              placeholder="/images/HIW1.png veya https://..."
              value={formData.gorsel_url}
              onChange={(e) =>
                setFormData({ ...formData, gorsel_url: e.target.value })
              }
              size="lg"
              className="[&>label>span]:font-medium"
            />

            <Input
              label="Görsel URL (Dark Mode - Opsiyonel)"
              placeholder="/images/HIW1-dark.png veya https://..."
              value={formData.gorsel_url_dark}
              onChange={(e) =>
                setFormData({ ...formData, gorsel_url_dark: e.target.value })
              }
              size="lg"
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

              <Input
                label="Durum"
                type="number"
                value={formData.durum}
                onChange={(e) =>
                  setFormData({ ...formData, durum: parseInt(e.target.value) || 1 })
                }
                size="lg"
                className="[&>label>span]:font-medium"
                placeholder="1=Aktif, 0=Pasif"
              />
            </div>

            {formData.gorsel_url && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <Text className="text-sm font-medium mb-2">Görsel Önizleme:</Text>
                <img 
                  src={formData.gorsel_url} 
                  alt="Önizleme" 
                  className="max-w-xs h-32 object-contain rounded-lg mx-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

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

