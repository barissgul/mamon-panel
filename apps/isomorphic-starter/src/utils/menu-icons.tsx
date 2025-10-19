import {
  PiHouseLine,
  PiChartBar,
  PiTable,
  PiUserCircle,
  PiShieldCheck,
  PiUserPlus,
  PiGear,
  PiShoppingCart,
  PiUsers,
  PiFolder,
  PiFileText,
  PiChartLine,
  PiPackage,
  PiStorefront,
  PiMapPin,
  PiBuildings,
  PiCompass,
  PiAirplaneTilt,
  PiCar,
  PiBoat,
  PiCalendarDots,
  PiTicket,
  PiBrowser,
  PiImage,
  PiMegaphone,
  PiChatCircle,
  PiChats,
  PiCalendar,
  PiWind,
  PiList,
  PiCreditCard,
  PiPaintBrush,
  PiSliders, 
  PiCircle,
  PiChartPie,
} from 'react-icons/pi';

// İkon eşleştirme map'i
export const iconMap: Record<string, React.ReactElement> = {
  // Genel İkonlar
  PiHouseLine: <PiHouseLine />,
  PiChartBar: <PiChartBar />,
  PiTable: <PiTable />,
  PiUserCircle: <PiUserCircle />,
  PiShieldCheck: <PiShieldCheck />,
  PiUserPlus: <PiUserPlus />,
  PiGear: <PiGear />,
  PiShoppingCart: <PiShoppingCart />,
  PiUsers: <PiUsers />,
  PiFolder: <PiFolder />,
  PiFileText: <PiFileText />,
  PiChartLine: <PiChartLine />,
  PiPackage: <PiPackage />,
  PiStorefront: <PiStorefront />,
  
  // Seyahat & Otel Yönetimi İkonları
  PiMapPin: <PiMapPin />,              // Konum
  PiBuildings: <PiBuildings />,        // Otel
  PiCompass: <PiCompass />,            // Tur
  PiAirplaneTilt: <PiAirplaneTilt />,  // Uçak
  PiCar: <PiCar />,                    // Araba
  PiBoat: <PiBoat />,                  // Bot & Yat
  PiCalendarDots: <PiCalendarDots />,  // Etkinlik
  PiTicket: <PiTicket />,              // Etkinlik (alternatif)
  
  // İçerik & Sistem Yönetimi İkonları
  PiBrowser: <PiBrowser />,            // Sayfa
  PiImage: <PiImage />,                // Medya
  PiMegaphone: <PiMegaphone />,        // Duyurular
  PiChatCircle: <PiChatCircle />,      // Talepler
  PiChats: <PiChats />,                // Konular          // Kullanıcı Planlama
  PiWind: <PiWind />,              // Popup
  PiList: <PiList />,                  // Menüler
  PiCreditCard: <PiCreditCard />,      // Ödeme Yöntemleri
  PiPaintBrush: <PiPaintBrush />,      // Tema
  PiSliders: <PiSliders />,            // Ayarlar
  PiGearSix: <PiGear />,               // Seçenekler (PiGear kullanıyoruz)
  PiCircle: <PiCircle />,              // Ayarlar (alternatif)
  PiChartPie: <PiChartPie />,          // Raporlar
};

// Varsayılan ikon
export const defaultIcon = <PiFolder />;

// İkon adından ikon elementi döndür
export function getIconByName(iconName?: string): React.ReactElement {
  if (!iconName) return defaultIcon;
  return iconMap[iconName] || defaultIcon;
}


