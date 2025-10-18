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
} from 'react-icons/pi';

// İkon eşleştirme map'i
export const iconMap: Record<string, React.ReactElement> = {
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
};

// Varsayılan ikon
export const defaultIcon = <PiFolder />;

// İkon adından ikon elementi döndür
export function getIconByName(iconName?: string): React.ReactElement {
  if (!iconName) return defaultIcon;
  return iconMap[iconName] || defaultIcon;
}


