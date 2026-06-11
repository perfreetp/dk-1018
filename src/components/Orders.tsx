import { useGameStore } from '@/store/gameStore';
import { customers, recipes } from '@/data/gameData';
import { ClipboardList, Clock, Coins, CheckCircle, XCircle } from 'lucide-react';

export default function Orders() {
  const { currentSave, completeOrder, makeDish } = useGameStore();

  if (!currentSave) return null;
  
  const orders = currentSave.orders;

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
            <div className="text-2xl font-bold text-danger">{currentSave.dayCount * 10 - currentSave.stats.totalCustomersServed}</div>
            <div className="text-xs text-text-muted">失败</div>
          </div>
        </div>

        <section>
          <h2 className="text-lg font-semibold text-text mb-3 flex items-center gap-2">
            <Clock size={20} className="text-primary" />
            当前订单
          </h2>
          
          {orders.length === 0 ? (
            <div className="cat-card text-center py-8">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-text-muted">暂无订单</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => {
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
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-sm text-accent">
                              <Coins size={14} />
                              +{order.tip}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                            <span>耐心值</span>
                            <span>{Math.round(patiencePercentage)}%</span>
                          </div>
                          <div className="patience-bar">
                            <div
                              className={`patience-fill ${getPatienceColor(order.patience, order.maxPatience)}`}
                              style={{ width: `${patiencePercentage}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-xs text-text-muted mb-2">订单内容:</p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.map((item, idx) => {
                              const recipe = recipes.find(r => r.id === item.itemId);
                              return (
                                <div key={idx} className="flex items-center gap-2 bg-secondary/50 rounded-xl px-3 py-2">
                                  <span className="text-xl">{recipe?.emoji}</span>
                                  <div>
                                    <div className="text-sm font-medium text-text">{recipe?.name}</div>
                                    <div className="text-xs text-text-muted">x{item.quantity}</div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleServeOrder(order.id)}
                        className="flex-1 cat-button flex items-center justify-center gap-2"
                      >
                        <CheckCircle size={18} />
                        完成订单
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-text mb-3">快速统计</h2>
          <div className="cat-card">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-success" />
                  <span className="text-sm text-text-muted">今日完成</span>
                </div>
                <div className="text-xl font-bold text-success mt-1">
                  {currentSave.dailyGoals[0]?.current || 0}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <XCircle size={18} className="text-danger" />
                  <span className="text-sm text-text-muted">今日失败</span>
                </div>
                <div className="text-xl font-bold text-danger mt-1">
                  {Math.max(0, orders.filter(o => o.status === 'failed').length)}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
