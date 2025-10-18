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
    // Label ekle
    items.push({
      name: anamenu.anamenu,
    });

    // Eğer alt menü yoksa, ana menüyü direkt link olarak ekle
    if (!anamenu.menuler || anamenu.menuler.length === 0) {
      items.push({
        name: anamenu.anamenu,
        href: anamenu.rota,
        icon: getIconByName(anamenu.ikon),
      });
    } else {
      // Alt menüler varsa dropdown olarak ekle
      items.push({
        name: anamenu.anamenu,
        href: '#',
        icon: getIconByName(anamenu.ikon),
        dropdownItems: anamenu.menuler.map((menu) => ({
          name: menu.menu,
          href: menu.rota,
        })),
      });
    }
  });

  return items;
}

