'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Select, Modal, ActionIcon, Textarea } from 'rizzui';
import { PiPlusBold, PiPencilBold, PiTrashBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import {
  getKategoriler,
  createKategori,
  updateKategori,
  deleteKategori,
  Kategori,
  CreateKategoriDto,
} from '@/services/kategori.service';

// Hizmet tipleri (backend'deki hizmetler tablosundan)
const HIZMETLER = [
  { id: 1, ad: 'Konaklama', slug: 'stays' },
  { id: 2, ad: 'Araç Kiralama', slug: 'cars' },
  { id: 3, ad: 'Deneyimler', slug: 'experiences' },
  { id: 4, ad: 'Emlak', slug: 'real-estates' },
  { id: 5, ad: 'Uçuşlar', slug: 'flights' },
];

export default function KategorilerPage() {
  const [kategoriler, setKategoriler] = useState<Kategori[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedHizmet, setSelectedHizmet] = useState<number>(0); // 0 = Tümü
  const [formData, setFormData] = useState<CreateKategoriDto>({
    hizmet_id: 1,
    ad: '',
    slug: '',
    bolge: '',
    adet: 0,
    aciklama: '',
    thumbnail: '',
    kapak_gorseli: '',
    sira: 0,
    durum: 1,
  });

  useEffect(() => {
    loadKategoriler();
  }, []);

  const loadKategoriler = async () => {
    try {
      setLoading(true);
      const data = await getKategoriler();
      setKategoriler(data);
    } catch (error) {
      toast.error('Kategoriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateKategori(editingId, formData);
        toast.success('Kategori güncellendi');
      } else {
        await createKategori(formData);
        toast.success('Kategori oluşturuldu');
      }
      setModalOpen(false);
      resetForm();
      loadKategoriler();
    } catch (error: any) {
      toast.error(error.message || 'İşlem başarısız');
    }
  };

  const handleEdit = (kategori: Kategori) => {
    setEditingId(kategori.id);
    setFormData({
      hizmet_id: kategori.hizmet_id,
      ad: kategori.ad,
      slug: kategori.slug,
      bolge: kategori.bolge || '',
      adet: kategori.adet,
      aciklama: kategori.aciklama || '',
      thumbnail: kategori.thumbnail || '',
      kapak_gorseli: kategori.kapak_gorseli || '',
      sira: kategori.sira,
      durum: kategori.durum,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteKategori(id);
        toast.success('Kategori silindi');
        loadKategoriler();
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      hizmet_id: 1,
      ad: '',
      slug: '',
      bolge: '',
      adet: 0,
      aciklama: '',
      thumbnail: '',
      kapak_gorseli: '',
      sira: 0,
      durum: 1,
    });
    setEditingId(null);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    resetForm();
  };

  // Slug otomatik oluştur (ad'dan)
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleAdChange = (value: string) => {
    setFormData({
      ...formData,
      ad: value,
      slug: generateSlug(value),
    });
  };

  const filteredKategoriler = selectedHizmet === 0
    ? kategoriler
    : kategoriler.filter(k => k.hizmet_id === selectedHizmet);

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
          <Text className="text-xl font-semibold">Kategoriler</Text>
          <Text className="text-sm text-gray-500">
            Şehir ve bölge kategorilerini yönetin
          </Text>
        </div>
        <Button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PiPlusBold className="h-4 w-4" />
          Yeni Kategori
        </Button>
      </div>

      {/* Hizmet Filtresi */}
      <div className="mb-4">
        <Select
          label="Hizmete Göre Filtrele"
          value={selectedHizmet}
          onChange={(e) => setSelectedHizmet(parseInt(e.target.value))}
          className="max-w-xs"
        >
          <option value={0}>Tüm Hizmetler</option>
          {HIZMETLER.map((hizmet) => (
            <option key={hizmet.id} value={hizmet.id}>
              {hizmet.ad}
            </option>
          ))}
        </Select>
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
                  Hizmet
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Kategori Adı
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Slug
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                  Bölge
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                  İlan Sayısı
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
              {filteredKategoriler.map((kategori) => (
                <tr key={kategori.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {kategori.sira}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="inline-flex rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                      {kategori.hizmet?.ad || HIZMETLER.find(h => h.id === kategori.hizmet_id)?.ad}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {kategori.ad}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono text-xs">
                    {kategori.slug}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {kategori.bolge || '-'}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-600">
                    <span className="font-semibold">{kategori.adet.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        kategori.durum === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {kategori.durum === 1 ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ActionIcon
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(kategori)}
                        title="Düzenle"
                      >
                        <PiPencilBold className="h-4 w-4" />
                      </ActionIcon>
                      <ActionIcon
                        size="sm"
                        variant="outline"
                        color="danger"
                        onClick={() => handleDelete(kategori.id)}
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

        {filteredKategoriler.length === 0 && (
          <div className="py-12 text-center">
            <Text className="text-gray-500">
              {selectedHizmet === 0 
                ? 'Henüz kategori eklenmemiş' 
                : 'Bu hizmet için kategori bulunamadı'}
            </Text>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={handleCloseModal} size="xl">
        <div className="m-auto px-8 pb-8 pt-6 w-full">
          <div className="mb-7">
            <Text className="text-xl font-bold">
              {editingId ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Kategori bilgilerini doldurun
            </Text>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="Hizmet"
              value={formData.hizmet_id}
              onChange={(e) =>
                setFormData({ ...formData, hizmet_id: parseInt(e.target.value) })
              }
              required
              size="lg"
              className="[&>label>span]:font-medium"
            >
              {HIZMETLER.map((hizmet) => (
                <option key={hizmet.id} value={hizmet.id}>
                  {hizmet.ad}
                </option>
              ))}
            </Select>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Kategori Adı"
                placeholder="Örn: New York, USA"
                value={formData.ad}
                onChange={(e) => handleAdChange(e.target.value)}
                required
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Input
                label="Slug (URL)"
                placeholder="Örn: new-york-usa"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                required
                size="lg"
                className="[&>label>span]:font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Bölge/Region"
                placeholder="Örn: United States"
                value={formData.bolge}
                onChange={(e) =>
                  setFormData({ ...formData, bolge: e.target.value })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />

              <Input
                label="İlan Sayısı"
                type="number"
                placeholder="0"
                value={formData.adet}
                onChange={(e) =>
                  setFormData({ ...formData, adet: parseInt(e.target.value) || 0 })
                }
                size="lg"
                className="[&>label>span]:font-medium"
              />
            </div>

            <Textarea
              label="Açıklama"
              placeholder="Kategori açıklaması..."
              value={formData.aciklama}
              onChange={(e) =>
                setFormData({ ...formData, aciklama: e.target.value })
              }
              rows={3}
              className="[&>label>span]:font-medium"
            />

            <Input
              label="Thumbnail URL"
              placeholder="https://images.pexels.com/..."
              value={formData.thumbnail}
              onChange={(e) =>
                setFormData({ ...formData, thumbnail: e.target.value })
              }
              size="lg"
              className="[&>label>span]:font-medium"
            />

            <Input
              label="Kapak Görseli URL"
              placeholder="https://images.pexels.com/..."
              value={formData.kapak_gorseli}
              onChange={(e) =>
                setFormData({ ...formData, kapak_gorseli: e.target.value })
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

            {/* Görsel önizleme */}
            {formData.thumbnail && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <Text className="text-sm font-medium mb-2">Thumbnail Önizleme:</Text>
                <img 
                  src={formData.thumbnail} 
                  alt="Thumbnail" 
                  className="max-w-xs h-32 object-cover rounded-lg"
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

