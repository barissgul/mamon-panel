'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, Text, Switch, Checkbox } from 'rizzui';
import toast from 'react-hot-toast';
import {
  getYetki,
  updateYetki,
  UpdateYetkiDto,
} from '@/services/yetkiler.service';
import {
  getAnamenuler,
  getAnamenuAltlar,
  getMenuler,
  updateAnamenu,
  updateAnamenuAlt,
  updateMenu,
  Anamenu,
  AnamenuAlt,
  Menu,
} from '@/services/menu.service';

export default function DuzenleYetkiPage() {
  const router = useRouter();
  const params = useParams();
  const yetkiId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateYetkiDto>({
    yetki: '',
    durum: 1,
  });

  // Menü verileri
  const [anamenuler, setAnamenuler] = useState<Anamenu[]>([]);
  const [anamenuAltlar, setAnamenuAltlar] = useState<AnamenuAlt[]>([]);
  const [menuler, setMenuler] = useState<Menu[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [yetkiData, anamenuData, anamenuAltData, menuData] = await Promise.all([
        getYetki(yetkiId),
        getAnamenuler(),
        getAnamenuAltlar(),
        getMenuler(),
      ]);

      setFormData({
        yetki: yetkiData.yetki,
        durum: yetkiData.durum,
      });
      setAnamenuler(anamenuData);
      setAnamenuAltlar(anamenuAltData);
      setMenuler(menuData);
    } catch (error) {
      toast.error('Veriler yüklenirken hata oluştu');
      router.push('/kullanicilar/yetkiler');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.yetki?.trim()) {
      toast.error('Yetki adı boş olamaz');
      return;
    }

    try {
      setSubmitting(true);
      await updateYetki(yetkiId, formData);
      toast.success('Yetki başarıyla güncellendi');
      router.push('/kullanicilar/yetkiler');
    } catch (error: any) {
      toast.error(error.message || 'Yetki güncellenemedi');
    } finally {
      setSubmitting(false);
    }
  };

  // Yetki ID'lerini kontrol et
  const hasYetki = (yetkiIds: string | undefined): boolean => {
    if (!yetkiIds) return false;
    const ids = yetkiIds.split(',').map((id) => id.trim());
    return ids.includes(yetkiId.toString());
  };

  // Yetki ekle/çıkar
  const toggleYetki = async (
    type: 'anamenu' | 'anamenu-alt' | 'menu',
    id: number,
    currentYetkiIds: string | undefined
  ) => {
    try {
      const ids = currentYetkiIds ? currentYetkiIds.split(',').map((id) => id.trim()) : [];
      const yetkiIdStr = yetkiId.toString();
      
      let newIds: string[];
      if (ids.includes(yetkiIdStr)) {
        // Çıkar
        newIds = ids.filter((id) => id !== yetkiIdStr);
      } else {
        // Ekle
        newIds = [...ids, yetkiIdStr];
      }

      const newYetkiIds = newIds.filter(id => id).join(',');

      if (type === 'anamenu') {
        await updateAnamenu(id, { yetki_ids: newYetkiIds });
        setAnamenuler(prev =>
          prev.map(item =>
            item.id === id ? { ...item, yetki_ids: newYetkiIds } : item
          )
        );
      } else if (type === 'anamenu-alt') {
        await updateAnamenuAlt(id, { yetki_ids: newYetkiIds });
        setAnamenuAltlar(prev =>
          prev.map(item =>
            item.id === id ? { ...item, yetki_ids: newYetkiIds } : item
          )
        );
      } else {
        await updateMenu(id, { yetki_ids: newYetkiIds });
        setMenuler(prev =>
          prev.map(item =>
            item.id === id ? { ...item, yetki_ids: newYetkiIds } : item
          )
        );
      }

      toast.success('Menü yetkisi güncellendi');
    } catch (error) {
      toast.error('Yetki güncellenirken hata oluştu');
    }
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
      <div className="mb-6">
        <Text className="text-2xl font-bold">Yetki Düzenle</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Yetki bilgilerini ve menü erişimlerini yönetin
        </Text>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          {/* Temel Bilgiler */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">Yetki Bilgileri</Text>
            <div className="space-y-4">
              <Input
                label="Yetki Adı"
                placeholder="Örn: Kullanıcı Görüntüleme"
                value={formData.yetki}
                onChange={(e) =>
                  setFormData({ ...formData, yetki: e.target.value })
                }
                required
                size="lg"
                className="[&>label>span]:font-medium"
              />

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
            </div>
          </div>

          {/* Menü Erişim Yönetimi */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <Text className="text-lg font-semibold mb-4">Menü Erişim Yetkileri</Text>
            <Text className="text-sm text-gray-500 mb-4">
              Bu yetkinin erişebileceği menüleri seçin
            </Text>

            <div className="space-y-6">
              {/* Ana Menüler */}
              {anamenuler.map((anamenu) => (
                <div key={`anamenu-${anamenu.id}`} className="border-b pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Checkbox
                      checked={hasYetki(anamenu.yetki_ids)}
                      onChange={() =>
                        toggleYetki('anamenu', anamenu.id, anamenu.yetki_ids)
                      }
                    />
                    <Text className="font-semibold text-base">
                      {anamenu.anamenu} {anamenu.ikon && `(${anamenu.ikon})`}
                    </Text>
                  </div>

                  {/* Alt Menüler */}
                  <div className="ml-8 space-y-3">
                    {anamenuAltlar
                      .filter((alt) => alt.anamenu_id === anamenu.id)
                      .map((anamenuAlt) => (
                        <div key={`alt-${anamenuAlt.id}`}>
                          <div className="flex items-center gap-3 mb-2">
                            <Checkbox
                              checked={hasYetki(anamenuAlt.yetki_ids)}
                              onChange={() =>
                                toggleYetki(
                                  'anamenu-alt',
                                  anamenuAlt.id,
                                  anamenuAlt.yetki_ids
                                )
                              }
                            />
                            <Text className="font-medium">
                              {anamenuAlt.baslik}
                            </Text>
                          </div>

                          {/* Menüler */}
                          <div className="ml-8 space-y-2">
                            {menuler
                              .filter(
                                (menu) => menu.anamenu_alt_id === anamenuAlt.id
                              )
                              .map((menu) => (
                                <div
                                  key={`menu-${menu.id}`}
                                  className="flex items-center gap-3"
                                >
                                  <Checkbox
                                    checked={hasYetki(menu.yetki_ids)}
                                    onChange={() =>
                                      toggleYetki('menu', menu.id, menu.yetki_ids)
                                    }
                                  />
                                  <Text className="text-sm text-gray-600">
                                    {menu.menu}
                                  </Text>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* İşlem Butonları */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              size="lg"
              className="min-w-[120px]"
            >
              İptal
            </Button>
            <Button
              type="submit"
              isLoading={submitting}
              disabled={submitting}
              size="lg"
              className="min-w-[120px]"
            >
              Güncelle
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

