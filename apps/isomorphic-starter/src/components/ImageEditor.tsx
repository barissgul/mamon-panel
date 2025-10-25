'use client';

import { useState } from 'react';
import { Button, Input, Text } from 'rizzui';

interface ImageEditorProps {
  imageUrl: string;
  onSave?: (editedData: any) => void;
}

export default function ImageEditor({ imageUrl, onSave }: ImageEditorProps) {
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [rotate, setRotate] = useState(0);
  const [grayscale, setGrayscale] = useState(false);

  const imageStyle = {
    filter: `
      brightness(${brightness}%)
      contrast(${contrast}%)
      saturate(${saturation}%)
      blur(${blur}px)
      grayscale(${grayscale ? 1 : 0})
    `,
    transform: `rotate(${rotate}deg)`,
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        brightness,
        contrast,
        saturation,
        blur,
        rotate,
        grayscale,
      });
    }
  };

  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setRotate(0);
    setGrayscale(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Önizleme */}
      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[400px]">
        <img
          src={imageUrl}
          alt="Edit"
          style={imageStyle}
          className="max-w-full max-h-96 object-contain transition-all duration-300"
        />
      </div>

      {/* Kontroller */}
      <div className="space-y-4">
        <Text className="font-bold text-lg mb-4">Görsel Düzenleme</Text>

        <div>
          <label className="block text-sm font-medium mb-2">
            Parlaklık: {brightness}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Kontrast: {contrast}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={contrast}
            onChange={(e) => setContrast(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Doygunluk: {saturation}%
          </label>
          <input
            type="range"
            min="0"
            max="200"
            value={saturation}
            onChange={(e) => setSaturation(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Bulanıklık: {blur}px
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={blur}
            onChange={(e) => setBlur(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Döndür: {rotate}°
          </label>
          <input
            type="range"
            min="0"
            max="360"
            value={rotate}
            onChange={(e) => setRotate(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={grayscale}
            onChange={(e) => setGrayscale(e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-sm font-medium">Siyah-Beyaz</label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Sıfırla
          </Button>
          <Button onClick={handleSave} className="flex-1">
            Kaydet
          </Button>
        </div>
      </div>
    </div>
  );
}



