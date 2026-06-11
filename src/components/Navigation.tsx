import { useGameStore } from '@/store/gameStore';
import { Home, ChefHat, ClipboardList, Cat, Palette, Trophy, Settings } from 'lucide-react';

const navItems = [
  { id: 'shop', label: '店铺', icon: Home },
  { id: 'kitchen', label: '厨房', icon: ChefHat },
  { id: 'orders', label: '订单', icon: ClipboardList },
  { id: 'dormitory', label: '宿舍', icon: Cat },
  { id: 'decoration', label: '装饰', icon: Palette },
  { id: 'collection', label: '图鉴', icon: Trophy },
  { id: 'settings', label: '设置', icon: Settings },
];

export default function Navigation() {
  const { currentPage, setCurrentPage, currentSave } = useGameStore();

  if (!currentSave) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-primary/20 px-4 py-2 z-40">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-text-muted hover:text-primary hover:bg-primary/10'
              }`}
            >
              <Icon size={22} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
