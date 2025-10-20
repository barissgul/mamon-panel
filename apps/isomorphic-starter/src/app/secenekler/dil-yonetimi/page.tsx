'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Switch, Modal } from 'rizzui';
import toast from 'react-hot-toast';
import { PiPencilSimpleBold, PiTrashBold, PiPlusBold, PiStarBold } from 'react-icons/pi';
import {
  getDiller,
  createDil,
  updateDil,
  deleteDil,
  setVarsayilanDil,
  Dil,
  CreateDilDto,
} from '@/services/dil.service';

export default function DilYonetimiPage() {
  const [diller, setDiller] = useState<Dil[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedDil, setSelectedDil] = useState<Dil | null>(null);
  const [formData, setFormData] = useState<CreateDilDto>({
    kod: '',
    ad: '',
    yerel_ad: '',
    varsayilan: false,
    durum: 1,
  });

  useEffect(() => {
    loadDiller();
  }, []);

  const loadDiller = async () => {
    try {
      setLoading(true);
      const data = await getDiller();
      setDiller(data);
    } catch (error) {
      toast.error('Diller yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dil?: Dil) => {
    if (dil) {
      setEditMode(true);
      setSelectedDil(dil);
      setFormData({
        kod: dil.kod,
        ad: dil.ad,
        yerel_ad: dil.yerel_ad || '',
        varsayilan: dil.varsayilan,
        durum: dil.durum,
      });
    } else {
      setEditMode(false);
      setSelectedDil(null);
      setFormData({
        kod: '',
        ad: '',
        yerel_ad: '',
        varsayilan: false,
        durum: 1,
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditMode(false);
    setSelectedDil(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (editMode && selectedDil) {
        await updateDil(selectedDil.id, formData);
        toast.success('Dil güncellendi');
      } else {
        await createDil(formData);
        toast.success('Dil eklendi');
      }
      await loadDiller();
      handleCloseModal();
    } catch (error: any) {
      toast.error(error.message || 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu dili silmek istediğinizden emin misiniz?')) return;

    try {
      await deleteDil(id);
      toast.success('Dil silindi');
      await loadDiller();
    } catch (error: any) {
      toast.error(error.message || 'Dil silinemedi');
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setVarsayilanDil(id);
      toast.success('Varsayılan dil ayarlandı');
      await loadDiller();
    } catch (error: any) {
      toast.error(error.message || 'Varsayılan dil ayarlanamadı');
    }
  };

  if (loading && diller.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Text>Yükleniyor...</Text>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Text className="text-2xl font-bold">Dil Yönetimi</Text>
          <Text className="text-gray-500 mt-1">Sistem dillerini yönetin</Text>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <PiPlusBold className="w-4 h-4" />
          Yeni Dil Ekle
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kod
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dil Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yerel Adı
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Varsayılan
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
              {diller.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Henüz dil eklenmemiş
                  </td>
                </tr>
              ) : (
                diller.map((dil) => (
                  <tr key={dil.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text className="font-medium text-gray-900">{dil.kod.toUpperCase()}</Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text className="text-gray-900">{dil.ad}</Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Text className="text-gray-600">{dil.yerel_ad || '-'}</Text>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {dil.varsayilan ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <PiStarBold className="w-3 h-3 mr-1" />
                          Varsayılan
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetDefault(dil.id)}
                          className="text-xs"
                        >
                          Varsayılan Yap
                        </Button>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          dil.durum === 1
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {dil.durum === 1 ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenModal(dil)}
                          className="p-2"
                        >
                          <PiPencilSimpleBold className="w-4 h-4" />
                        </Button>
                        {!dil.varsayilan && (
                          <Button
                            size="sm"
                            variant="flat"
                            color="danger"
                            onClick={() => handleDelete(dil.id)}
                            className="p-2"
                          >
                            <PiTrashBold className="w-4 h-4" />
                          </Button>
                        )}
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
            {editMode ? 'Dil Düzenle' : 'Yeni Dil Ekle'}
          </Text>

          <div className="space-y-4">
            <Input
              label="Dil Kodu"
              placeholder="tr, en, de, ru, ja vb."
              value={formData.kod}
              onChange={(e) => setFormData({ ...formData, kod: e.target.value.toLowerCase() })}
              required
              size="lg"
            />

            <Input
              label="Dil Adı (Türkçe)"
              placeholder="Türkçe, İngilizce, Japonca vb."
              value={formData.ad}
              onChange={(e) => setFormData({ ...formData, ad: e.target.value })}
              required
              size="lg"
            />

            <Input
              label="Yerel Adı"
              placeholder="日本語, English, Deutsch vb."
              value={formData.yerel_ad}
              onChange={(e) => setFormData({ ...formData, yerel_ad: e.target.value })}
              size="lg"
            />

            <div className="flex items-center gap-3">
              <Switch
                checked={formData.varsayilan || false}
                onChange={(checked) => setFormData({ ...formData, varsayilan: checked })}
              />
              <Text>Varsayılan dil olarak ayarla</Text>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={formData.durum === 1}
                onChange={(checked) => setFormData({ ...formData, durum: checked ? 1 : 0 })}
              />
              <Text>Aktif</Text>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button onClick={handleCloseModal} variant="outline" className="flex-1">
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!formData.kod || !formData.ad || loading}
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

