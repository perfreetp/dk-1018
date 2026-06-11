import { useEffect, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { customers, recipes } from '@/data/gameData';
import { Coins, Star, Calendar, Users, Sparkles, Package } from 'lucide-react';

export default function Shop() {
  const { currentSave, addOrder, completeOrder, makeDish, autoSave, updatePatience, nextDay, triggerDeliveryOrder } = useGameStore();
  const orders = currentSave?.orders || [];
  const [showNotification, setShowNotification] = useState<string | null>(null);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      updatePatience();
      if (Math.random() < 0.02 && orders.length < 5) {
        const unlockedCustomers = currentSave?.unlockedCustomers || [];
        if (unlockedCustomers.length > 0) {
          const randomCustomer = unlockedCustomers[Math.floor(Math.random() * unlockedCustomers.length)];
          addOrder(randomCustomer);
        }
      }
      if (Math.random() < 0.005) {
        triggerDeliveryOrder();
      }
    }, 1000);

    const saveLoop = setInterval(() => {
      autoSave();
    }, 30000);

    return () => {
      clearInterval(gameLoop);
      clearInterval(saveLoop);
    };
  }, [currentSave?.unlockedCustomers, orders.length]);

  useEffect(() => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    if (completedOrders.length > 0) {
      setShowNotification('订单完成！💰');
      setTimeout(() => setShowNotification(null), 2000);
    }
  }, [orders]);

  if (!currentSave) return null;

  const handleServeOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    let canServe = true;
    for (const item of order.items) {
      const recipe = recipes.find(r => r.id === item.itemId);
      if (!recipe) {
        canServe = false;
        break;
      }
      
      const inventory = currentSave.inventory;
      for (const ingredient of recipe.ingredients) {
        if (!inventory[ingredient] || inventory[ingredient] <= 0) {
          canServe = false;
          break;
        }
      }
      
      if (!canServe) break;
    }

    if (canServe) {
      order.items.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
          makeDish(item.itemId);
        }
      });
      completeOrder(orderId);
    } else {
      setShowNotification('食材不足！🥲');
      setTimeout(() => setShowNotification(null), 2000);
    }
  };

  const getCustomerInfo = (customerId: string) => {
    if (customerId === 'delivery') {
      return { name: '外卖订单', avatar: '📦' };
    }
    return customers.find(c => c.id === customerId) || { name: '未知', avatar: '🐱' };
  };

  const getPatienceColor = (patience: number, maxPatience: number) => {
    const percentage = (patience / maxPatience) * 100;
    if (percentage > 60) return 'bg-success';
    if (percentage > 30) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-r from-primary to-primary/60 text-white p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏪</span>
            <div>
              <h1 className="font-bold">猫咪点心店</h1>
              <p className="text-xs opacity-80">{currentSave.playerName}的店铺</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <Coins size={16} />
              <span className="font-bold">{currentSave.gold}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} />
              <span className="text-xs">等级 {currentSave.level}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm opacity-90">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>第 {currentSave.dayCount} 天</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{orders.length} 位顾客</span>
          </div>
          <button
            onClick={nextDay}
            className="px-3 py-1 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          >
            结束今天
          </button>
        </div>
      </header>

      {showNotification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-accent text-text px-6 py-3 rounded-full shadow-lg animate-bounce z-50">
          {showNotification}
        </div>
      )}

      <main className="p-4">
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
            <Sparkles size={20} className="text-accent" />
            今日目标
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {currentSave.dailyGoals.map(goal => (
              <div
                key={goal.id}
                className={`cat-card p-3 text-center ${goal.completed ? 'ring-2 ring-success' : ''}`}
              >
                <div className="text-2xl mb-1">{goal.completed ? '✅' : '🎯'}</div>
                <p className="text-xs text-text-muted line-clamp-2">{goal.description}</p>
                <div className="mt-2">
                  <span className={`text-sm font-medium ${goal.completed ? 'text-success' : 'text-text'}`}>
                    {goal.current}/{goal.target}
                  </span>
                </div>
                {goal.completed && (
                  <div className="mt-1 text-xs text-accent">+{goal.reward} 💰</div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
            <Users size={20} className="text-primary" />
            等待中的顾客 ({orders.length})
          </h2>
          {orders.length === 0 ? (
            <div className="cat-card text-center py-8">
              <div className="text-4xl mb-2">🐱</div>
              <p className="text-text-muted">暂无顾客，等待中...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => {
                const customer = getCustomerInfo(order.customerId);
                return (
                  <div key={order.id} className="cat-card">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                        {customer.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-text">{customer.name}</h3>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-accent">+{order.tip}</span>
                            <span>💰</span>
                          </div>
                        </div>
                        <div className="patience-bar mt-2">
                          <div
                            className={`patience-fill ${getPatienceColor(order.patience, order.maxPatience)}`}
                            style={{ width: `${(order.patience / order.maxPatience) * 100}%` }}
                          />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {order.items.map((item, idx) => {
                            const recipe = recipes.find(r => r.id === item.itemId);
                            return (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-secondary rounded-full text-xs"
                              >
                                {recipe?.emoji} {recipe?.name} x{item.quantity}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleServeOrder(order.id)}
                      className="w-full mt-3 cat-button flex items-center justify-center gap-2"
                    >
                      {order.customerId === 'delivery' ? (
                        <>
                          <Package size={18} />
                          配送订单
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} />
                          上菜
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-3">营业统计</h2>
          <div className="cat-card">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3">
                <div className="text-2xl font-bold text-primary">{currentSave.stats.totalCustomersServed}</div>
                <div className="text-xs text-text-muted">总服务顾客</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl font-bold text-accent">{currentSave.stats.totalEarnings}</div>
                <div className="text-xs text-text-muted">总收入</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl font-bold text-success">{currentSave.stats.dishesMade}</div>
                <div className="text-xs text-text-muted">制作甜点</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl font-bold text-warning">{currentSave.stats.tipsEarned}</div>
                <div className="text-xs text-text-muted">获得小费</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
