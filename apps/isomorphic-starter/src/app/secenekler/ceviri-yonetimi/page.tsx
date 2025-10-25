'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Textarea, Modal, Select } from 'rizzui';
import toast from 'react-hot-toast';
import { PiPencilSimpleBold, PiTrashBold, PiPlusBold } from 'react-icons/pi';
import {
  getCevirilerGrouped,
  updateCeviriGroup,
  deleteCeviriByAnahtar,
  getAllKategoriler,
  CeviriGrouped,
  UpdateCeviriGroupDto,
} from '@/services/ceviri.service';
import { getDiller, Dil } from '@/services/dil.service';

export default function CeviriYonetimiPage() {
  const [diller, setDiller] = useState<Dil[]>([]);
  const [ceviriler, setCeviriler] = useState<CeviriGrouped[]>([]);
  const [kategoriler, setKategoriler] = useState<string[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCeviri, setSelectedCeviri] = useState<CeviriGrouped | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<{
    anahtar: string;
    kategori: string;
    aciklama: string;
    durum: number;
    ceviriler: { [dilId: number]: string };
  }>({
    anahtar: '',
    kategori: '',
    aciklama: '',
    durum: 1,
    ceviriler: {},
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [dillerData, cevirilerData, kategorilerData] = await Promise.all([
        getDiller(),
        getCevirilerGrouped(),
        getAllKategoriler(),
      ]);
      setDiller(dillerData.filter((d) => d.durum === 1));
      setCeviriler(cevirilerData);
      setKategoriler(kategorilerData);
    } catch (error) {
      toast.error('Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (ceviri?: CeviriGrouped) => {
    if (ceviri) {
      setEditMode(true);
      setSelectedCeviri(ceviri);

      const cevirilerObj: { [dilId: number]: string } = {};
      diller.forEach((dil) => {
        const dilCeviri = ceviri.diller[dil.kod];
        cevirilerObj[dil.id] = dilCeviri?.deger || '';
      });

      setFormData({
        anahtar: ceviri.anahtar,
        kategori: ceviri.kategori || '',
        aciklama: ceviri.aciklama || '',
        durum: ceviri.durum,
        ceviriler: cevirilerObj,
      });
    } else {
      setEditMode(false);
      setSelectedCeviri(null);

      const cevirilerObj: { [dilId: number]: string } = {};
      diller.forEach((dil) => {
        cevirilerObj[dil.id] = '';
      });

      setFormData({
        anahtar: '',
        kategori: '',
        aciklama: '',
        durum: 1,
        ceviriler: cevirilerObj,
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
    if (!formData.anahtar.trim()) {
      toast.error('Anahtar kelime boş olamaz');
      return;
    }

    // En az bir dilin dolu olması gerekiyor
    const hasAtLeastOneTranslation = Object.values(formData.ceviriler).some(
      (val) => val.trim() !== ''
    );
    if (!hasAtLeastOneTranslation) {
      toast.error('En az bir dil için çeviri girmelisiniz');
      return;
    }

    try {
      setLoading(true);

      const updateData: UpdateCeviriGroupDto = {
        kategori: formData.kategori,
        aciklama: formData.aciklama,
        durum: formData.durum,
        ceviriler: Object.entries(formData.ceviriler)
          .filter(([_, deger]) => deger.trim() !== '')
          .map(([dil_id, deger]) => ({
            dil_id: parseInt(dil_id),
            deger: deger.trim(),
          })),
      };

      await updateCeviriGroup(formData.anahtar, updateData);
      toast.success(editMode ? 'Çeviriler güncellendi' : 'Çeviriler eklendi');
      await loadData();
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (anahtar: string) => {
    if (!confirm('Bu çeviriyi tüm dillerden silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteCeviriByAnahtar(anahtar);
      toast.success('Çeviri silindi');
      await loadData();
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
      Object.values(ceviri.diller).some((d) =>
        d.deger.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesKategori && matchesSearch;
  });

  if (loading && ceviriler.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Text>Yükleniyor...</Text>
      </div>
    );
  }

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
            Anahtar kelime bazlı tüm dilleri tek satırda yönetin
          </Text>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <PiPlusBold className="w-4 h-4" />
          Yeni Çeviri Ekle
        </Button>
      </div>

      {/* Filtreler */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Kategori"
            value={selectedKategori}
            options={kategoriSecenekleri}
            onChange={(value) => setSelectedKategori((value as any).value)}
            size="lg"
          />

          <Input
            label="Ara"
            placeholder="Anahtar kelime veya çeviri ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
          />
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <Text className="text-sm text-gray-500">Toplam Anahtar Kelime</Text>
          <Text className="text-2xl font-bold mt-1">{ceviriler.length}</Text>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <Text className="text-sm text-gray-500">Aktif Dil</Text>
          <Text className="text-2xl font-bold mt-1">{diller.length}</Text>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">
                  Anahtar Kelime
                </th>
                {diller.map((dil) => (
                  <th
                    key={dil.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {dil.ad} ({dil.kod.toUpperCase()})
                  </th>
                ))}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCeviriler.length === 0 ? (
                <tr>
                  <td
                    colSpan={diller.length + 3}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {searchTerm || selectedKategori !== 'all'
                      ? 'Arama sonucu bulunamadı'
                      : 'Henüz çeviri eklenmemiş'}
                  </td>
                </tr>
              ) : (
                filteredCeviriler.map((ceviri) => (
                  <tr key={ceviri.anahtar} className="hover:bg-gray-50">
                    <td className="px-6 py-4 sticky left-0 bg-white z-10">
                      <Text className="font-bold text-gray-900 font-mono text-sm">
                        {ceviri.anahtar}
                      </Text>
                      {ceviri.aciklama && (
                        <Text className="text-xs text-gray-500 mt-1">{ceviri.aciklama}</Text>
                      )}
                    </td>
                    {diller.map((dil) => {
                      const dilCeviri = ceviri.diller[dil.kod];
                      return (
                        <td key={dil.id} className="px-6 py-4">
                          {dilCeviri ? (
                            <Text className="text-gray-900">{dilCeviri.deger}</Text>
                          ) : (
                            <Text className="text-gray-400 italic text-sm">Çeviri yok</Text>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ceviri.kategori && (
                        <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {ceviri.kategori}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
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
                          onClick={() => handleDelete(ceviri.anahtar)}
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
      <Modal isOpen={modalOpen} onClose={handleCloseModal} size="xl">
        <div className="p-6">
          <Text className="text-xl font-bold mb-6">
            {editMode ? 'Çeviri Düzenle' : 'Yeni Çeviri Ekle'}
          </Text>

          <div className="space-y-4">
            <Input
              label="Anahtar Kelime"
              placeholder="örn: Submit, Continue, Login (büyük-küçük harf duyarlı)"
              value={formData.anahtar}
              onChange={(e) => setFormData({ ...formData, anahtar: e.target.value })}
              required
              size="lg"
              disabled={editMode}
              helperText={
                editMode
                  ? 'Anahtar kelime düzenlenemez. Değiştirmek için silin ve yeniden oluşturun.'
                  : 'Sadece kelime yazın, nokta koymayın! Frontend\'te kategori.anahtar şeklinde kullanılır'
              }
            />

            <Input
              label="Kategori"
              placeholder="örn: common, home, hotel"
              value={formData.kategori}
              onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
              size="lg"
              helperText="Opsiyonel: Çevirileri gruplamak için kullanılır"
            />

            <Textarea
              label="Açıklama"
              placeholder="Bu çevirinin ne için kullanıldığı"
              value={formData.aciklama}
              onChange={(e) => setFormData({ ...formData, aciklama: e.target.value })}
              rows={2}
              className="[&>label>span]:font-medium"
            />

            <div className="border-t pt-4 mt-4">
              <Text className="font-semibold mb-3">Çeviriler</Text>
              <div className="space-y-3">
                {diller.map((dil) => (
                  <Input
                    key={dil.id}
                    label={`${dil.ad} (${dil.kod.toUpperCase()})`}
                    placeholder={`${dil.ad} çevirisi`}
                    value={formData.ceviriler[dil.id] || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ceviriler: {
                          ...formData.ceviriler,
                          [dil.id]: e.target.value,
                        },
                      })
                    }
                    size="lg"
                  />
                ))}
              </div>
              <Text className="text-xs text-gray-500 mt-2">
                * En az bir dil için çeviri girmeniz gerekir
              </Text>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleCloseModal} variant="outline" className="flex-1">
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.anahtar || loading}
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
