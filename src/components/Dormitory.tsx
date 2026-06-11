import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { Cat, Heart, Moon, Zap, Plus, Bed } from 'lucide-react';

export default function Dormitory() {
  const { currentSave, hireEmployee, assignWork, restEmployee } = useGameStore();
  const [showHireModal, setShowHireModal] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');

  if (!currentSave) return null;

  const handleHire = () => {
    if (newEmployeeName.trim()) {
      hireEmployee(newEmployeeName.trim());
      setNewEmployeeName('');
      setShowHireModal(false);
    }
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
            <div className="grid grid-cols-2 gap-3">
              {currentSave.employees.map(employee => (
                <div
                  key={employee.id}
                  className={`cat-card p-3 ${employee.isWorking ? '' : 'opacity-70'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl ${
                      employee.isWorking ? 'bg-primary/20' : 'bg-gray-200'
                    }`}>
                      {employee.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-text">{employee.name}</h3>
                      <p className="text-xs text-text-muted">
                        {employee.type === 'chef' ? '主厨' : '猫咪店员'}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Heart size={12} className="text-danger" />
                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              employee.energy > 60 ? 'bg-success' : employee.energy > 30 ? 'bg-warning' : 'bg-danger'
                            }`}
                            style={{ width: `${(employee.energy / employee.maxEnergy) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-muted">{employee.energy}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    {employee.isWorking ? (
                      <button
                        onClick={() => restEmployee(employee.id)}
                        className="flex-1 px-3 py-2 bg-warning/20 text-warning rounded-full text-sm font-medium flex items-center justify-center gap-1 hover:bg-warning/30"
                      >
                        <Moon size={14} />
                        休息
                      </button>
                    ) : (
                      <button
                        onClick={() => assignWork(employee.id)}
                        className="flex-1 px-3 py-2 bg-success/20 text-success rounded-full text-sm font-medium flex items-center justify-center gap-1 hover:bg-success/30"
                      >
                        <Zap size={14} />
                        工作
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <section>
          <h2 className="text-lg font-semibold text-text mb-3">员工福利</h2>
          <div className="cat-card p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bed size={18} className="text-primary" />
                  <span className="text-sm text-text">休息恢复体力</span>
                </div>
                <span className="text-xs text-text-muted">每天+20%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart size={18} className="text-danger" />
                  <span className="text-sm text-text">体力低于30%效率下降</span>
                </div>
                <span className="text-xs text-text-muted">效率-50%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={18} className="text-warning" />
                  <span className="text-sm text-text">工作猫咪自动接单</span>
                </div>
                <span className="text-xs text-success">自动处理</span>
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
