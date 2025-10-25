'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Select, Modal, ActionIcon, Textarea } from 'rizzui';
import { PiPlusBold, PiPencilBold, PiTrashBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import {
  getFooterMenuler,
  getFooterAyarlar,
  createFooterMenu,
  updateFooterMenu,
  deleteFooterMenu,
  updateFooterAyar,
  FooterMenu,
  FooterAyar,
  CreateFooterMenuDto,
} from '@/services/footer.service';

const KATEGORILER = [
  { value: 'solutions', label: 'Solutions' },
  { value: 'support', label: 'Support' },
  { value: 'company', label: 'Company' },
  { value: 'legal', label: 'Legal' },
];

export default function FooterYonetimiPage() {
  const [activeTab, setActiveTab] = useState<'menuler' | 'ayarlar'>('menuler');
  const [menuler, setMenuler] = useState<FooterMenu[]>([]);
  const [ayarlar, setAyarlar] = useState<FooterAyar[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedKategori, setSelectedKategori] = useState<string>('');
  const [formData, setFormData] = useState<CreateFooterMenuDto>({
    kategori: 'solutions',
    baslik: '',
    url: '',
    sira: 0,
    durum: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [menusData, ayarlarData] = await Promise.all([
        getFooterMenuler(),
        getFooterAyarlar(),
      ]);
      setMenuler(menusData);
      setAyarlar(ayarlarData);
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateFooterMenu(editingId, formData);
        toast.success('Menü güncellendi');
      } else {
        await createFooterMenu(formData);
        toast.success('Menü oluşturuldu');
      }
      setModalOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'İşlem başarısız');
    }
  };

  const handleEdit = (menu: FooterMenu) => {
    setEditingId(menu.id);
    setFormData({
      kategori: menu.kategori,
      baslik: menu.baslik,
      url: menu.url,
      sira: menu.sira,
      durum: menu.durum,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu menüyü silmek istediğinizden emin misiniz?')) {
      try {
        await deleteFooterMenu(id);
        toast.success('Menü silindi');
        loadData();
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
    }
  };

  const handleAyarUpdate = async (anahtar: string, deger: string) => {
    try {
      await updateFooterAyar(anahtar, deger);
      toast.success('Ayar güncellendi');
      loadData();
    } catch (error) {
      toast.error('Ayar güncellenemedi');
    }
  };

  const resetForm = () => {
    setFormData({
      kategori: 'solutions',
      baslik: '',
      url: '',
      sira: 0,
      durum: 1,
    });
    setEditingId(null);
  };

  const filteredMenuler = selectedKategori
    ? menuler.filter((m) => m.kategori === selectedKategori)
    : menuler;

  const kategoriSecenekleri = [
    { value: '', label: 'Tümü' },
    ...KATEGORILER,
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="@container">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('menuler')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'menuler'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Menüler
          </button>
          <button
            onClick={() => setActiveTab('ayarlar')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'ayarlar'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Genel Ayarlar
          </button>
        </nav>
      </div>

      {/* MENÜLER TAB */}
      {activeTab === 'menuler' && (
        <div className="pt-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Text className="text-xl font-semibold">Footer Menüleri</Text>
              <Text className="text-sm text-gray-500">Footer linklerini yönetin</Text>
            </div>
            <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
              <PiPlusBold className="h-4 w-4" />
              Yeni Menü
            </Button>
          </div>

          <div className="mb-4">
            <Select
              label="Kategoriye Göre Filtrele"
              value={selectedKategori}
              options={kategoriSecenekleri}
              onChange={(value) => setSelectedKategori((value as any).value)}
              className="max-w-xs"
            />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Sıra</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Kategori</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Başlık</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">URL</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Durum</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMenuler.map((menu) => (
                    <tr key={menu.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">{menu.sira}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {menu.kategori}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{menu.baslik}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono text-xs">{menu.url}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          menu.durum === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {menu.durum === 1 ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <ActionIcon size="sm" variant="outline" onClick={() => handleEdit(menu)}>
                            <PiPencilBold className="h-4 w-4" />
                          </ActionIcon>
                          <ActionIcon size="sm" variant="outline" color="danger" onClick={() => handleDelete(menu.id)}>
                            <PiTrashBold className="h-4 w-4" />
                          </ActionIcon>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* AYARLAR TAB */}
      {activeTab === 'ayarlar' && (
        <div className="pt-6">
          <div className="mb-6">
            <Text className="text-xl font-semibold">Footer Genel Ayarları</Text>
            <Text className="text-sm text-gray-500">Copyright, sosyal medya linkleri vb.</Text>
          </div>

          <div className="space-y-4">
            {ayarlar.map((ayar) => (
              <div key={ayar.id} className="border rounded-lg p-4 bg-white">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <Text className="font-medium">{ayar.anahtar}</Text>
                    {ayar.aciklama && (
                      <Text className="text-xs text-gray-500">{ayar.aciklama}</Text>
                    )}
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">{ayar.tip}</span>
                </div>
                <Textarea
                  value={ayar.deger || ''}
                  onChange={(e) => handleAyarUpdate(ayar.anahtar, e.target.value)}
                  rows={2}
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} size="lg">
        <div className="m-auto px-8 pb-8 pt-6 w-full">
          <Text className="text-xl font-bold mb-7">
            {editingId ? 'Menü Düzenle' : 'Yeni Menü Ekle'}
          </Text>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select
              label="Kategori"
              value={formData.kategori}
              options={KATEGORILER}
              onChange={(value) => setFormData({ ...formData, kategori: (value as any).value })}
              required
            />
            <Input
              label="Başlık"
              value={formData.baslik}
              onChange={(e) => setFormData({ ...formData, baslik: e.target.value })}
              required
            />
            <Input
              label="URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Sıra"
                type="number"
                value={formData.sira}
                onChange={(e) => setFormData({ ...formData, sira: parseInt(e.target.value) || 0 })}
              />
              <Select
                label="Durum"
                value={formData.durum}
                options={[
                  { value: 1, label: 'Aktif' },
                  { value: 0, label: 'Pasif' },
                ]}
                onChange={(value) => setFormData({ ...formData, durum: (value as any).value })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => { setModalOpen(false); resetForm(); }}>
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

