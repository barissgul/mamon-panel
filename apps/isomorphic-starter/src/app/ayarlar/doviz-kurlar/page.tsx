'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Modal, ActionIcon } from 'rizzui';
import {
  PiPlusBold,
  PiPencilBold,
  PiTrashBold,
  PiDownloadBold,
  PiArrowsClockwiseBold,
} from 'react-icons/pi';
import toast from 'react-hot-toast';
import {
  getAllKurlar,
  guncelleTCMBKurlar,
  updateKur,
  deleteKur,
  DovizKur,
  UpdateDovizKurDto,
} from '@/services/doviz-kur.service';

export default function DovizKurlarPage() {
  const [kurlar, setKurlar] = useState<DovizKur[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [defaultMarj, setDefaultMarj] = useState(2.5);
  const [formData, setFormData] = useState<UpdateDovizKurDto>({
    yuzde_marj: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllKurlar();
      setKurlar(data);
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleTCMBGuncelle = async () => {
    try {
      setUpdating(true);
      setConfirmModalOpen(false);
      const result = await guncelleTCMBKurlar(defaultMarj);
      toast.success(result.mesaj);
      console.log('TCMB Güncelleme Detayları:', result.detaylar);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'TCMB kurları güncellenemedi');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarjGuncelle = async (kur: DovizKur) => {
    setEditingId(kur.id);
    setFormData({
      yuzde_marj: kur.yuzde_marj,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingId) return;

    try {
      await updateKur(editingId, formData);
      toast.success('Marj güncellendi');
      setModalOpen(false);
      setEditingId(null);
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'İşlem başarısız');
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      await deleteKur(deletingId);
      toast.success('Kur silindi');
      setDeleteModalOpen(false);
      setDeletingId(null);
      loadData();
    } catch (error) {
      toast.error('Silme işlemi başarısız');
    }
  };

  const guncelKurlar = kurlar.filter(
    (k) => k.kur_tarihi === new Date().toISOString().split('T')[0]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="mb-6">
        <Text className="text-xl font-semibold">Döviz Kur Yönetimi</Text>
        <Text className="text-sm text-gray-500">
          TCMB kurlarını çekin ve marj yönetin
        </Text>
      </div>

      {/* TCMB Güncelleme Bölümü */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
              <PiDownloadBold className="h-5 w-5 text-blue-600" />
              TCMB Kurlarını Güncelle
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Türkiye Cumhuriyet Merkez Bankası'ndan güncel kurları çekin
            </p>
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Varsayılan Marj (%)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={defaultMarj}
                  onChange={(e) =>
                    setDefaultMarj(parseFloat(e.target.value) || 0)
                  }
                  className="w-32"
                />
              </div>
              <Button
                onClick={() => setConfirmModalOpen(true)}
                disabled={updating}
                className="flex items-center gap-2 mt-5"
              >
                <PiArrowsClockwiseBold
                  className={`h-4 w-4 ${updating ? 'animate-spin' : ''}`}
                />
                {updating ? 'Güncelleniyor...' : 'TCMB\'den Çek'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Güncel Kurlar */}
      <div className="bg-white rounded-lg border border-gray-200 mb-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <Text className="font-semibold">
            Bugünün Kurları ({new Date().toLocaleDateString('tr-TR')})
          </Text>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Para Birimi
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  TCMB Alış
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  TCMB Satış
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Marj %
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Bizim Alış
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Bizim Satış
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold">
                  Son Güncelleme
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {guncelKurlar.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Bugün için henüz kur bilgisi yok. "TCMB'den Çek" ile
                    güncelleyin.
                  </td>
                </tr>
              ) : (
                guncelKurlar.map((kur) => (
                  <tr key={kur.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-bold text-lg">{kur.para_birimi}</p>
                        <p className="text-xs text-gray-600">{kur.para_adi}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {Number(kur.tcmb_alis).toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm">
                      {Number(kur.tcmb_satis).toFixed(4)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex rounded-md bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                        +%{Number(kur.yuzde_marj).toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-green-700 font-mono">
                        {Number(kur.alis_kuru).toFixed(4)} ₺
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-blue-700 font-mono">
                        {Number(kur.satis_kuru).toFixed(4)} ₺
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500">
                      {new Date(kur.son_guncelleme).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ActionIcon
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarjGuncelle(kur)}
                          title="Marj Düzenle"
                        >
                          <PiPencilBold className="h-4 w-4" />
                        </ActionIcon>
                        <ActionIcon
                          size="sm"
                          variant="outline"
                          color="danger"
                          onClick={() => handleDeleteClick(kur.id)}
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

      {/* Bilgilendirme */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-900 mb-2">💡 Nasıl Çalışır?</h4>
        <ul className="text-sm text-yellow-800 space-y-1">
          <li>
            • <strong>TCMB'den Çek:</strong> Merkez Bankası'ndan güncel kurları
            otomatik çeker
          </li>
          <li>
            • <strong>Marj:</strong> TCMB kuruna eklenen yüzde (örn: %2.5 = TCMB
            kuru + %2.5)
          </li>
          <li>
            • <strong>Bizim Alış:</strong> Site'de müşteriye gösterilen kur
          </li>
          <li>
            • <strong>Marj Düzenle:</strong> Para birimine özel marj ayarlayın
          </li>
        </ul>
      </div>

      {/* TCMB Güncelleme Onay Modal */}
      <Modal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        size="sm"
      >
        <div className="m-auto px-8 pb-8 pt-6 w-full">
          <div className="mb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <PiArrowsClockwiseBold className="h-8 w-8 text-blue-600" />
            </div>
            <Text className="text-xl font-bold mb-2">TCMB Kurlarını Güncelle</Text>
            <Text className="text-sm text-gray-600">
              Türkiye Cumhuriyet Merkez Bankası'ndan güncel kurlar çekilecek ve{' '}
              <strong className="text-blue-600">%{defaultMarj}</strong> marj ile
              güncellenecek.
            </Text>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <Text className="text-sm text-yellow-800">
              ⚠️ Mevcut günün kurları varsa üzerine yazılacaktır.
            </Text>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmModalOpen(false)}
              className="flex-1"
            >
              İptal
            </Button>
            <Button onClick={handleTCMBGuncelle} className="flex-1">
              Evet, Güncelle
            </Button>
          </div>
        </div>
      </Modal>

      {/* Silme Onay Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingId(null);
        }}
        size="sm"
      >
        <div className="m-auto px-8 pb-8 pt-6 w-full">
          <div className="mb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <PiTrashBold className="h-8 w-8 text-red-600" />
            </div>
            <Text className="text-xl font-bold mb-2">Kur Kaydını Sil</Text>
            <Text className="text-sm text-gray-600">
              Bu kur kaydını silmek istediğinizden emin misiniz?
            </Text>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setDeleteModalOpen(false);
                setDeletingId(null);
              }}
              className="flex-1"
            >
              İptal
            </Button>
            <Button onClick={handleDeleteConfirm} color="danger" className="flex-1">
              Evet, Sil
            </Button>
          </div>
        </div>
      </Modal>

      {/* Marj Düzenleme Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingId(null);
        }}
        size="sm"
      >
        <div className="m-auto px-8 pb-8 pt-6 w-full">
          <Text className="text-xl font-bold mb-7">Marj Oranını Güncelle</Text>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Marj Yüzdesi (%)"
              type="number"
              step="0.1"
              value={formData.yuzde_marj}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  yuzde_marj: parseFloat(e.target.value) || 0,
                })
              }
              helperText="Örnek: 2.5 girerseniz TCMB kuruna %2.5 eklenir"
            />

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setModalOpen(false);
                  setEditingId(null);
                }}
              >
                İptal
              </Button>
              <Button type="submit">Güncelle</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

