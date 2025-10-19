'use client';

import { useEffect, useState } from 'react';
import { getAnamenuler, type Anamenu } from '@/services/menu.service';
import { getIconByName } from '@/utils/menu-icons';

export interface MenuItem {
  name: string;
  href?: string;
  icon?: React.ReactElement;
  badge?: string;
  dropdownItems?: {
    name: string;
    href: string;
    badge?: string;
  }[];
}

export function useDynamicMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenu() {
      try {
        const anamenuler = await getAnamenuler();
        const items = transformToMenuItems(anamenuler);
        setMenuItems(items);
      } catch (error) {
        console.error('Menü yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  return { menuItems, loading };
}

function transformToMenuItems(anamenuler: Anamenu[]): MenuItem[] {
  const items: MenuItem[] = [];

  anamenuler.forEach((anamenu) => {
    // Anamenu başlığını label olarak ekle
    items.push({
      name: anamenu.anamenu,
    });

    // Anamenu altındaki anamenuAltları işle
    if (anamenu.anamenuAltlar && anamenu.anamenuAltlar.length > 0) {
      anamenu.anamenuAltlar
        .filter((anamenuAlt) => anamenuAlt.durum === 1) // Sadece aktif olanları göster
        .forEach((anamenuAlt) => {
          // Eğer anamenuAlt'ın altında menuler varsa dropdown, yoksa direkt link
          if (anamenuAlt.menuler && anamenuAlt.menuler.length > 0) {
            // Alt menüler varsa dropdown
            items.push({
              name: anamenuAlt.baslik,
              href: '#',
              icon: getIconByName(anamenuAlt.ikon),
              dropdownItems: anamenuAlt.menuler.map((menu) => ({
                name: menu.menu,
                href: menu.rota,
              })),
            });
          } else {
            // Alt menü yoksa anamenuAlt'ı direkt link olarak ekle
            items.push({
              name: anamenuAlt.baslik,
              href: anamenuAlt.rota,
              icon: getIconByName(anamenuAlt.ikon),
            });
          }
        });
    }
  });

  return items;
}

