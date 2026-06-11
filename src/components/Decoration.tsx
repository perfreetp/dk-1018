import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Palette, Check, ShoppingCart } from 'lucide-react';

export default function Decoration() {
  const { currentSave, buyDecoration, equipDecoration } = useGameStore();
  const [selectedType, setSelectedType] = useState<string>('all');

  if (!currentSave) return null;

  const types = [
    { id: 'all', label: '全部' },
    { id: 'table', label: '桌椅' },
    { id: 'wallpaper', label: '壁纸' },
    { id: 'floor', label: '地板' },
    { id: 'decoration', label: '装饰' },
  ];

  const filteredDecorations = selectedType === 'all'
    ? currentSave.decorations
    : currentSave.decorations.filter(d => d.type === selectedType);

  const getTypeName = (type: string) => {
    const typeMap: Record<string, string> = {
      table: '桌椅',
      wallpaper: '壁纸',
      floor: '地板',
      decoration: '装饰',
    };
    return typeMap[type] || type;
  };

  const getBonusDescription = (bonus: { type: string; value: number }) => {
    const bonusMap: Record<string, string> = {
      tip: '小费加成',
      patience: '耐心加成',
      speed: '制作速度',
      attract: '吸引顾客',
    };
    return `${bonusMap[bonus.type] || bonus.type} +${bonus.value}%`;
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-r from-accent to-warning p-4">
        <h1 className="text-xl font-bold text-text flex items-center gap-2">
          <Palette size={24} />
          装饰商店
        </h1>
      </header>

      <main className="p-4">
        <div className="cat-card mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {types.map(type => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedType === type.id
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-text-muted hover:bg-secondary/80'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {filteredDecorations.map(decoration => (
            <div
              key={decoration.id}
              className={`cat-card p-4 ${decoration.equipped ? 'ring-2 ring-success' : ''}`}
            >
              <div className="text-center mb-3">
                <div className={`text-4xl mb-2 ${decoration.owned ? '' : 'grayscale opacity-50'}`}>
                  {decoration.emoji}
                </div>
                <h3 className="font-medium text-text">{decoration.name}</h3>
                <p className="text-xs text-text-muted mt-1">{getTypeName(decoration.type)}</p>
              </div>
              
              <div className="bg-secondary/50 rounded-xl p-2 mb-3">
                <p className="text-xs text-text-muted text-center">
                  效果: {getBonusDescription(decoration.bonus)}
                </p>
              </div>

              {decoration.owned ? (
                <div className="flex gap-2">
                  {!decoration.equipped && (
                    <button
                      onClick={() => equipDecoration(decoration.id)}
                      className="flex-1 px-3 py-2 bg-success/20 text-success rounded-full text-sm font-medium flex items-center justify-center gap-1 hover:bg-success/30"
                    >
                      <Check size={14} />
                      装备
                    </button>
                  )}
                  {decoration.equipped && (
                    <div className="flex-1 px-3 py-2 bg-success text-white rounded-full text-sm font-medium text-center">
                      已装备
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => buyDecoration(decoration.id)}
                  disabled={currentSave.gold < decoration.price}
                  className="w-full cat-button flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCart size={16} />
                  购买 ({decoration.price} 💰)
                </button>
              )}
            </div>
          ))}
        </div>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-text mb-3">当前效果</h2>
          <div className="cat-card p-4">
            <div className="grid grid-cols-2 gap-4">
              {['tip', 'patience', 'speed', 'attract'].map(type => {
                const bonus = currentSave.decorations
                  .filter(d => d.equipped && d.bonus.type === type)
                  .reduce((sum, d) => sum + d.bonus.value, 0);
                const bonusMap: Record<string, { label: string; color: string }> = {
                  tip: { label: '小费加成', color: 'text-accent' },
                  patience: { label: '耐心加成', color: 'text-success' },
                  speed: { label: '制作速度', color: 'text-warning' },
                  attract: { label: '吸引顾客', color: 'text-primary' },
                };
                return (
                  <div key={type} className="text-center">
                    <div className={`text-xl font-bold ${bonusMap[type].color}`}>+{bonus}%</div>
                    <div className="text-xs text-text-muted">{bonusMap[type].label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
