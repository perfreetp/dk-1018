import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { customers } from '@/data/gameData';
import { Trophy, Star, Lock, Book, ChevronRight } from 'lucide-react';

export default function Collection() {
  const { currentSave } = useGameStore();
  const [selectedTab, setSelectedTab] = useState<'achievements' | 'customers'>('achievements');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  if (!currentSave) return null;

  const completedCount = currentSave.achievements.filter(a => a.completed).length;
  const customerCount = currentSave.unlockedCustomers.length;

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-r from-purple-500 to-primary p-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Trophy size={24} />
          图鉴成就
        </h1>
      </header>

      <main className="p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setSelectedTab('achievements')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              selectedTab === 'achievements'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-muted hover:bg-secondary'
            }`}
          >
            <Trophy size={18} />
            成就 ({completedCount}/{currentSave.achievements.length})
          </button>
          <button
            onClick={() => setSelectedTab('customers')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
              selectedTab === 'customers'
                ? 'bg-primary text-white'
                : 'bg-surface text-text-muted hover:bg-secondary'
            }`}
          >
            <Book size={18} />
            顾客 ({customerCount}/{customers.length})
          </button>
        </div>

        {selectedTab === 'achievements' && (
          <div className="space-y-3">
            {currentSave.achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`cat-card p-4 ${achievement.completed ? 'ring-2 ring-accent' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl ${
                    achievement.completed ? 'bg-accent/20' : 'bg-gray-200'
                  }`}>
                    {achievement.completed ? achievement.icon : <Lock size={24} className="text-gray-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-text">{achievement.name}</h3>
                      {achievement.completed && (
                        <span className="text-xs text-accent font-medium">+{achievement.reward} 💰</span>
                      )}
                    </div>
                    <p className="text-sm text-text-muted mt-1">{achievement.description}</p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                        <span>进度</span>
                        <span>{achievement.progress}/{achievement.target}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            achievement.completed ? 'bg-accent' : 'bg-primary'
                          }`}
                          style={{ width: `${Math.min(100, (achievement.progress / achievement.target) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'customers' && (
          <div className="grid grid-cols-2 gap-3">
            {customers.map(customer => {
              const isUnlocked = currentSave.unlockedCustomers.includes(customer.id);
              return (
                <div
                  key={customer.id}
                  onClick={() => isUnlocked && setSelectedCustomer(customer.id)}
                  className={`cat-card p-4 text-center ${
                    isUnlocked ? 'cursor-pointer hover:scale-[1.02]' : 'opacity-60'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-4xl ${
                    isUnlocked ? 'bg-primary/20' : 'bg-gray-200'
                  }`}>
                    {isUnlocked ? customer.avatar : '❓'}
                  </div>
                  <h3 className={`font-medium ${isUnlocked ? 'text-text' : 'text-text-muted'}`}>
                    {isUnlocked ? customer.name : '???'}
                  </h3>
                  {isUnlocked && (
                    <div className="mt-2 flex items-center justify-center gap-1 text-primary">
                      <span className="text-sm">查看故事</span>
                      <ChevronRight size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {selectedCustomer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedCustomer(null)}
          >
            <div className="cat-card w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full mx-auto bg-primary/20 flex items-center justify-center text-5xl mb-3">
                  {customers.find(c => c.id === selectedCustomer)?.avatar}
                </div>
                <h3 className="text-xl font-bold text-text">
                  {customers.find(c => c.id === selectedCustomer)?.name}
                </h3>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 mb-4">
                <p className="text-sm text-text leading-relaxed">
                  {customers.find(c => c.id === selectedCustomer)?.story}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 mb-4">
                <p className="text-xs text-text-muted">喜欢的甜点:</p>
                <div className="flex gap-1">
                  {customers.find(c => c.id === selectedCustomer)?.favoriteItems.map((_, idx) => (
                    <span key={idx} className="text-lg">🍩</span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full cat-button"
              >
                关闭
              </button>
            </div>
          </div>
        )}

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
            <Star size={20} className="text-accent" />
            成就统计
          </h2>
          <div className="cat-card">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{completedCount}</div>
                <div className="text-xs text-text-muted">已完成成就</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">
                  {currentSave.achievements.filter(a => a.completed).reduce((sum, a) => sum + a.reward, 0)}
                </div>
                <div className="text-xs text-text-muted">成就奖励</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
