import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { customers, recipes } from '@/data/gameData';
import type { Order } from '@/types';
import { ClipboardList, Clock, CheckCircle, Package, AlertCircle, Timer } from 'lucide-react';

export default function Orders() {
  const { currentSave, completeOrder, updatePatience } = useGameStore();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      updatePatience();
      forceUpdate(n => n + 1);
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, [updatePatience]);

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

  const pendingOrders = orders.filter((o: Order) => o.status === 'pending');
  const deliveryOrders = pendingOrders.filter((o: Order) => o.isDelivery);
  const dineInOrders = pendingOrders.filter((o: Order) => !o.isDelivery);

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-r from-success to-green-400 p-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <ClipboardList size={24} />
          订单管理
        </h1>
      </header>

      <main className="p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 cat-card text-center">
            <div className="text-2xl font-bold text-primary">{orders.length}</div>
            <div className="text-xs text-text-muted">待处理</div>
          </div>
          <div className="flex-1 cat-card text-center">
            <div className="text-2xl font-bold text-success">{currentSave.stats.totalCustomersServed}</div>
            <div className="text-xs text-text-muted">已完成</div>
          </div>
          <div className="flex-1 cat-card text-center">
            <div className="text-2xl font-bold text-warning">{currentSave.stats.deliveryOrdersCompleted}</div>
            <div className="text-xs text-text-muted">外卖</div>
          </div>
        </div>

        {deliveryOrders.length > 0 && (
          <section className="mb-6">
            <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
              <Package size={20} className="text-warning" />
              外卖订单 ({deliveryOrders.length})
            </h2>
            <div className="space-y-3">
              {deliveryOrders.map((order: Order) => {
                const customer = getCustomerInfo(order.customerId);
                const patiencePercentage = (order.patience / order.maxPatience) * 100;
                
                return (
                  <div key={order.id} className="cat-card border-2 border-warning/30">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center text-2xl">
                        {customer.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-text">{customer.name}</h3>
                            <span className="px-2 py-0.5 bg-warning/20 text-warning rounded-full text-xs">
                              外卖
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-accent font-bold">+{order.tip}</span>
                            <span>💰</span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                            <div className="flex items-center gap-1">
                              <Timer size={12} className="text-warning" />
                              <span>配送时限</span>
                            </div>
                            <span className={`font-medium ${order.patience < 30 ? 'text-danger' : 'text-text'}`}>
                              {formatTime(order.patience)}
                            </span>
                          </div>
                          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${getPatienceColor(order.patience, order.maxPatience)}`}
                              style={{ width: `${patiencePercentage}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-xs text-text-muted mb-2">订单内容:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((item, idx) => {
                              const recipe = recipes.find(r => r.id === item.itemId);
                              const hasEnough = (currentSave.finishedDishes[item.itemId] || 0) >= item.quantity;
                              return (
                                <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                                  hasEnough ? 'bg-success/20' : 'bg-danger/20'
                                }`}>
                                  <span className="text-xl">{recipe?.emoji}</span>
                                  <div>
                                    <div className={`text-sm font-medium ${hasEnough ? 'text-success' : 'text-danger'}`}>
                                      {recipe?.name}
                                    </div>
                                    <div className="text-xs text-text-muted">x{item.quantity}</div>
                                  </div>
                                  {!hasEnough && <AlertCircle size={14} className="text-danger" />}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleServeOrder(order.id)}
                      disabled={!order.items.every((item) => (currentSave.finishedDishes[item.itemId] || 0) >= item.quantity)}
                      className={`w-full mt-3 px-4 py-2 rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
                        order.items.every((item) => (currentSave.finishedDishes[item.itemId] || 0) >= item.quantity)
                          ? 'bg-warning text-white hover:bg-warning/90'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Package size={18} />
                      配送订单
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            堂食订单 ({dineInOrders.length})
          </h2>
          
          {dineInOrders.length === 0 ? (
            <div className="cat-card text-center py-8">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-text-muted">暂无堂食订单</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dineInOrders.map((order: Order) => {
                const customer = getCustomerInfo(order.customerId);
                const patiencePercentage = (order.patience / order.maxPatience) * 100;
                
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
                        
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                            <div className="flex items-center gap-1">
                              <Timer size={12} className="text-primary" />
                              <span>耐心值</span>
                            </div>
                            <span className={`font-medium ${order.patience < 20 ? 'text-danger' : 'text-text'}`}>
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
                        
                        <div className="mt-3">
                          <p className="text-xs text-text-muted mb-2">订单内容:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((item, idx) => {
                              const recipe = recipes.find(r => r.id === item.itemId);
                              const hasEnough = (currentSave.finishedDishes[item.itemId] || 0) >= item.quantity;
                              return (
                                <div key={idx} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                                  hasEnough ? 'bg-success/20' : 'bg-danger/20'
                                }`}>
                                  <span className="text-xl">{recipe?.emoji}</span>
                                  <div>
                                    <div className={`text-sm font-medium ${hasEnough ? 'text-success' : 'text-danger'}`}>
                                      {recipe?.name}
                                    </div>
                                    <div className="text-xs text-text-muted">x{item.quantity}</div>
                                  </div>
                                  {!hasEnough && <AlertCircle size={14} className="text-danger" />}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleServeOrder(order.id)}
                      disabled={!order.items.every((item) => (currentSave.finishedDishes[item.itemId] || 0) >= item.quantity)}
                      className={`w-full mt-3 px-4 py-2 rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
                        order.items.every((item) => (currentSave.finishedDishes[item.itemId] || 0) >= item.quantity)
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle size={18} />
                      完成订单
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-text mb-3">订单统计</h2>
          <div className="cat-card">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} className="text-primary" />
                  <span className="text-sm text-text-muted">堂食订单</span>
                </div>
                <div className="text-xl font-bold text-primary">{currentSave.stats.dineInOrdersCompleted}</div>
                <div className="text-sm text-accent">{currentSave.stats.dineInEarnings} 💰</div>
              </div>
              <div className="p-4 bg-warning/10 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Package size={18} className="text-warning" />
                  <span className="text-sm text-text-muted">外卖订单</span>
                </div>
                <div className="text-xl font-bold text-warning">{currentSave.stats.deliveryOrdersCompleted}</div>
                <div className="text-sm text-accent">{currentSave.stats.deliveryEarnings} 💰</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
