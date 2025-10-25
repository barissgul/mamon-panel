'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Text, Switch } from 'rizzui';
import toast from 'react-hot-toast';
import {
  createYetki,
  CreateYetkiDto,
} from '@/services/yetkiler.service';

export default function YeniYetkiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateYetkiDto>({
    yetki: '',
    durum: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.yetki.trim()) {
      toast.error('Yetki adı boş olamaz');
      return;
    }

    try {
      setLoading(true);
      await createYetki(formData);
      toast.success('Yetki başarıyla oluşturuldu');
      router.push('/kullanicilar/yetkiler');
    } catch (error: any) {
      toast.error(error.message || 'Yetki oluşturulamadı');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="@container">
      <div className="mb-6">
        <Text className="text-2xl font-bold">Yeni Yetki</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Yeni bir yetki tanımı oluşturun
        </Text>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          {/* Form Kartı */}
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
              isLoading={loading}
              disabled={loading}
              size="lg"
              className="min-w-[120px]"
            >
              Oluştur
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

