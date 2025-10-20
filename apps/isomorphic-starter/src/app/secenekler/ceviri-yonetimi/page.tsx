'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Textarea, Modal, Select } from 'rizzui';
import toast from 'react-hot-toast';
import { PiPencilSimpleBold, PiTrashBold, PiPlusBold, PiCopyBold } from 'react-icons/pi';
import {
  getCevirilerByDilId,
  createCeviri,
  updateCeviri,
  deleteCeviri,
  getKategorilerByDilId,
  Ceviri,
  CreateCeviriDto,
} from '@/services/ceviri.service';
import { getDiller, Dil } from '@/services/dil.service';

export default function CeviriYonetimiPage() {
  const [diller, setDiller] = useState<Dil[]>([]);
  const [selectedDilId, setSelectedDilId] = useState<number | null>(null);
  const [ceviriler, setCeviriler] = useState<Ceviri[]>([]);
  const [kategoriler, setKategoriler] = useState<string[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCeviri, setSelectedCeviri] = useState<Ceviri | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CreateCeviriDto>({
    dil_id: 0,
    anahtar: '',
    deger: '',
    kategori: '',
    aciklama: '',
    durum: 1,
  });

  useEffect(() => {
    loadDiller();
  }, []);

  useEffect(() => {
    if (selectedDilId) {
      loadCeviriler();
      loadKategoriler();
    }
  }, [selectedDilId]);

  const loadDiller = async () => {
    try {
      const data = await getDiller();
      setDiller(data);
      if (data.length > 0) {
        const varsayilan = data.find((d) => d.varsayilan);
        setSelectedDilId(varsayilan?.id || data[0].id);
      }
    } catch (error) {
      toast.error('Diller yüklenemedi');
    }
  };

  const loadCeviriler = async () => {
    if (!selectedDilId) return;
    try {
      setLoading(true);
      const data = await getCevirilerByDilId(selectedDilId);
      setCeviriler(data);
    } catch (error) {
      toast.error('Çeviriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const loadKategoriler = async () => {
    if (!selectedDilId) return;
    try {
      const data = await getKategorilerByDilId(selectedDilId);
      setKategoriler(data);
    } catch (error) {
      console.error('Kategoriler yüklenemedi:', error);
    }
  };

  const handleOpenModal = (ceviri?: Ceviri) => {
    if (ceviri) {
      setEditMode(true);
      setSelectedCeviri(ceviri);
      setFormData({
        dil_id: ceviri.dil_id,
        anahtar: ceviri.anahtar,
        deger: ceviri.deger,
        kategori: ceviri.kategori || '',
        aciklama: ceviri.aciklama || '',
        durum: ceviri.durum,
      });
    } else {
      setEditMode(false);
      setSelectedCeviri(null);
      setFormData({
        dil_id: selectedDilId || 0,
        anahtar: '',
        deger: '',
        kategori: '',
        aciklama: '',
        durum: 1,
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setSelectedCeviri(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editMode && selectedCeviri) {
        await updateCeviri(selectedCeviri.id, formData);
        toast.success('Çeviri güncellendi');
      } else {
        await createCeviri(formData);
        toast.success('Çeviri eklendi');
      }
      await loadCeviriler();
      await loadKategoriler();
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu çeviriyi silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteCeviri(id);
      toast.success('Çeviri silindi');
      await loadCeviriler();
      await loadKategoriler();
    } catch (error: any) {
      toast.error(error.message || 'Çeviri silinemedi');
    }
  };

  // Filtreleme
  const filteredCeviriler = ceviriler.filter((ceviri) => {
    const matchesKategori = selectedKategori === 'all' || ceviri.kategori === selectedKategori;
    const matchesSearch =
      !searchTerm ||
      ceviri.anahtar.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ceviri.deger.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesKategori && matchesSearch;
  });

  if (loading && ceviriler.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Text>Yükleniyor...</Text>
      </div>
    );
  }

  const dilSecenekleri = diller.map((dil) => ({
    value: dil.id.toString(),
    label: `${dil.ad} (${dil.kod.toUpperCase()})`,
  }));

  const kategoriSecenekleri = [
    { value: 'all', label: 'Tüm Kategoriler' },
    ...kategoriler.map((k) => ({ value: k, label: k })),
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Text className="text-2xl font-bold">Çeviri Yönetimi</Text>
          <Text className="text-gray-500 mt-1">
            Sistem çevirilerini dil bazında yönetin
          </Text>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2" disabled={!selectedDilId}>
          <PiPlusBold className="w-4 h-4" />
          Yeni Çeviri Ekle
        </Button>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Dil Seçin"
            value={selectedDilId?.toString()}
            options={dilSecenekleri}
            onChange={(value) => setSelectedDilId(parseInt((value as any).value))}
            size="lg"
          />

          <Select
            label="Kategori"
            value={selectedKategori}
            options={kategoriSecenekleri}
            onChange={(value) => setSelectedKategori((value as any).value)}
            size="lg"
          />

          <Input
            label="Ara"
            placeholder="Anahtar veya değer ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
          />
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <Text className="text-sm text-gray-500">Toplam Çeviri</Text>
          <Text className="text-2xl font-bold mt-1">{ceviriler.length}</Text>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <Text className="text-sm text-gray-500">Aktif Çeviri</Text>
          <Text className="text-2xl font-bold mt-1">
            {ceviriler.filter((c) => c.durum === 1).length}
          </Text>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <Text className="text-sm text-gray-500">Kategori Sayısı</Text>
          <Text className="text-2xl font-bold mt-1">{kategoriler.length}</Text>
        </div>
      </div>

      {/* Çeviri Tablosu */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Anahtar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Değer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCeviriler.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm || selectedKategori !== 'all'
                      ? 'Arama sonucu bulunamadı'
                      : 'Henüz çeviri eklenmemiş'}
                  </td>
                </tr>
              ) : (
                filteredCeviriler.map((ceviri) => (
                  <tr key={ceviri.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Text className="font-medium text-gray-900 font-mono text-sm">
                        {ceviri.anahtar}
                      </Text>
                      {ceviri.aciklama && (
                        <Text className="text-xs text-gray-500 mt-1">{ceviri.aciklama}</Text>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Text className="text-gray-900">{ceviri.deger}</Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ceviri.kategori && (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {ceviri.kategori}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ceviri.durum === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {ceviri.durum === 1 ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(ceviri.anahtar);
                            toast.success('Anahtar kopyalandı');
                          }}
                          className="p-2"
                          title="Anahtarı kopyala"
                        >
                          <PiCopyBold className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(ceviri)}
                          className="p-2"
                        >
                          <PiPencilSimpleBold className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="flat"
                          color="danger"
                          onClick={() => handleDelete(ceviri.id)}
                          className="p-2"
                        >
                          <PiTrashBold className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} size="lg">
        <div className="p-6">
          <Text className="text-xl font-bold mb-6">
            {editMode ? 'Çeviri Düzenle' : 'Yeni Çeviri Ekle'}
          </Text>

          <div className="space-y-4">
            <Input
              label="Anahtar"
              placeholder="home.welcome, common.search vb."
              value={formData.anahtar}
              onChange={(e) => setFormData({ ...formData, anahtar: e.target.value })}
              required
              size="lg"
              className="font-mono"
            />

            <Textarea
              label="Değer (Çeviri)"
              placeholder="Çeviri metni"
              value={formData.deger}
              onChange={(e) => setFormData({ ...formData, deger: e.target.value })}
              required
              rows={3}
              className="[&>label>span]:font-medium"
            />

            <Input
              label="Kategori"
              placeholder="common, home, hotel vb."
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              size="lg"
            />

            <Textarea
              label="Açıklama"
              placeholder="Bu çevirinin ne için kullanıldığı"
              value={formData.aciklama}
              onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
              rows={2}
              className="[&>label>span]:font-medium"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleCloseModal} variant="outline" className="flex-1">
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.anahtar || !formData.deger || loading}
              className="flex-1"
            >
              {loading ? 'İşleniyor...' : editMode ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

