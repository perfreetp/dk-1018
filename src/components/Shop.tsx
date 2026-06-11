import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { customers, recipes } from '@/data/gameData';
import type { Order } from '@/types';
import { Coins, Star, Calendar, Users, Sparkles, Package, AlertCircle, Timer } from 'lucide-react';

export default function Shop() {
  const { 
    currentSave, 
    addOrder, 
    completeOrder, 
    nextDay, 
    triggerDeliveryOrder,
  } = useGameStore();
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!currentSave) return;
    
    const orderInterval = setInterval(() => {
      const orders = currentSave.orders;
      if (Math.random() < 0.02 && orders.length < 5) {
        const unlockedCustomers = currentSave.unlockedCustomers || [];
        if (unlockedCustomers.length > 0) {
          const randomCustomer = unlockedCustomers[Math.floor(Math.random() * unlockedCustomers.length)];
          addOrder(randomCustomer);
        }
      }
      if (Math.random() < 0.005) {
        triggerDeliveryOrder();
      }
      forceUpdate(n => n + 1);
    }, 1000);

    return () => {
      clearInterval(orderInterval);
    };
  }, [currentSave]);

  if (!currentSave) return null;

  const orders = currentSave.orders;

  const handleServeOrder = (orderId: string) => {
    const order = orders.find((o: Order) => o.id === orderId);
    if (!order) return;

    const canServe = order.items.every((item) => {
      const currentCount = currentSave.finishedDishes[item.itemId] || 0;
      return currentCount >= item.quantity;
    });

    if (canServe) {
      completeOrder(orderId);
    } else {
      setShowNotification('成品不足！去厨房制作吧~');
      setTimeout(() => setShowNotification(null), 2000);
    }
  };

  const getCustomerInfo = (customerId: string) => {
    if (customerId === 'delivery') {
      return { name: '外卖订单', avatar: '📦', isDelivery: true };
    }
    const customer = customers.find(c => c.id === customerId);
    return { name: customer?.name || '未知', avatar: customer?.avatar || '🐱', isDelivery: false };
  };

  const getPatienceColor = (patience: number, maxPatience: number) => {
    const percentage = (patience / maxPatience) * 100;
    if (percentage > 60) return 'bg-success';
    if (percentage > 30) return 'bg-warning';
    return 'bg-danger';
  };

  const formatTime = (patience: number) => {
    const seconds = Math.ceil(patience);
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${seconds}秒`;
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
              {orders.map((order: Order) => {
                const customer = getCustomerInfo(order.customerId);
                const patiencePercentage = (order.patience / order.maxPatience) * 100;
                
                return (
                  <div key={order.id} className="cat-card">
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        customer.isDelivery ? 'bg-warning/20' : 'bg-primary/20'
                      }`}>
                        {customer.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-text">{customer.name}</h3>
                            {customer.isDelivery && (
                              <span className="px-2 py-0.5 bg-warning/20 text-warning rounded-full text-xs">
                                外卖
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-accent">+{order.tip}</span>
                            <span>💰</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                            <div className="flex items-center gap-1">
                              <Timer size={12} className={customer.isDelivery ? 'text-warning' : 'text-primary'} />
                              <span>{customer.isDelivery ? '配送时限' : '耐心值'}</span>
                            </div>
                            <span className={`font-medium ${order.patience < (customer.isDelivery ? 30 : 20) ? 'text-danger' : 'text-text'}`}>
                              {formatTime(order.patience)}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${getPatienceColor(order.patience, order.maxPatience)}`}
                              style={{ width: `${patiencePercentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {order.items.map((item, idx) => {
                            const recipe = recipes.find(r => r.id === item.itemId);
                            const hasEnough = (currentSave.finishedDishes[item.itemId] || 0) >= item.quantity;
                            return (
                              <span
                                key={idx}
                                className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${
                                  hasEnough ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                                }`}
                              >
                                {recipe?.emoji} {recipe?.name} x{item.quantity}
                                {!hasEnough && <AlertCircle size={12} />}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleServeOrder(order.id)}
                      disabled={!order.items.every((item) => (currentSave.finishedDishes[item.itemId] || 0) >= item.quantity)}
                      className={`w-full mt-3 px-4 py-2 rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
                        order.items.every((item) => (currentSave.finishedDishes[item.itemId] || 0) >= item.quantity)
                          ? 'cat-button'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
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

        <section className="mb-6">
          <h2 className="text-lg font-semibold text-text mb-3">成品库存</h2>
          <div className="cat-card">
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(currentSave.finishedDishes).map(([recipeId, count]) => {
                const recipe = recipes.find(r => r.id === recipeId);
                return (
                  <div key={recipeId} className="text-center p-2 bg-secondary/50 rounded-xl">
                    <div className="text-xl mb-1">{recipe?.emoji}</div>
                    <div className="text-xs text-text-muted truncate">{recipe?.name}</div>
                    <div className="text-sm font-bold text-primary">{count}</div>
                  </div>
                );
              })}
              {Object.keys(currentSave.finishedDishes).length === 0 && (
                <div className="col-span-4 text-center py-4 text-text-muted">
                  <div className="text-2xl mb-2">🍩</div>
                  <span>暂无成品，去厨房制作吧</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text mb-3">营业统计</h2>
          <div className="cat-card">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{currentSave.stats.totalCustomersServed}</div>
                <div className="text-xs text-text-muted">总服务顾客</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{currentSave.stats.totalEarnings}</div>
                <div className="text-xs text-text-muted">总收入</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{currentSave.stats.dishesMade}</div>
                <div className="text-xs text-text-muted">制作甜点</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{currentSave.stats.tipsEarned}</div>
                <div className="text-xs text-text-muted">获得小费</div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h3 className="text-sm font-medium text-text-muted mb-3 text-center">收入分类</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-primary/10 rounded-xl">
                  <div className="text-xl font-bold text-primary">{currentSave.stats.dineInOrdersCompleted}</div>
                  <div className="text-xs text-text-muted">堂食订单</div>
                  <div className="text-sm font-medium text-accent">{currentSave.stats.dineInEarnings} 💰</div>
                </div>
                <div className="text-center p-3 bg-warning/10 rounded-xl">
                  <div className="text-xl font-bold text-warning">{currentSave.stats.deliveryOrdersCompleted}</div>
                  <div className="text-xs text-text-muted">外卖订单</div>
                  <div className="text-sm font-medium text-accent">{currentSave.stats.deliveryEarnings} 💰</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
