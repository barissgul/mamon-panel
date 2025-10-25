'use client';

import { useState, useEffect, useRef } from 'react';
import { Button, Text, Badge, Input, Modal } from 'rizzui';
import {
  PiPlusBold,
  PiTrashBold,
  PiDownloadBold,
  PiEyeBold,
  PiGridFourBold,
  PiListBold,
  PiMagnifyingGlassBold,
  PiMagnifyingGlassPlus,
  PiMagnifyingGlassMinus,
  PiX,
} from 'react-icons/pi';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import toast from 'react-hot-toast';
import {
  getFiles,
  deleteFile,
  uploadFile,
  FileManager,
  formatFileSize,
  getFileIcon,
} from '@/services/file-manager.service';

type ViewMode = 'grid' | 'list';
type FilterCategory = 'all' | 'image' | 'document' | 'video' | 'audio' | 'other';

export default function DosyaYonetimiPage() {
  const [files, setFiles] = useState<FileManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadFileState, setUploadFileState] = useState<File | null>(null);
  const [uploadKategori, setUploadKategori] = useState('');
  const [uploadAciklama, setUploadAciklama] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<FileManager | null>(null);

  useEffect(() => {
    loadFiles();
  }, [filterCategory]);

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedImage]);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const kategori = filterCategory === 'all' ? undefined : filterCategory;
      const data = await getFiles(kategori);
      setFiles(data);
    } catch (error) {
      toast.error('Dosyalar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, dosyaAdi: string) => {
    if (!confirm(`"${dosyaAdi}" dosyasını silmek istediğinizden emin misiniz?`)) {
      return;
    }

    try {
      await deleteFile(id);
      toast.success('Dosya silindi');
      loadFiles();
    } catch (error) {
      toast.error('Dosya silinirken hata oluştu');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileState(file);
    }
  };

  const handleUpload = async () => {
    if (!uploadFileState) {
      toast.error('Lütfen bir dosya seçin');
      return;
    }

    try {
      setUploading(true);
      await uploadFile(uploadFileState, uploadKategori || undefined, uploadAciklama || undefined);
      toast.success('Dosya başarıyla yüklendi');
      setUploadModalOpen(false);
      setUploadFileState(null);
      setUploadKategori('');
      setUploadAciklama('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      loadFiles();
    } catch (error: any) {
      toast.error(error.message || 'Dosya yüklenemedi');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (file: FileManager) => {
    const link = document.createElement('a');
    link.href = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${file.dosya_yolu}`;
    link.download = file.orijinal_dosya_adi;
    link.click();
  };

  const filteredFiles = files.filter((file) => {
    if (searchTerm) {
      return file.orijinal_dosya_adi.toLowerCase().includes(searchTerm.toLowerCase()) ||
             file.aciklama?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="@container">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Text className="text-2xl font-bold">Dosya Yönetimi</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Tüm dosyalarınızı yönetin
          </Text>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <PiListBold className="h-4 w-4" />
            ) : (
              <PiGridFourBold className="h-4 w-4" />
            )}
          </Button>
          <Button
            className="flex items-center gap-2"
            onClick={() => setUploadModalOpen(true)}
          >
            <PiPlusBold className="h-4 w-4" />
            Dosya Yükle
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Dosya ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<PiMagnifyingGlassBold className="h-4 w-4" />}
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Tümü' },
            { value: 'image', label: 'Resim' },
            { value: 'document', label: 'Belge' },
            { value: 'video', label: 'Video' },
            { value: 'audio', label: 'Ses' },
            { value: 'other', label: 'Diğer' }
          ].map((cat) => (
            <Button
              key={cat.value}
              variant={filterCategory === cat.value ? 'solid' : 'outline'}
              size="sm"
              onClick={() => setFilterCategory(cat.value as FilterCategory)}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* File List */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Text className="mb-4">Henüz dosya yüklenmemiş</Text>
          <Button onClick={() => setUploadModalOpen(true)}>İlk Dosyayı Yükle</Button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-md transition-shadow"
            >
              <div className="text-center mb-3">
                {file.kategori === 'image' ? (
                  <img 
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${file.dosya_yolu}`}
                    alt={file.orijinal_dosya_adi}
                    className="w-full h-32 object-cover rounded mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedImage(file)}
                  />
                ) : (
                  <div className="text-4xl mb-2">{getFileIcon(file.dosya_tipi)}</div>
                )}
                <Text className="text-sm font-medium line-clamp-2">{file.orijinal_dosya_adi}</Text>
              </div>
              <div className="space-y-2 text-xs text-gray-500 mb-3">
                <div className="flex justify-between">
                  <span>Boyut:</span>
                  <span>{formatFileSize(file.dosya_boyutu)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kategori:</span>
                  <Badge variant="flat" size="sm">{file.kategori}</Badge>
                </div>
              </div>
              <div className="flex gap-2 pt-3 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDownload(file)}
                >
                  <PiDownloadBold className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  color="danger"
                  onClick={() => handleDelete(file.id, file.orijinal_dosya_adi)}
                >
                  <PiTrashBold className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dosya
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Boyut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tarih
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {file.kategori === 'image' ? (
                        <img 
                          src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${file.dosya_yolu}`}
                          alt={file.orijinal_dosya_adi}
                          className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedImage(file)}
                        />
                      ) : (
                        <span className="text-2xl">{getFileIcon(file.dosya_tipi)}</span>
                      )}
                      <div>
                        <Text className="font-medium">{file.orijinal_dosya_adi}</Text>
                        {file.aciklama && (
                          <Text className="text-sm text-gray-500">{file.aciklama}</Text>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="flat">{file.kategori}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="text-sm">{formatFileSize(file.dosya_boyutu)}</Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text className="text-sm">
                      {new Date(file.olusturma_tarihi).toLocaleDateString('tr-TR')}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(file)}
                      >
                        <PiDownloadBold className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        color="danger"
                        onClick={() => handleDelete(file.id, file.orijinal_dosya_adi)}
                      >
                        <PiTrashBold className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
        <div className="p-6">
          <Text className="text-xl font-bold mb-4">Dosya Yükle</Text>
          
          <div className="space-y-4">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                {uploadFileState ? uploadFileState.name : 'Dosya Seç'}
              </Button>
            </div>

            <Input
              label="Kategori"
              placeholder="image, document, video, audio, other"
              value={uploadKategori}
              onChange={(e) => setUploadKategori(e.target.value)}
            />

            <Input
              label="Açıklama"
              placeholder="Dosya açıklaması..."
              value={uploadAciklama}
              onChange={(e) => setUploadAciklama(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setUploadModalOpen(false)}
              >
                İptal
              </Button>
              <Button
                onClick={handleUpload}
                isLoading={uploading}
                disabled={uploading || !uploadFileState}
              >
                Yükle
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Image Preview Modal - Full Screen */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex flex-col"
          onClick={(e) => {
            // Arka plana tıklanınca kapat
            if (e.target === e.currentTarget) {
              setSelectedImage(null);
            }
          }}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm border-b border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Text className="text-white font-semibold">{selectedImage.orijinal_dosya_adi}</Text>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  <span>{formatFileSize(selectedImage.dosya_boyutu)}</span>
                  <Badge variant="flat" className="bg-gray-700 text-white">{selectedImage.kategori}</Badge>
                  <span>{new Date(selectedImage.olusturma_tarihi).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-white border-gray-600 hover:bg-gray-800"
                  onClick={() => handleDownload(selectedImage)}
                >
                  <PiDownloadBold className="h-4 w-4 mr-2" />
                  İndir
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-white border-gray-600 hover:bg-gray-800 cursor-pointer"
                  onClick={() => setSelectedImage(null)}
                >
                  <PiX className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Image Viewer with Zoom */}
          <div className="flex-1 relative overflow-hidden">
            <TransformWrapper
              minScale={0.1}
              centerOnInit={true}
              limitToBounds={false}
              wheel={{ step: 0.1 }}
            >
              {({ zoomIn, zoomOut, resetTransform }) => (
                <>
                  <TransformComponent wrapperClass="!w-full !h-full">
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}${selectedImage.dosya_yolu}`}
                      alt={selectedImage.orijinal_dosya_adi}
                      className="w-full h-full object-contain"
                    />
                  </TransformComponent>
                  
                  {/* Zoom Controls */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="text"
                      className="text-white hover:bg-white/20"
                      onClick={() => zoomOut()}
                    >
                      <PiMagnifyingGlassMinus className="h-5 w-5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="text"
                      className="text-white hover:bg-white/20"
                      onClick={() => resetTransform()}
                    >
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      variant="text"
                      className="text-white hover:bg-white/20"
                      onClick={() => zoomIn()}
                    >
                      <PiMagnifyingGlassPlus className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              )}
            </TransformWrapper>
          </div>

          {/* Footer */}
          {selectedImage.aciklama && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-gray-800 p-4">
              <Text className="text-white text-sm">{selectedImage.aciklama}</Text>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

