'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Text, Modal, ActionIcon, Textarea, Select } from 'rizzui';
import { PiPlusBold, PiPencilBold, PiTrashBold, PiEyeBold } from 'react-icons/pi';
import toast from 'react-hot-toast';
import {
  getAllSablonlar,
  createSablon,
  updateSablon,
  deleteSablon,
  createPreview,
  PaylasimSablon,
  CreatePaylasimSablonDto,
} from '@/services/paylasim-sablon.service';

const LOGO_KONUMLARI = [
  { value: 'ust-sol', label: 'Üst Sol' },
  { value: 'ust-sag', label: 'Üst Sağ' },
  { value: 'alt-sol', label: 'Alt Sol' },
  { value: 'alt-sag', label: 'Alt Sağ' },
  { value: 'merkez', label: 'Merkez' },
];

export default function PaylasimSablonlariPage() {
  const [sablonlar, setSablonlar] = useState<PaylasimSablon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState<CreatePaylasimSablonDto>({
    sablon_adi: '',
    arka_plan_rengi: '#1E40AF',
    baslik_font_size: 54,
    baslik_renk: '#FFFFFF',
    aciklama_font_size: 28,
    aciklama_renk: '#E5E7EB',
    genislik: 1200,
    yukseklik: 630,
    logo_konum: 'ust-sol',
    durum: 1,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllSablonlar();
      setSablonlar(data);
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
        await updateSablon(editingId, formData);
        toast.success('Şablon güncellendi');
      } else {
        await createSablon(formData);
        toast.success('Şablon oluşturuldu');
      }
      setModalOpen(false);
      resetForm();
      loadData();
    } catch (error: any) {
      toast.error(error.message || 'İşlem başarısız');
    }
  };

  const handleEdit = (sablon: PaylasimSablon) => {
    setEditingId(sablon.id);
    setFormData(sablon);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Bu şablonu silmek istediğinizden emin misiniz?')) {
      try {
        await deleteSablon(id);
        toast.success('Şablon silindi');
        loadData();
      } catch (error) {
        toast.error('Silme işlemi başarısız');
      }
    }
  };

  const handlePreview = async (sablon: PaylasimSablon) => {
    try {
      const url = await createPreview(
        sablon.id,
        'Örnek Başlık - Test Otel',
        'Bu bir örnek açıklamadır. Şablonunuzu buradan önizleyebilirsiniz.'
      );
      setPreviewUrl(url);
      setPreviewModalOpen(true);
    } catch (error: any) {
      toast.error(error.message || 'Önizleme oluşturulamadı');
    }
  };

  const resetForm = () => {
    setFormData({
      sablon_adi: '',
      arka_plan_rengi: '#1E40AF',
      baslik_font_size: 54,
      baslik_renk: '#FFFFFF',
      aciklama_font_size: 28,
      aciklama_renk: '#E5E7EB',
      genislik: 1200,
      yukseklik: 630,
      logo_konum: 'ust-sol',
      durum: 1,
    });
    setEditingId(null);
  };

  if (loading) {
    return <div className="flex justify-center py-20">Yükleniyor...</div>;
  }

  return (
    <div className="@container">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Text className="text-xl font-semibold">Paylaşım Şablonları</Text>
          <Text className="text-sm text-gray-500">
            Sosyal medya paylaşımları için görsel şablonlar
          </Text>
        </div>
        <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
          <PiPlusBold className="h-4 w-4" />
          Yeni Şablon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sablonlar.map((sablon) => (
          <div key={sablon.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div
              className="h-40 flex items-center justify-center text-white p-4"
              style={{ background: sablon.arka_plan_rengi }}
            >
              <div className="text-center">
                <h3 className="font-bold text-lg" style={{ color: sablon.baslik_renk }}>
                  {sablon.sablon_adi}
                </h3>
                <p className="text-sm mt-1" style={{ color: sablon.aciklama_renk }}>
                  {sablon.genislik} x {sablon.yukseklik}
                </p>
              </div>
            </div>
            <div className="p-4">
              <Text className="text-sm text-gray-600 mb-3">{sablon.aciklama || 'Açıklama yok'}</Text>
              <div className="flex gap-2">
                <ActionIcon size="sm" variant="outline" onClick={() => handlePreview(sablon)} title="Önizleme">
                  <PiEyeBold className="h-4 w-4" />
                </ActionIcon>
                <ActionIcon size="sm" variant="outline" onClick={() => handleEdit(sablon)}>
                  <PiPencilBold className="h-4 w-4" />
                </ActionIcon>
                <ActionIcon size="sm" variant="outline" color="danger" onClick={() => handleDelete(sablon.id)}>
                  <PiTrashBold className="h-4 w-4" />
                </ActionIcon>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Şablon Oluştur/Düzenle Modal */}
      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} size="xl">
        <div className="m-auto px-8 pb-8 pt-6 w-full">
          <Text className="text-xl font-bold mb-7">{editingId ? 'Şablon Düzenle' : 'Yeni Şablon'}</Text>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input label="Şablon Adı" value={formData.sablon_adi} onChange={(e) => setFormData({...formData, sablon_adi: e.target.value})} required />
            <Textarea label="Açıklama" value={formData.aciklama || ''} onChange={(e) => setFormData({...formData, aciklama: e.target.value})} rows={2} />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Arka Plan Rengi/Gradient" value={formData.arka_plan_rengi} onChange={(e) => setFormData({...formData, arka_plan_rengi: e.target.value})} placeholder="#1E40AF veya gradient..." />
              <Input label="Logo URL" value={formData.logo_url || ''} onChange={(e) => setFormData({...formData, logo_url: e.target.value})} />
            </div>

            <Select label="Logo Konumu" value={formData.logo_konum} options={LOGO_KONUMLARI} onChange={(v) => setFormData({...formData, logo_konum: (v as any).value})} />

            <div className="grid grid-cols-3 gap-4">
              <Input label="Başlık Font Boyutu" type="number" value={formData.baslik_font_size} onChange={(e) => setFormData({...formData, baslik_font_size: parseInt(e.target.value) || 54})} />
              <Input label="Başlık Rengi" value={formData.baslik_renk} onChange={(e) => setFormData({...formData, baslik_renk: e.target.value})} />
              <Input label="Açıklama Font Boyutu" type="number" value={formData.aciklama_font_size} onChange={(e) => setFormData({...formData, aciklama_font_size: parseInt(e.target.value) || 28})} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Genişlik (px)" type="number" value={formData.genislik} onChange={(e) => setFormData({...formData, genislik: parseInt(e.target.value) || 1200})} />
              <Input label="Yükseklik (px)" type="number" value={formData.yukseklik} onChange={(e) => setFormData({...formData, yukseklik: parseInt(e.target.value) || 630})} />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => { setModalOpen(false); resetForm(); }}>İptal</Button>
              <Button type="submit">{editingId ? 'Güncelle' : 'Oluştur'}</Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Önizleme Modal */}
      <Modal isOpen={previewModalOpen} onClose={() => setPreviewModalOpen(false)} size="lg">
        <div className="m-auto px-8 pb-8 pt-6 w-full">
          <Text className="text-xl font-bold mb-4">Şablon Önizlemesi</Text>
          {previewUrl && <img src={`${API_URL}${previewUrl}`} alt="Preview" className="w-full rounded-lg shadow-lg" />}
        </div>
      </Modal>
    </div>
  );
}



