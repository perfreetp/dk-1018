import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Cat, Heart, Moon, Zap, Plus, Bed, AlertTriangle } from 'lucide-react';

export default function Dormitory() {
  const { currentSave, hireEmployee, assignWork, restEmployee, updateEmployees } = useGameStore();
  const [showHireModal, setShowHireModal] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');

  useEffect(() => {
    const energyInterval = setInterval(() => {
      updateEmployees();
    }, 200);
    
    return () => clearInterval(energyInterval);
  }, [updateEmployees]);

  if (!currentSave) return null;

  const handleHire = () => {
    if (newEmployeeName.trim()) {
      hireEmployee(newEmployeeName.trim());
      setNewEmployeeName('');
      setShowHireModal(false);
    }
  };

  const getEnergyColor = (energy: number) => {
    if (energy > 60) return 'bg-success';
    if (energy > 30) return 'bg-warning';
    return 'bg-danger';
  };

  const getEnergyStatus = (energy: number) => {
    if (energy > 60) return '精力充沛';
    if (energy > 30) return '有点累了';
    if (energy > 0) return '筋疲力尽';
    return '已罢工';
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-gradient-to-r from-purple-400 to-primary p-4">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Cat size={24} />
          猫咪宿舍
        </h1>
      </header>

      <main className="p-4">
        <div className="cat-card mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text">我的员工</h2>
            <button
              onClick={() => setShowHireModal(true)}
              disabled={currentSave.gold < 300}
              className="cat-button text-sm flex items-center gap-1 disabled:opacity-50"
            >
              <Plus size={16} />
              雇佣猫咪 (300 💰)
            </button>
          </div>
          
          {currentSave.employees.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🐱</div>
              <p className="text-text-muted">还没有员工</p>
            </div>
          ) : (
            <div className="space-y-3">
              {currentSave.employees.map(employee => (
                <div
                  key={employee.id}
                  className={`cat-card p-4 ${!employee.isWorking ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                      employee.isWorking ? 'bg-primary/20' : 'bg-gray-200'
                    }`}>
                      {employee.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-text">{employee.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          employee.type === 'chef' 
                            ? 'bg-warning/20 text-warning' 
                            : 'bg-primary/20 text-primary'
                        }`}>
                          {employee.type === 'chef' ? '主厨' : '店员'}
                        </span>
                        {employee.energy <= 20 && employee.isWorking && (
                          <span className="px-2 py-0.5 bg-danger/20 text-danger rounded-full text-xs flex items-center gap-1">
                            <AlertTriangle size={12} />
                            体力不足
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-muted mt-1">等级 {employee.level}</p>
                      
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                          <div className="flex items-center gap-1">
                            <Heart size={12} className={employee.energy > 30 ? 'text-danger' : 'text-gray-400'} />
                            <span>体力</span>
                          </div>
                          <span>{Math.round(employee.energy)}% - {getEnergyStatus(employee.energy)}</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-200 ${getEnergyColor(employee.energy)}`}
                            style={{ width: `${employee.energy}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-xs text-text-muted mb-2">
                        {employee.isWorking ? (
                          <span className="flex items-center gap-1 text-success">
                            <Zap size={14} />
                            工作中
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-warning">
                            <Moon size={14} />
                            休息中
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {employee.isWorking ? (
                          <button
                            onClick={() => restEmployee(employee.id)}
                            className="px-3 py-2 bg-warning/20 text-warning rounded-full text-sm font-medium flex items-center gap-1 hover:bg-warning/30 transition-colors"
                          >
                            <Bed size={14} />
                            休息
                          </button>
                        ) : (
                          <button
                            onClick={() => assignWork(employee.id)}
                            className="px-3 py-2 bg-success/20 text-success rounded-full text-sm font-medium flex items-center gap-1 hover:bg-success/30 transition-colors"
                          >
                            <Zap size={14} />
                            工作
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <section>
          <h2 className="text-lg font-semibold text-text mb-3">员工福利</h2>
          <div className="cat-card p-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                  <Heart size={18} className="text-success" />
                </div>
                <div>
                  <h4 className="font-medium text-text">体力系统</h4>
                  <p className="text-xs text-text-muted">工作会消耗体力，休息会恢复体力（实时更新）</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                  <Zap size={18} className="text-warning" />
                </div>
                <div>
                  <h4 className="font-medium text-text">自动接单</h4>
                  <p className="text-xs text-text-muted">工作中的猫咪员工会自动帮忙处理订单</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center">
                  <AlertTriangle size={18} className="text-danger" />
                </div>
                <div>
                  <h4 className="font-medium text-text">体力警告</h4>
                  <p className="text-xs text-text-muted">体力低于20%时工作效率大幅下降</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bed size={18} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-text">每日恢复</h4>
                  <p className="text-xs text-text-muted">结束一天后所有员工恢复25%体力</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-lg font-semibold text-text mb-3">工作统计</h2>
          <div className="cat-card">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {currentSave.employees.filter(e => e.isWorking).length}
                </div>
                <div className="text-xs text-text-muted">工作中</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {currentSave.employees.filter(e => !e.isWorking).length}
                </div>
                <div className="text-xs text-text-muted">休息中</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showHireModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="cat-card w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">雇佣猫咪员工</h3>
              <button
                onClick={() => {
                  setShowHireModal(false);
                  setNewEmployeeName('');
                }}
                className="text-text-muted hover:text-text"
              >
                ✕
              </button>
            </div>
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🐱</div>
              <p className="text-text-muted">给新员工起个名字吧</p>
              <p className="text-sm text-accent mt-1">费用: 300 💰</p>
            </div>
            <input
              type="text"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              placeholder="猫咪名字"
              className="cat-input mb-4"
              maxLength={10}
            />
            <button
              onClick={handleHire}
              disabled={!newEmployeeName.trim() || currentSave.gold < 300}
              className="w-full cat-button disabled:opacity-50"
            >
              雇佣
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
